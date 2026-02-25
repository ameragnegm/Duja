namespace Duja.Models
{
    public class Color
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<ProductVariant> Variants { get; set; }
    }
}
