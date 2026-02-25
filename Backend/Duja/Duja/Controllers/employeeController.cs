using AutoMapper;
using Duja.DTOs.Employee;
using Duja.Models;
using Duja.UnitOfWorks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Duja.Controllers
{
    //[Authorize(Roles = "Admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class employeeController : ControllerBase
    {
        private readonly IMapper mapper;
        private readonly UnitOfWork unit;
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> roleManager;

        public employeeController(UnitOfWork unitOfWork, IMapper mapper, UserManager<User> userManager, RoleManager<IdentityRole> roleManager)
        {
            this.mapper = mapper;
            this.unit = unitOfWork;
            this._userManager = userManager;
            this.roleManager = roleManager;
        }

        [HttpGet]
        [EndpointSummary("All Employees")]
        public async Task<IActionResult> GetAllEmployees()
        {
            var emps = await unit.EmployeeRepository.GetAll();
            foreach (var emp in emps)
            {
                List<string> rolesNames = (List<string>)await _userManager.GetRolesAsync(emp.User);
                foreach (string roleName in rolesNames)
                {
                    var role = await roleManager.FindByNameAsync(roleName);
                    emp.Roles.Add(mapper.Map<RoleDTO>(role));
                }
            }
            var mappedemps = mapper.Map<List<DisplayEmpDTO>>(emps);
            return Ok(mappedemps);
        }
        [HttpGet("roles")]
        public IActionResult GetRoles()
        {
            var roles = roleManager.Roles.ToList();
            var mappedRoles = mapper.Map<List<RoleDTO>>(roles);
            return Ok(mappedRoles);
        }

        //get specific role by id
        [HttpGet("roles/{id}")]
        public async Task<IActionResult> GetRoleById(string id)
        {
            var role = await roleManager.FindByIdAsync(id);
            if (role == null)
                return NotFound("No Role with this Id");
            var mappedRole = mapper.Map<RoleDTO>(role);
            return Ok(mappedRole);
        }

        [HttpGet("{id}")]
        [EndpointSummary(" Get specific Employee")]
        public async Task<IActionResult> GetEmployeeById(int id)
        {
            var emp = await unit.EmployeeRepository.GetById(id);
            if (emp == null)
                return NotFound("No Employee with this Id");

            List<string> rolesNames = (List<string>)await _userManager.GetRolesAsync(emp.User);
            foreach (string roleName in rolesNames)
            {
                var role = await roleManager.FindByNameAsync(roleName);
                emp.Roles.Add(mapper.Map<RoleDTO>(role));
            }
            DisplayEmpDTO empDTO = mapper.Map<DisplayEmpDTO>(emp);
            return Ok(empDTO);
        }

        // admin adding new employees or admin 
        [HttpPost]
        [EndpointSummary(" Add new Employee")]
        public async Task<IActionResult> AddEmployee([FromBody] AddEmplDTO empDTO)
        {
            Console.WriteLine(empDTO.Address);
            var signedInUser = mapper.Map<User>(empDTO);
            Console.WriteLine($"DTO Address = '{empDTO.Address}'");
            Console.WriteLine($"User Address before create = '{signedInUser.Address}'");

            var UserExist = await _userManager.CreateAsync(signedInUser, empDTO.Password);
            if (!UserExist.Succeeded)
            {
                return BadRequest(new { Message = "User registration failed", Errors = UserExist.Errors });
            }
            var selectedRole = await roleManager.FindByIdAsync(empDTO.roleID);
            string roleName = selectedRole.Name;
            if (!await roleManager.RoleExistsAsync(roleName))
            {
                var role = new IdentityRole(roleName);
                await roleManager.CreateAsync(role);
            }
            await _userManager.AddToRoleAsync(signedInUser, roleName);
            var emp = mapper.Map<employee>(empDTO);
            emp.UserId = signedInUser.Id;
            unit.EmployeeRepository.Add(emp);
            Console.WriteLine($"emp.User is null? {emp.User == null}");

            unit.Save();
            return Ok(new { message = " Added successfully " });
        }

        [HttpPut("{id}")]
        [EndpointSummary(" Update Employee")]
        public async Task<IActionResult> UpdateEmployee(int id, [FromBody] AddEmplDTO empDTO)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var emp = await unit.EmployeeRepository.GetById(id);
            if (emp == null)
                return NotFound("No Employee with this Id");

            var user = await _userManager.FindByIdAsync(emp.UserId);
            if (user == null)
                return BadRequest("Employee has no linked user.");

            mapper.Map(empDTO, user);

            var updateUserResult = await _userManager.UpdateAsync(user);
            if (!updateUserResult.Succeeded)
                return BadRequest(new { message = "User update failed", errors = updateUserResult.Errors });

            mapper.Map(empDTO, emp);
            unit.EmployeeRepository.Update(emp);
            unit.Save();

            if (!string.IsNullOrWhiteSpace(empDTO.roleID))
            {
                var targetRole = await roleManager.FindByIdAsync(empDTO.roleID);
                if (targetRole == null)
                    return BadRequest("Invalid roleID");

                var currentRoles = await _userManager.GetRolesAsync(user);
                if (!currentRoles.Contains(targetRole.Name))
                {
                    if (currentRoles.Any())
                        await _userManager.RemoveFromRolesAsync(user, currentRoles);

                    await _userManager.AddToRoleAsync(user, targetRole.Name);
                }
            }

            return Ok(new { message = "Updated successfully" });
        }
        [HttpDelete("{id}")]
        [EndpointSummary(" Delete Employee")]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            var emp = await unit.EmployeeRepository.GetById(id);
            if (emp == null)
                return NotFound("No Employee with this Id");
            unit.EmployeeRepository.Delete(emp);
            unit.Save();
            return Ok(new { message = "Deleted successfully " });
        }
    }
}
