using Duja.DTOs.Category;
using Duja.DTOs.Color;
using Duja.DTOs.Size;
using Duja.Models;
using System.Globalization;

namespace Duja.DTOs.Product
{
    public class ProductFormDataDTO
    {
        public ProductDTO? Product { get; set; }

        public List<CategoryDto> Categories { get; set; }
        public List<SizeDTO> Sizes { get; set; }
        public List<ColorDTO> Colors { get; set; }
    }
}
