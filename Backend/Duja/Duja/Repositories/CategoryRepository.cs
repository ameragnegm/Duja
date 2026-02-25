using Duja.DTOs.Category;
using Duja.Models;
using Microsoft.EntityFrameworkCore;

namespace Duja.Repositories
{
    public class CategoryRepository : GenericRepo<Category>
    {
        private readonly DujaContext context;

        public CategoryRepository(DujaContext context) : base(context)
        {
        }

        
    }
}
