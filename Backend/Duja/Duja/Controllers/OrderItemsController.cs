using AutoMapper;
using Duja.DTOs.Order;
using Duja.UnitOfWorks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace Duja.Controllers
{
    //[Authorize(Roles = "Admin, Employee")]
    [Route("api/[controller]")]
    [ApiController]
    public class OrderItemsController : ControllerBase
    {
        private readonly UnitOfWork unit;
        private readonly IMapper mapper;
        public OrderItemsController( UnitOfWork unit  , IMapper mapper)
        {
                this.unit = unit;
                this.mapper = mapper;
        }
        [HttpGet("{orderId}")]
        [EndpointSummary(" Get order's items ")]
        public async Task<IActionResult> GetOrderItems(int orderId)
        {
            if (orderId == 0)
                return BadRequest(new { message = "Something Wrong." });
            var orderItems = await unit.OrderRepository.GetAllOrderItems(orderId);
            if (orderItems == null)
                return BadRequest(new { message = "No Items Found for this Order." });
            var mappedItems = mapper.Map<List<OrderItemDTO>>(orderItems);
            return Ok(mappedItems);
        }

    }
}
