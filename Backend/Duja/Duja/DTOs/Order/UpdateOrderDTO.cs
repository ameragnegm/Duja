using Duja.Models;

namespace Duja.DTOs.Order
{
    public class UpdateOrderDTO
    {
        public string Address { get; set; }
        public string Status { get; set; }
        public string OwnerName { get; set; }
        public string OwnerPhone { get; set; }
    }
}
