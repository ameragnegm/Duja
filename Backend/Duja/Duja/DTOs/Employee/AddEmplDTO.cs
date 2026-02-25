namespace Duja.DTOs.Employee
{
    public class AddEmplDTO
    {
        public string UserName { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string phoneNumber { get; set; }
        public string Address { get; set; }
        public DateTime Birthdate { get; set; }
        public string roleID { get; set; }
        public decimal Salary { get; set; }
        public DateTime HireDate { get; set; } = DateTime.Now;


    }
}
