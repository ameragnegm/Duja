using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Duja.UnitOfWorks;
using Microsoft.AspNetCore.Http;
using System;
using Microsoft.AspNetCore.Authorization;
using Duja.DTOs.Ads;

namespace Duja.Controllers
{
    [Route("api/[controller]")]
    //[Authorize(Roles = "Admin, Employee")]
    [ApiController]
    public class AdsController : ControllerBase
    {

        private readonly UnitOfWork unitOfWork;
        private readonly IMapper mapper;
        private readonly IWebHostEnvironment _env; // To find the wwwroot folder

        public AdsController(UnitOfWork unit, IMapper mapper, IWebHostEnvironment env)
        {
            this.unitOfWork = unit;
            this.mapper = mapper;

            this._env = env;
        }

        [HttpGet]
        [EndpointSummary("Get All Ads")]
        [AllowAnonymous]
        public async Task<IActionResult> GetAllAds()
        {
            var ads = await unitOfWork.BrandAdRepository.GetAll();
            return Ok(ads);


        }
        // upload NEW ad
        [HttpPost]
        [Consumes("multipart/form-data")]
        [EndpointSummary("Upload New Ad")]
        public async Task<IActionResult> UploadAd([FromForm] UploadAd ad)
        {
            var adImage = ad.AdImage;
            if (adImage == null || adImage.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }
            // Generate a unique file name to avoid conflicts
            var uniqueFileName = Guid.NewGuid().ToString() + "_" + adImage.FileName;
            var uploadsFolder = Path.Combine(_env.WebRootPath, "ads");
            // Ensure the ads directory exists
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);
            // Save the file to the server
            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await adImage.CopyToAsync(fileStream);
            }
            // Save ad info to the database
            var brandAd = new Models.BrandAd
            {
                ImageUrl = "/ads/" + uniqueFileName,

            };
            unitOfWork.BrandAdRepository.Add(brandAd);
            unitOfWork.Save();
            return Ok(new { message = "Ad uploaded successfully.", ad = brandAd });
        }

        // Delete an ad by id
        [HttpDelete("{id}")]
        [EndpointSummary("Delete Ad by Id")]
        public async Task<IActionResult> DeleteAd(int id)
        {
            var ad = await unitOfWork.BrandAdRepository.GetById(id);
            if (ad == null)
            {
                return NotFound("Ad not found.");
            }
            // Delete the image file from the server
            var filePath = Path.Combine(_env.WebRootPath, ad.ImageUrl.TrimStart('/'));
            if (System.IO.File.Exists(filePath))
            {
                System.IO.File.Delete(filePath);
            }
            // Delete the ad record from the database
            unitOfWork.BrandAdRepository.Delete(ad);
            unitOfWork.Save();
            return Ok(new { message = "Ad deleted successfully." });
        }
        // Delete all ads
        [HttpDelete("All")]
        [EndpointSummary("Delete All Ads")]
        public async Task<IActionResult> DeleteAllAds()
        {
            var ads = await unitOfWork.BrandAdRepository.GetAll();
            foreach (var ad in ads)
            {
                // Delete the image file from the server
                var filePath = Path.Combine(_env.WebRootPath, ad.ImageUrl.TrimStart('/'));
                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                }
                // Delete the ad record from the database
                unitOfWork.BrandAdRepository.Delete(ad);
            }
            unitOfWork.Save();
            return Ok(new { message = "All ads deleted successfully." });

        }
    }
}

