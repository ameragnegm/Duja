namespace Duja.DTOs.Employee
{
    public class DisplayEmpDTO
    {
        public int ID { get; set; }
        public string phoneNumber { get; set; }
        public string Email { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Address { get; set; }
        public DateTime Birthdate { get; set; }
        public decimal Salary { get; set; }
        public DateTime HireDate { get; set; } = DateTime.Now;
        public string UserName { get; set; }
        public List<RoleDTO> Roles { get; set; } = new List<RoleDTO>();

    }
}
