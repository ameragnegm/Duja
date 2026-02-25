using AutoMapper;
using Duja.DTOs.Color;
using Duja.UnitOfWorks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Duja.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize(Roles = "Admin, Employee")]
    public class ColorController : ControllerBase
    {
        private readonly UnitOfWork unitOfWork;
        private readonly IMapper mapper;

        public ColorController(UnitOfWork unitOfWork, IMapper mapper)
        {
            this.unitOfWork = unitOfWork;
            this.mapper = mapper;
        }
        [HttpGet]
        [AllowAnonymous]
        [EndpointSummary("All Colors Info")]
        public async Task<IActionResult> GetAllColors()
        {
            var colors = await unitOfWork.ColorRepository.GetAll();
            var mappedColors = mapper.Map<List<ColorDTO>>(colors);
            return Ok(mappedColors);
        }

        [HttpPost]
        [EndpointSummary("Add New Color")]
        public async Task<IActionResult> AddColor(AddColorDTO color)
        {
            if (color == null) return BadRequest(new { message = " No data received " });
            var mappedColor = mapper.Map<Models.Color>(color);
            unitOfWork.ColorRepository.Add(mappedColor);
            unitOfWork.Save();
            return Ok(new { message = "Color Added Successfully" });
        }


        [HttpPut("{id}")]
        [EndpointSummary("Update Color")]
        public async Task<IActionResult> UpdateColor(int id, AddColorDTO color)
        {
            if (color == null) return BadRequest(new { message = " No data received " });
            var existingColor = await unitOfWork.ColorRepository.GetById(id);
            if (existingColor == null) return BadRequest(new { message = "Color Not Found" });
            mapper.Map(color, existingColor);
            unitOfWork.ColorRepository.Update(existingColor);
            unitOfWork.Save();
            return Ok(new { message = "Color Updated Successfully" });
        }


        [HttpDelete("{id}")]
        [EndpointSummary("Delete Color")]
        public async Task<IActionResult> DeleteColor(int id)
        {
            if (id == 0) return BadRequest(new { message = "Something Wrong." });
            var color = await unitOfWork.ColorRepository.GetById(id);
            if (color == null) return BadRequest(new { message = "Color Not Found" });
            unitOfWork.ColorRepository.Delete(color);
            unitOfWork.Save();
            return Ok(new { message = "Color Deleted Successfully" });
        }
    }
}
