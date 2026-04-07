using Duja.Models;
using Microsoft.EntityFrameworkCore;

namespace Duja.Repositories
{
    public class VariantRepository : GenericRepo<ProductVariant>
    {
        public VariantRepository(DbContext context) : base(context)
        {
        }


    }
}
