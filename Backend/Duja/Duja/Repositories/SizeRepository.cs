using Duja.Models;
using Microsoft.EntityFrameworkCore;

namespace Duja.Repositories
{
    public class SizeRepository : GenericRepo<Size>
    {
        public SizeRepository(DbContext context) : base(context)
        {
        }
    }
}
