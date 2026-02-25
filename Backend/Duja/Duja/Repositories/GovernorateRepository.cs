using Duja.Models;
using Microsoft.EntityFrameworkCore;

namespace Duja.Repositories
{
    public class GovernorateRepository : GenericRepo<DeliveryDetails>
    {
    
        public GovernorateRepository(DbContext context) : base(context)
        {
        }
    }
}
