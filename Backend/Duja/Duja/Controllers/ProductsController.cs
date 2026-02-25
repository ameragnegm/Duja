using AutoMapper;
using Duja.DTOs.Category;
using Duja.DTOs.Color;
using Duja.DTOs.Product;
using Duja.DTOs.Size;
using Duja.Migrations;
using Duja.Models;
using Duja.UnitOfWorks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Threading.Tasks;
using static System.Net.Mime.MediaTypeNames;

namespace Duja.Controllers
{
    [Route("api/[controller]")]
    //[Authorize(Roles = "Admin, Employee")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly UnitOfWork unit;
        private readonly IMapper mapper;
        private readonly IWebHostEnvironment webHostEnvironment;

        public ProductsController(UnitOfWork unit, IMapper mapper, IWebHostEnvironment webHostEnvironment)
        {
            this.unit = unit;
            this.mapper = mapper;
            this.webHostEnvironment = webHostEnvironment;
        }
        [HttpGet]
        [AllowAnonymous]
        [EndpointSummary("All Products Info")]
        public async Task<IActionResult> GetProducts()
        {
            var products = await unit.ProductRepository.GetAll();
            if (products == null) return BadRequest(new { message = " No Products Founded." });
            var mappedProducts = mapper.Map<List<ProductDTO>>(products);
            return Ok(mappedProducts);
        }

        [HttpGet("DataForm/{id?}")]
        [EndpointSummary("Get Data for a produt Form ")]
        public async Task<IActionResult> GetDataForForm(int id)
        {
            ProductFormDataDTO formdata = new ProductFormDataDTO
            {
                Categories = mapper.Map<List<CategoryDto>>(await unit.CategoryRepository.GetAll()),
                Sizes = mapper.Map<List<SizeDTO>>(await unit.SizeRepository.GetAll()),
                Colors = mapper.Map<List<ColorDTO>>(await unit.ColorRepository.GetAll())

            };
            if (id > 0)
            {
                formdata.Product = mapper.Map<ProductDTO>(await unit.ProductRepository.GetById(id));
            }
            return Ok(formdata);
        }


        [HttpGet("{id}")]
        [AllowAnonymous]
        [EndpointSummary("Specific Product's Info")]
        public async Task<IActionResult> GetProductByID(int id)
        {
            if (id == 0)
                return BadRequest(new { message = "Something Wrong." });

            var product = await unit.ProductRepository.GetById(id);
            if (product == null)
                return BadRequest(new { message = "Product Not Found" });

            var mappedproduct = mapper.Map<ProductDTO>(product);
            return Ok(mappedproduct);
        }


        // get all products images that has the same category id
        //[HttpGet("Category/{id}")]
        //[AllowAnonymous]    
        //[EndpointSummary("Get Products by Category ID")]
        //public async Task<IActionResult> GetProductsByCategoryID(int id)
        //{
        //    var products = await unit.ProductRepository.GetProductsByCategoryId(id);
        //    if (products == null || products.Count == 0)
        //        return NotFound(new { message = "No products found for the specified category." });
        //    var mappedProducts = mapper.Map<List<ProductDTO>>(products);
        //    return Ok(mappedProducts);
        //}


        [HttpPost]
        [EndpointSummary("Add New Product")]
        public async Task<IActionResult> AddProduct([FromForm] AddproductDTO product)
        {

            if (product == null) return BadRequest(new { message = " No data received " });
            foreach (var v in product.Variants)
            {
                Console.WriteLine(v.StockQuantity);
            }

            var mappedproduct = mapper.Map<Product>(product);
            var currentCategory = await unit.CategoryRepository.GetById(mappedproduct.CategoryId);
            if (product.NewImages != null && product.NewImages.Count > 0)
            {
                foreach (var image in product.NewImages)
                {

                    var folderpath = Path.Combine(webHostEnvironment.WebRootPath, "images/product");
                    var ImgName = $"{Guid.NewGuid()}{Path.GetExtension(image.FileName)}";
                    var fullpath = Path.Combine(folderpath, ImgName);
                    using (var stream = new FileStream(fullpath, FileMode.Create))
                    {
                        await image.CopyToAsync(stream);
                    }
                    productImage productImage = new productImage()
                    {
                        ImageUrl = $"images/product/{ImgName}"
                    };
                    mappedproduct.Images.Add(productImage);
                }

                foreach (var img in mappedproduct.Images)
                {
                    currentCategory.Images.Add(img.ImageUrl);
                }
            }
            unit.ProductRepository.Add(mappedproduct);

            await unit.saveAsync();
            return Ok(new { message = "Added Successfully." });
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, [FromForm] UpdateProductDTO dto)
        {
            try
            {
                // 1. EAGER LOAD the product. 
                // Your GetById method MUST use .Include(p => p.Images) and .Include(p => p.Variants)
                var product = await unit.ProductRepository.GetById(id);

                if (product == null)
                {
                    return NotFound($"Product with ID {id} not found.");
                }

                // 2. USE THE MAPPER to update simple properties (Name, Price, etc.).
                mapper.Map(dto, product);

                // 3. HANDLE IMAGE DELETIONS.
                // We add a check for product.Images != null just in case.
                if (product.Images != null && dto.ImagesToDelete != null && dto.ImagesToDelete.Any())
                {
                    foreach (var imageIdToDelete in dto.ImagesToDelete)
                    {
                        var image = product.Images.FirstOrDefault(i => i.Id == imageIdToDelete);
                        if (image != null)
                        {
                            var fullPath = Path.Combine(webHostEnvironment.WebRootPath, image.ImageUrl.TrimStart('/'));
                            if (System.IO.File.Exists(fullPath))
                            {
                                System.IO.File.Delete(fullPath);
                            }
                            unit.ImgRepository.Delete(image);
                        }
                    }
                }

                // 4. HANDLE NEW IMAGE ADDITIONS.
                if (dto.NewImages != null && dto.NewImages.Any())
                {
                    // FAILSAFE: Initialize the collection if it's null.
                    if (product.Images == null)
                    {
                        product.Images = new List<productImage>();
                    }

                    var folder = Path.Combine(webHostEnvironment.WebRootPath, "images/product");
                    Directory.CreateDirectory(folder);

                    foreach (var file in dto.NewImages)
                    {
                        var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
                        var relativePath = $"images/product/{fileName}";
                        var fullPath = Path.Combine(folder, fileName);

                        await using (var stream = new FileStream(fullPath, FileMode.Create))
                        {
                            await file.CopyToAsync(stream);
                        }

                        product.Images.Add(new productImage { ImageUrl = relativePath });
                    }
                }

                // 5. HANDLE VARIANT UPDATES (Add, Update, Delete).
                if (dto.Variants != null)
                {
                    // FAILSAFE: Initialize the collection if it's null.
                    // This is the most likely fix for your 500 error.
                    if (product.Variants == null)
                    {
                        product.Variants = new List<ProductVariant>();
                    }

                    // This line is now safe from NullReferenceException
                    var existingVariants = product.Variants.ToList();
                    var incomingVariantIds = dto.Variants.Select(v => v.ID).ToHashSet();

                    // Delete variants
                    var variantsToDelete = existingVariants.Where(v => !incomingVariantIds.Contains(v.Id)).ToList();
                    if (variantsToDelete.Any())
                    {
                        unit.ProductRepository.RemoveRange(variantsToDelete);
                    }

                    // Update existing and add new variants
                    foreach (var vDto in dto.Variants)
                    {
                        var existingVariant = existingVariants.FirstOrDefault(v => v.Id == vDto.ID);
                        if (existingVariant != null)
                        {
                            // UPDATE
                            existingVariant.SizeId = vDto.SizeID;
                            existingVariant.ColorId = vDto.ColorID;
                            existingVariant.StockQuantity = vDto.StockQuantity;
                            existingVariant.Length = vDto.Length;
                            existingVariant.Width = vDto.Width;
                        }
                        else
                        {
                            // ADD
                            product.Variants.Add(new ProductVariant
                            {
                                SizeId = vDto.SizeID,
                                ColorId = vDto.ColorID,
                                StockQuantity = vDto.StockQuantity,
                                Length = vDto.Length,
                                Width = vDto.Width
                            });
                        }
                    }
                }

                // 6. PERSIST all changes to the database.
                await unit.saveAsync();

                return Ok(new { message = "Product updated successfully." });
            }
            catch (Exception ex)
            {
                // Remember to log the exception 'ex' with your logging service
                Console.WriteLine(ex);
                return StatusCode(500, "An internal server error occurred while updating the product.");
            }
        }   //[EndpointSummary("Edit Specific Product")]



        [HttpDelete("{productid}/images")]
        [EndpointSummary("Delete specific product Image")]
        public async Task<IActionResult> DeleteProductImage(int productid, [FromBody] List<int> ImagesIDs)
        {
            var product = await unit.ProductRepository.GetById(productid);
            if (product == null) return NotFound(new { message = "Product Not Founded" });
            foreach (var imgid in ImagesIDs)
            {
                var image = product.Images.FirstOrDefault(i => i.Id == imgid);
                if (image != null)
                {
                    var fullpath = Path.Combine(webHostEnvironment.WebRootPath, image.ImageUrl.Replace("wwwroot/", ""));
                    if (System.IO.File.Exists(fullpath))
                    {
                        System.IO.File.Delete(fullpath);
                    }
                    unit.ImgRepository.Delete(image);
                }
            }
            unit.Save();
            return Ok(new { message = "Image Deleted Successfully." });
        }

        [HttpDelete("{productId}/varients")]
        [EndpointSummary("Delete specific product Varient")]
        public async Task<IActionResult> DeleteProductVarient(int productId, [FromBody] List<int> VarientIDs)
        {
            var product = await unit.ProductRepository.GetById(productId);
            if (product == null) return NotFound(new { message = "Product Not Founded" });
            foreach (var varientid in VarientIDs)
            {
                var varient = product.Variants.FirstOrDefault(v => v.Id == varientid);
                if (varient != null)
                {
                    unit.ProductRepository.RemoveVariant(varientid);
                }
            }
            unit.Save();
            return Ok(new { message = "Varient Deleted Successfully." });
        }

        [HttpDelete("{id}")]
        [EndpointSummary("Delete Specific Product")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            if (id == 0) return BadRequest(new { message = " No data received " });
            var product = await unit.ProductRepository.GetById(id);
            if (product == null) return BadRequest(new { message = "Product Not found " });
            unit.ProductRepository.Delete(product);
            unit.Save();
            return Ok(new { message = "Deleted Successfully." });
        }
    }
}
