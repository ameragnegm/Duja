namespace Duja.DTOs.Discounts
{
    public class DiscountDTO
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }

        public decimal Percentage { get; set; }

        public bool IsActive { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public List<int> ProductIds { get; set; } = new();
    }

}
