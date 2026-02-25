using AutoMapper;
using Duja.DTOs.Order;
using Duja.Models;
using Duja.UnitOfWorks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Duja.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GovernorateController : ControllerBase
    {
        private readonly UnitOfWork unitOfWork;
        private readonly IMapper mapper;

        public GovernorateController(UnitOfWork unitOfWork , IMapper mapper )
        {
            this.unitOfWork = unitOfWork;
            this.mapper = mapper;
        }


        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var governorates = await unitOfWork.GovernorateRepository.GetAll();
            return Ok(governorates);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var governorate = await unitOfWork.GovernorateRepository.GetById(id);

            if (governorate == null)
                return NotFound($"Governorate with ID {id} not found.");

            return Ok(governorate);
        }

        [HttpPost]
        public async Task<IActionResult> AddNewGovernorate([FromBody] governorateDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var governorate = mapper.Map<DeliveryDetails>(dto);

            unitOfWork.GovernorateRepository.Add(governorate);
            unitOfWork.Save(); 

            return Ok( new { Message = "Added Successfully."});
        }

        // 4. EDIT (Update Price/Name): Admin Only
        [HttpPut("{id}")]
        // [Authorize(Roles = "Admin")]
        public async Task<ActionResult> UpdateGovernorate(int id, [FromBody] governorateDTO dto)
        {
            var repo = unitOfWork.GovernorateRepository;
            var existingGov = await repo.GetById(id);

            if (existingGov == null)
                return NotFound($"Governorate with ID {id} not found.");

            mapper.Map(dto, existingGov);

            repo.Update(existingGov);
            unitOfWork.Save();

            return Ok(new { message = "Governorate updated successfully" });
        }

        [HttpDelete("{id}")]
        // [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteGovernorate(int id)
        {
            var repo = unitOfWork.GovernorateRepository;
            var governorate = await repo.GetById(id);

            if (governorate == null)
                return NotFound("Governorate not found");

            repo.Delete(governorate);
            unitOfWork.Save();

            return Ok(new { message = "Governorate deleted successfully" });
        }
    }
}
