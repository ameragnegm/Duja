using AutoMapper;
using Duja.DTOs;
using Duja.UnitOfWorks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Duja.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BrandInfoController : ControllerBase
    {
        private readonly UnitOfWork unit;
        private readonly IMapper mapper;

        public BrandInfoController(UnitOfWork unitOfWork,IMapper mapper)
        {
            this.unit = unitOfWork;
            this.mapper = mapper;
        }

        [HttpGet]
        [EndpointSummary("Get Brand Info")]
        public async Task<IActionResult> GetBrandInfo()
        {
            var brandInfo = await unit.BrandInfoRepository.GetById(1);

            if (brandInfo == null)
                return NotFound(new { message = "Brand info not found." });

            var brandInfoDTO = mapper.Map<BrandDTO>(brandInfo);

            return Ok(brandInfoDTO);
        }

        [HttpPut]
        [EndpointSummary("Edit Brand Info")]
        public async Task<IActionResult>  EditBrandInfo([FromBody] BrandDTO brandInfoDto)
        {
            if (brandInfoDto == null)
                return BadRequest(new { message = "No data received." });

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var existingBrandInfo = await unit.BrandInfoRepository.GetById(1);

            if (existingBrandInfo == null)
                return NotFound(new { message = "Brand info not found." });

            mapper.Map(brandInfoDto, existingBrandInfo);

            unit.BrandInfoRepository.Update(existingBrandInfo);
            unit.Save();

            return Ok(new { message = "Updated successfully." });
        }
    }
}