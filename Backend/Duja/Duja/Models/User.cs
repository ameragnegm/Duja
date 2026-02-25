using Microsoft.AspNetCore.Identity;

namespace Duja.Models
{
    public class User : IdentityUser
    {
        public string FullName { get; set; }   
        public string Address { get; set; }            
        public virtual employee Employee { get; set; }

    }
}
