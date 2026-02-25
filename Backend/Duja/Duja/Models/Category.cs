namespace Duja.Models
{
    public class Category
    {

        public int Id { get; set; }
        public string Name { get; set; }
        public List<string>? Images { get; set; } = new List<string>();
        public List<Product> Products { get; set; }
    }
}
