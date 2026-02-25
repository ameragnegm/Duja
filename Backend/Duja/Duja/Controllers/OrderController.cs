using AutoMapper;
using Duja.DTOs.Order;
using Duja.Models;
using Duja.UnitOfWorks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Duja.Controllers
{
    [Route("api/[controller]")]
    //[Authorize(Roles = "Admin, Employee")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly UnitOfWork unit;
        private readonly IMapper mapper;
        public OrderController(UnitOfWork unit, IMapper mapper)
        {
            this.unit = unit;
            this.mapper = mapper;
        }

        [HttpGet]
        [EndpointSummary("All Orders Info")]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await unit.OrderRepository.GetAll();
            if (orders == null) return BadRequest(new { message = " No Orders Founded." });
            var mappedOrders = mapper.Map<List<OrderDTO>>(orders);
            return Ok(mappedOrders);
        }

        [HttpGet("{id}")]
        [EndpointSummary("Specific Order's Info")]
        public async Task<IActionResult> GetOrderByID(int id)
        {
            if (id == 0)
                return BadRequest(new { message = "Something Wrong." });
            var order = await unit.OrderRepository.GetById(id);
            if (order == null)
                return BadRequest(new { message = "Order Not Found" });
            var mappedOrder = mapper.Map<OrderDTO>(order);
            return Ok(mappedOrder);
        }

        [HttpPost]
        [EndpointSummary("Add New Order")]
        public async Task<IActionResult> AddOrder(AddOrder order)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
            {
                userId = "ab9d44af-ffb1-4a02-ac8e-e45125cd2140";
            }

            if (order == null) return BadRequest(new { message = " No data received " });

            var mappedOrder = mapper.Map<Order>(order);
            mappedOrder.UserId = userId;
            mappedOrder.Status = OrderStatus.Pending;
            mappedOrder.Status = OrderStatus.Pending;
            foreach (var item in mappedOrder.OrderItems)
            {
                var product = await unit.ProductRepository.getProductbyVariantId(item.ProductVariantId);
            }
            unit.OrderRepository.Add(mappedOrder);
            unit.Save();
            return Ok(new { message = "Added Successfully." , orderID = mappedOrder.Id });
        }

        // confirm order 

        [HttpPut("{id}/confirm")]
        [EndpointSummary("Confirm Specific Order")]
        public async Task<IActionResult> ConfirmOrder(int id)
        {
            if (id == 0) return BadRequest(new { message = " No data received " });
            var existingOrder = await unit.OrderRepository.GetById(id);
            if (existingOrder == null) return BadRequest(new { message = " Order Not Found " });
            existingOrder.Status = OrderStatus.Confirmed;
            // change the quantity base on the order items
            foreach (var item in existingOrder.OrderItems)
            {
                var variant = await unit.ProductRepository.GetVariantById(item.ProductVariantId);
                if (variant != null)
                {
                    variant.StockQuantity -= item.Quantity;
                    unit.ProductRepository.UpdateVariant(variant);
                }
            }
            unit.OrderRepository.Update(existingOrder);
            unit.Save();
            return Ok(new { message = "Order Confirmed Successfully." });
        }

        [HttpPut("{id}")]
        [EndpointSummary("Edit Specific Order")]
        public async Task<IActionResult> UpdateOrder(UpdateOrderDTO order, int id)
        {
            if (order == null || id == 0) return BadRequest(new { message = " No data received " });
            var existingOrder = await unit.OrderRepository.GetById(id);
            if (existingOrder == null) return BadRequest(new { message = " Order Not Found " });
            mapper.Map(order, existingOrder);
            if(existingOrder.Status == OrderStatus.Delivered)
            {
                existingOrder.PaidAmount = existingOrder.TotalAmount;
                existingOrder.RemainingAmount = 0;
            }
            unit.OrderRepository.Update(existingOrder);
            unit.Save();
            return Ok(new { message = "Updated Successfully." });
        }

        [HttpDelete("{id}")]
        [EndpointSummary("Delete Specific Order")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            if (id == 0) return BadRequest(new { message = " No data received " });
            var existingOrder = await unit.OrderRepository.GetById(id);
            if (existingOrder == null) return BadRequest(new { message = " Order Not Found " });
            unit.OrderRepository.Delete(existingOrder);
            unit.Save();
            return Ok(new { message = "Deleted Successfully." });
        }

    }
}
