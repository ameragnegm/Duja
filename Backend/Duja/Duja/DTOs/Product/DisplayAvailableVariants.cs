namespace Duja.DTOs.Product
{
    public class DisplayAvailableVariants
    {
        public int Id { get; set; }
        public int SizeID { get; set; }
        public int ColorID { get; set; }

        public decimal? Length { get; set; }

        public decimal? Shoulder { get; set; }
        public decimal? bust { get; set; }
        public decimal? Sleevelength { get; set; }

        public decimal? Waist { get; set; }

        public decimal? Hip { get; set; }

        public decimal? Inseam { get; set; }

        public decimal? Thigh { get; set; }

        public decimal? Weight { get; set; }

        public String? Note { get; set; }

    }
}
