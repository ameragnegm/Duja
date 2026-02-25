using AutoMapper;
using Duja.DTOs.User;
using Duja.Models;
using Duja.UnitOfWorks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Duja.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly SignInManager<User> signInManager;
        private readonly UnitOfWork unit;
        private readonly IConfiguration _configuration;

        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> roleManager;
        public AuthController(UnitOfWork unit, IConfiguration configuration, IMapper mapper, UserManager<User> userManager, SignInManager<User> signInManager, RoleManager<IdentityRole> roleManager)
        {
            this._mapper = mapper;
            this._userManager = userManager;
            this.signInManager = signInManager;
            this.unit = unit;
            this._configuration = configuration;
            this.roleManager = roleManager;

        }
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto RegUserDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            // create user & mapped user
            var signedInUser = _mapper.Map<User>(RegUserDto);

            var UserExist = await _userManager.CreateAsync(signedInUser, RegUserDto.Password);
            if (!UserExist.Succeeded)
            {
                return BadRequest(new { Message = "User registration failed", Errors = UserExist.Errors });
            }
            string roleName = "User";
            if (!await roleManager.RoleExistsAsync(roleName))
            {
                var role = new IdentityRole(roleName);
                await roleManager.CreateAsync(role);
            }
            await _userManager.AddToRoleAsync(signedInUser, roleName);

            return Ok(new { Message = "User registered successfully" });
        }
        

        [HttpPost("Login")]
        public async Task<IActionResult> Login(LoginDto loginDto)
        {
            if (loginDto == null)
            {
                return BadRequest(new { message = "No Data Received" });
            }
            var loggineduser = await _userManager.FindByEmailAsync(loginDto.Email);
            if (loggineduser == null) return Unauthorized("Invalid email or password.");

            var result = await signInManager.CheckPasswordSignInAsync(loggineduser, loginDto.Password, lockoutOnFailure: false);
            if (!result.Succeeded)
            {
                return Unauthorized(new { message = "Invalid login attempt" });
            }
            var roles = await _userManager.GetRolesAsync(loggineduser);
            var claims = new List<Claim> {
                new Claim(JwtRegisteredClaimNames.Sub,loggineduser.Id),
                new Claim (JwtRegisteredClaimNames.Jti , Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, loggineduser.Id),
                new Claim(ClaimTypes.Name, loggineduser.UserName ?? ""),
                new Claim(ClaimTypes.Email, loggineduser.Email ?? "")
            };
            claims.AddRange(roles.Select(r => new Claim(ClaimTypes.Role, r)));
            // get the secret key from appsettings and encode it
            var SigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("Jifkyi7^aU&Ez27jE0XtblDJ@wCrc^@9Ndf3boL%Vpd%vux!pDJm2H5F0aFUjQ!r"));

            var token = new JwtSecurityToken(
                issuer: _configuration["JWT:ValidIssuer"],
                audience: _configuration["JWT:ValidAudience"],
                // payload 
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                // signture 
                signingCredentials: new SigningCredentials(SigningKey, SecurityAlgorithms.HmacSha256)
                );
            return Ok(new { Token = new JwtSecurityTokenHandler().WriteToken(token),
                userId = loggineduser.Id,
                userName = loggineduser.UserName,
                email = loggineduser.Email,
                roles,
                message = " User logined successfully" });
        }
        [HttpPost("LogOut")]
        public async Task<IActionResult> Logout()
        {
            await signInManager.SignOutAsync();

            return Ok(new { message = "Logout successfully" });
        }
    }
}
