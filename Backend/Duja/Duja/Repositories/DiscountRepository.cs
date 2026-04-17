using Duja.Models;
using Microsoft.EntityFrameworkCore;

namespace Duja.Repositories
{
    public class DiscountRepository : GenericRepo<Discount>
    {
        private readonly DujaContext context;

        public DiscountRepository(DujaContext context) : base(context)
        {
            this.context = context;
        }
        public async Task<List<Discount>> GetAllWithProducts()
        {
            return await context.Discounts
                .Include(d => d.DiscountProducts)
                .ToListAsync();
        }

        public async Task<Discount?> GetByIdWithProducts(int id)
        {
            return await context.Discounts
                .Include(d => d.DiscountProducts)
                .FirstOrDefaultAsync(d => d.Id == id);
        }
        public async Task<List<Discount>> GetActiveDiscounts()
        {
            var now = DateTime.UtcNow;

            return await context.Discounts
                .Include(d => d.DiscountProducts)
                .Where(d => d.IsActive &&
                            d.StartDate <= now &&
                            d.EndDate >= now)
                .ToListAsync();
        }
        public async Task<Discount?> GetById(int id)
        {
            return await context.Discounts
                .Include(d => d.DiscountProducts)
                .FirstOrDefaultAsync(d => d.Id == id);
        }
    }
}
