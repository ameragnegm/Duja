using Duja.Models;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace Duja.Repositories
{
    public class ProductRepository : GenericRepo<Product>
    {
        private readonly DujaContext context;
        public ProductRepository(DujaContext context) : base(context)
        {
            this.context = context;
        }
        public  async override Task<List<Product>> GetAll()
        {
            return  await context.Set<Product>().Include(p => p.Variants).Include(p=> p.Images).ToListAsync();
        }
 
        public async  Task<Product> getProductbyVariantId(int variantId)
        {
            var variant = await context.Variants.Include(v => v.Product)
                                                .ThenInclude(p => p.Images)
                                                .FirstOrDefaultAsync(v => v.Id == variantId);
            
            return variant?.Product;
        }


        //// get all products image by category id 

        //public async Task<List<Product>> GetProductsByCategoryId(int categoryId)
        //{
        //    return await context.Products
        //                        .Where(p => p.CategoryId == categoryId)
        //                        .Include(p => p.Images)
        //                        .ToListAsync();
        //}

        // get product variant by id
        public async Task<ProductVariant> GetVariantById(int variantId)
        {
            return await context.Variants.Include(v => v.Product)
                                                .ThenInclude(p => p.Images)
                                                .FirstOrDefaultAsync(v => v.Id == variantId);
        }
        // update product variant   
        public void UpdateVariant(ProductVariant variant)
        {
            context.Variants.Update(variant);
        }
        public async override Task<Product> GetById(int id)
        {
            return  await context.Set<Product>().Include(p=> p.Variants).Include(p=> p.Images).FirstOrDefaultAsync(p=> p.Id == id);
        }
        public void RemoveVariant(int VarientID)
        {
            var variant = context.Variants.FirstOrDefault(v => v.Id== VarientID);
            if (variant != null)
            {
                context.Variants.Remove(variant);
            }
        }
        public void RemoveRange(IEnumerable<ProductVariant> variants)
        {
            context.Variants.RemoveRange(variants);
        }
        public void RemoveRangeVariants(int id)
        {
            context.Variants.RemoveRange(context.Variants.Where(v => v.ProductId == id));
        }
    }
}
