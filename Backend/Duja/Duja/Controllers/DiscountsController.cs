using AutoMapper;
using Duja.DTOs.Discounts;
using Duja.Models;
using Duja.UnitOfWorks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Duja.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DiscountsController : ControllerBase
    {
        private readonly UnitOfWork unit;
        private readonly IMapper mapper;


        public DiscountsController(UnitOfWork unit, IMapper mapper)
        {
            this.unit = unit;
            this.mapper = mapper;
        }
        [HttpGet("{id}")]
        [EndpointSummary("Get Discount By Id")]
        public async Task<IActionResult> GetDiscountById(int id)
        {
            var discount = await unit.DiscountRepository.GetByIdWithProducts(id);

            if (discount == null)
                return NotFound(new { message = "Discount not found." });

            var mappedDiscount = mapper.Map<DiscountDTO>(discount);
            return Ok(mappedDiscount);
        }
        [HttpGet("active")]
        [AllowAnonymous]
        public async Task<IActionResult> GetActiveDiscounts()
        {
            var now = DateTime.UtcNow;

            var discounts = await unit.DiscountRepository.GetAllWithProducts();

            var activeDiscounts = discounts
                .Where(d => d.IsActive && d.StartDate <= now && d.EndDate >= now)
                .ToList();

            var mapped = mapper.Map<List<DiscountDTO>>(activeDiscounts);

            return Ok(mapped);
        }
        
        [HttpGet]
        [EndpointSummary("All Discounts Info")]
        public async Task<IActionResult> GetAllDiscounts()
        {
            var discounts = await unit.DiscountRepository.GetAll();
            if (discounts == null) return BadRequest(new { message = " No Discounts Founded." });
            var mappedDiscounts = mapper.Map<List<DiscountDTO>>(discounts);
            return Ok(mappedDiscounts);
        }
        [HttpPost]
        [EndpointSummary("Add New Discount")]
        public async Task<IActionResult> CreateDiscount([FromBody] CreateDiscount dto)
        {
            if (dto == null)
                return BadRequest(new { message = "No data received." });

            if (dto.EndDate < dto.StartDate)
                return BadRequest(new { message = "End date must be after start date." });

            if (dto.Percentage <= 0 || dto.Percentage > 100)
                return BadRequest(new { message = "Percentage must be between 0 and 100." });

            if (dto.ProductIds == null || !dto.ProductIds.Any())
                return BadRequest(new { message = "Please select at least one product." });

            var distinctProductIds = dto.ProductIds.Distinct().ToList();
            var existingProducts = await unit.ProductRepository.GetProductsByIds(distinctProductIds);

            if (existingProducts.Count != distinctProductIds.Count)
                return BadRequest(new { message = "One or more selected products do not exist." });

            var discount = mapper.Map<Discount>(dto);

            discount.DiscountProducts = distinctProductIds
                .Select(productId => new DiscountProduct
                {
                    ProductId = productId
                })
                .ToList();

            unit.DiscountRepository.Add(discount);
            await unit.saveAsync();

            return Ok(new
            {
                message = "Discount created successfully.",
                id = discount.Id
            });
        }



        [HttpPut("{id}")]
        [EndpointSummary("Update Discount")]
        public async Task<IActionResult> UpdateDiscount(int id, [FromBody] CreateDiscount dto)
        {
            if (dto == null)
                return BadRequest(new { message = "No data received." });

            if (dto.EndDate < dto.StartDate)
                return BadRequest(new { message = "End date must be after start date." });

            if (dto.Percentage <= 0 || dto.Percentage > 100)
                return BadRequest(new { message = "Percentage must be between 0 and 100." });

            if (dto.ProductIds == null || !dto.ProductIds.Any())
                return BadRequest(new { message = "Please select at least one product." });

            var discount = await unit.DiscountRepository.GetByIdWithProducts(id);
            if (discount == null)
                return NotFound(new { message = "Discount not found." });

            // make sure related products are loaded
            if (discount.DiscountProducts == null)
                discount.DiscountProducts = new List<DiscountProduct>();

            var distinctProductIds = dto.ProductIds.Distinct().ToList();

            var allProducts = await unit.ProductRepository.GetAll();
            var existingProductIds = allProducts
                .Where(p => distinctProductIds.Contains(p.Id))
                .Select(p => p.Id)
                .ToList();

            if (existingProductIds.Count != distinctProductIds.Count)
                return BadRequest(new { message = "One or more selected products do not exist." });

            // update basic fields with mapper
            mapper.Map(dto, discount);

            // replace old linked products
            discount.DiscountProducts.Clear();

            discount.DiscountProducts = distinctProductIds
                .Select(productId => new DiscountProduct
                {
                    ProductId = productId,
                    DiscountId = discount.Id
                })
                .ToList();

            unit.DiscountRepository.Update(discount);
            await unit.saveAsync();

            return Ok(new
            {
                message = "Discount updated successfully.",
                id = discount.Id
            });
        }

        [HttpDelete("{id}")]
        [EndpointSummary("Delete Discount")]
        public async Task<IActionResult> DeleteDiscount(int id)
        {
            if (id <= 0)
                return BadRequest(new { message = "Invalid discount id." });

            var discount = await unit.DiscountRepository.GetById(id);
            if (discount == null)
                return NotFound(new { message = "Discount not found." });

            unit.DiscountRepository.Delete(discount);
            await unit.saveAsync();

            return Ok(new { message = "Discount deleted successfully." });
        }
    }
}
