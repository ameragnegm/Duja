using Duja.Models;
using Microsoft.EntityFrameworkCore;

namespace Duja.Repositories
{
    public class EmployeeRepository : GenericRepo<employee>
    {
        private readonly DbContext context;
        public EmployeeRepository(DbContext context) : base(context)
        {
            this.context = context;
        }
        public override Task<employee> GetById(int id)
        {
            return context.Set<employee>().Include(e => e.User).FirstOrDefaultAsync(emp => emp.Id == id);
        }

        override public async Task<List<employee>> GetAll()
        {
            return await context.Set<employee>().Include(e => e.User).ToListAsync();
        }
        //public Task<List<EmployeeTitles>> GetJobTitles()
        //{
        //    return context.Set<EmployeeTitles>().ToListAsync();
        //}
        //public void AddNewTitle(EmployeeTitles title)
        //{
        //    context.Set<EmployeeTitles>().Add(title);
        //}
    }
}
