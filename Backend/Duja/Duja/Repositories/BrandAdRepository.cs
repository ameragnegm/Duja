using Duja.Models;
using Microsoft.EntityFrameworkCore;

namespace Duja.Repositories
{
    public class BrandAdRepository : GenericRepo<BrandAd>
    {
        public BrandAdRepository(DbContext context) : base(context)
        {
        }
    }
}
