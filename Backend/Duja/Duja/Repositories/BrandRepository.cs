using Duja.Models;
using Microsoft.EntityFrameworkCore;

namespace Duja.Repositories
{
    public class BrandRepository : GenericRepo<BrandInfo>
    {
        public BrandRepository(DbContext context) : base(context)
        {
        }

    }
}
