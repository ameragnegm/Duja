

using Duja.UnitOfWorks;
using Microsoft.EntityFrameworkCore;

namespace Duja.Repositories
{
    public class GenericRepo<T> where T : class
    {
        private readonly DbContext context;

        public GenericRepo(DbContext context)
        {
            this.context = context;
        }
        public async virtual Task<List<T>> GetAll()
        {
            return  await context.Set<T>().ToListAsync();
        }
        public async virtual Task<T> GetById(int id)
        {
            return await context.Set<T>().FindAsync(id);
        }

        public  virtual void Add(T entity)
        {
            context.Set<T>().Add(entity);
        }
        public virtual void Update(T entity)
        {
            context.Set<T>().Update(entity);
        }
        public virtual void Delete(T entity)
        {
            context.Set<T>().Remove(entity);
        }
    }
}

