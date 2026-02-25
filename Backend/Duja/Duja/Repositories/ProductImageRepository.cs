using Duja.Models;
using Microsoft.EntityFrameworkCore;

namespace Duja.Repositories
{
    public class ProductImageRepository : GenericRepo<productImage>
    {
        public ProductImageRepository(DbContext context) : base(context)
        {
        }
    }
}
