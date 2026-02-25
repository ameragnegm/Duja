using Duja.DTOs.Employee;
using System.ComponentModel.DataAnnotations.Schema;

namespace Duja.Models
{
    public class employee
    {
        public int Id { get; set; }
        public string Address { get; set; }
        public DateTime Birthdate { get; set; }
        public decimal Salary { get; set; }
        public List<RoleDTO> Roles { get; set; } = new List<RoleDTO>();

        public DateTime HireDate { get; set; }
        [ForeignKey("TitleID")]
        public string UserId { get; set; } 
        public virtual User User { get; set; } 

    }
}
