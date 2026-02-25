using Duja.Models;
using Microsoft.EntityFrameworkCore;

namespace Duja.Repositories
{
    public class ColorRepository : GenericRepo<Color>
    {
        public ColorRepository(DbContext context) : base(context)
        {
        }
    }
}
