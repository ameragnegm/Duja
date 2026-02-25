using AutoMapper;
using Duja.DTOs.Size;
using Duja.UnitOfWorks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Duja.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize(Roles = "Admin, Employee")]
    public class SizeController : ControllerBase
    {
        private readonly UnitOfWork unitOfWork;
        private readonly IMapper mapper;

        public SizeController(UnitOfWork unitOfWork, IMapper mapper)
        {
            this.unitOfWork = unitOfWork;
            this.mapper = mapper;
        }

        [HttpGet]
        [AllowAnonymous]
        [EndpointSummary("All Sizes Info")]
        public async Task<IActionResult> GetAllSizes()
        {
            var Sizes = await unitOfWork.SizeRepository.GetAll();
            var mappedSizes = mapper.Map<List<SizeDTO>>(Sizes);
            return Ok(mappedSizes);
        }
        [HttpPost]
        [EndpointSummary("Add New Size")]
        public async Task<IActionResult> AddSize(AddSizeDTO size)
        {
            if (size == null) return BadRequest(new { message = " No data received " });
            var mappedSize = mapper.Map<Models.Size>(size);
            unitOfWork.SizeRepository.Add(mappedSize);
            unitOfWork.Save();
            return Ok(new { message = "Size Added Successfully" });
        }

        [HttpPut("{id}")]
        [EndpointSummary("Update Size")]
        public async Task<IActionResult> UpdateSize(int id, AddSizeDTO size)
        {
            if (size == null) return BadRequest(new { message = " No data received " });
            var existingSize = await unitOfWork.SizeRepository.GetById(id);
            if (existingSize == null) return BadRequest(new { message = "Size Not Found" });
            mapper.Map(size, existingSize);
            unitOfWork.SizeRepository.Update(existingSize);
            unitOfWork.Save();
            return Ok(new { message = "Size Updated Successfully" });
        }

        [HttpDelete("{id}")]
        [EndpointSummary("Delete Size")]
        public async Task<IActionResult> DeleteSize(int id)
        {
            var existingSize = await unitOfWork.SizeRepository.GetById(id);
            if (existingSize == null) return BadRequest(new { message = "Size Not Found" });
            unitOfWork.SizeRepository.Delete(existingSize);
            unitOfWork.Save();
            return Ok(new { message = "Size Deleted Successfully" });
        }
    }
}
