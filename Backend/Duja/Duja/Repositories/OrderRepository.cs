using Duja.DTOs.Order;
using Duja.Models;
using Microsoft.EntityFrameworkCore;

namespace Duja.Repositories
{
    public class OrderRepository : GenericRepo<Order>
    {
        private readonly DujaContext context;

        public OrderRepository(DujaContext context) : base(context)
        {
            this.context = context;
        }
        override public async Task<List<Order>> GetAll()
        {
            return await context.Set<Order>().Include(o => o.OrderItems).Include(o => o.User).ToListAsync();
        }
        public override async Task<Order> GetById(int id)
        {
        
            return await context.Set<Order>()
                    .Include(o => o.User)
                    .Include(o => o.OrderItems)
                        .ThenInclude(oi => oi.ProductVariant)
                            .ThenInclude(pv => pv.Product)
                                .ThenInclude(p => p.Images)
                    .Include(o => o.OrderItems)
                         .ThenInclude(oi => oi.ProductVariant)
                               .ThenInclude(pv => pv.Size)
                    .Include(o => o.OrderItems)
                         .ThenInclude(oi => oi.ProductVariant)
                               .ThenInclude(pv => pv.Color)
        .FirstOrDefaultAsync(o => o.Id == id);
        
        }

        public async Task<List<OrderItemDTO>> GetAllOrderItems(int orderId)
        {
            return await context.OrderItems
                .Where(item => item.OrderId == orderId)
                .Select(item => new OrderItemDTO
                {
                    Id = item.Id,
                    Quantity = item.Quantity,
                    ProductName = item.ProductVariant.Product.Name,
                    ProductImage = item.ProductVariant.Product.Images.FirstOrDefault().ImageUrl,
                    Size = item.ProductVariant.Size.Name,
                    Color = item.ProductVariant.Color.Name,
                    UnitPrice = item.ProductVariant.Product.Price,
                    TotalPrice = item.ProductVariant.Product.Price * item.Quantity
                })
                .ToListAsync();
        }

    }
}