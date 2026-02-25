using Duja.Models;
using Microsoft.EntityFrameworkCore;

namespace Duja.Repositories
{
    public class OrderItemRepository : GenericRepo<OrderItem>
    {
        public OrderItemRepository(DbContext context) : base(context)
        {
        }
    }
}
