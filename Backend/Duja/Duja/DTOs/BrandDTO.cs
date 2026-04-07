using System.ComponentModel.DataAnnotations;

namespace Duja.DTOs
{
    public class BrandDTO
    {

        [MaxLength(150)]
        public string BrandName { get; set; } = string.Empty;

        [MaxLength(500)]
        public string Description { get; set; } = string.Empty;

        [MaxLength(100)]
        public string Phone { get; set; } = string.Empty;

        [MaxLength(100)]
        public string WhatsApp { get; set; } = string.Empty;

        [MaxLength(150)]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [MaxLength(200)]
        public string InstagramUrl { get; set; } = string.Empty;

        [MaxLength(200)]
        public string TikTokUrl { get; set; } = string.Empty;

    }
}
