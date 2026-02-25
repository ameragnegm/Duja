using AutoMapper;
using Duja.DTOs.Category;
using Duja.Models;
using Duja.UnitOfWorks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Duja.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize(Roles = "Admin, Employee")]
    public class CategoryController : ControllerBase
    {
        private readonly UnitOfWork unit;
        private readonly IMapper mapper;

        public CategoryController(UnitOfWork unit, IMapper mapper)
        {
            this.unit = unit;
            this.mapper = mapper;
        }

        [HttpGet]
        [AllowAnonymous]
        [EndpointSummary("All Categories Info")]
        public async Task<IActionResult> GetAllCategories()
        {
            var categories = await unit.CategoryRepository.GetAll();
            var mappedCategories= mapper.Map<List<CategoryDto>>(categories);
            return Ok(mappedCategories);
        }
        [HttpGet("{id}")]
        [AllowAnonymous]
        [EndpointSummary("Specific Category's Info")]
        public IActionResult GetCategoryByID(int id)
        {
            if (id == 0) return BadRequest(new { message = " Something Wrong. " });
            var category = unit.CategoryRepository.GetById(id);
            if (category == null) return BadRequest(new { message = " Category Not Found " });
            var mappedCategory = mapper.Map<CategoryDto>(category);
            return Ok(mappedCategory);
        }


        [HttpPost]
        [EndpointSummary("Add New Category")]
        public IActionResult AddCategory(AddCategoryDTO category) {
            if (category == null) return BadRequest(new { message = " No data received " });
            var mappedCategory = mapper.Map<Category>(category);
            unit.CategoryRepository.Add(mappedCategory);
            unit.Save();

            return Ok(new { message = "Added Successfully." });

        }

        [HttpPut("{id}")]
        [EndpointSummary("Edit Specific Category")]
        public async Task<IActionResult> UpdateCategory(AddCategoryDTO category, int id)
        {
            if (category == null || id == 0) return BadRequest(new { message = " No data received " });
            var existingCategory =  await unit.CategoryRepository.GetById(id);
            if (existingCategory == null) return BadRequest(new { message = " Category Not Found " });
            mapper.Map(category,existingCategory);
            unit.CategoryRepository.Update(existingCategory);
            unit.Save();
            return Ok(new { message = "Updated Successfully." });
        }

        [HttpDelete("{id}")]
        [EndpointSummary("Delete Specific Category")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            if (id == 0) return BadRequest(new { message = " Something Wrong. " });
            var category =  await unit.CategoryRepository.GetById(id);
            if (category == null) return BadRequest(new { message = " Category Not Found " });
            unit.CategoryRepository.Delete(category);
            unit.Save();
            return Ok(new { message = "Deleted Successfully." });
        }
    }
}
