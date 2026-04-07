using AutoMapper;
using Duja.DTOs.Category;
using Duja.DTOs.Color;
using Duja.DTOs.Product;
using Duja.DTOs.Size;
using Duja.Migrations;
using Duja.Models;
using Duja.UnitOfWorks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
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
            if (product == null)
                return BadRequest(new { message = "No data received" });

            List<ProductVarientDto> variants = new();

            if (!string.IsNullOrWhiteSpace(product.VariantsINJSON))
            {
                try
                {
                    var raw = product.VariantsINJSON.Trim();

                    var options = new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    };

                    if (raw.StartsWith("["))
                    {
                        variants = JsonSerializer.Deserialize<List<ProductVarientDto>>(raw, options)
                                   ?? new List<ProductVarientDto>();
                    }
                    else if (raw.StartsWith("{"))
                    {
                        var singleVariant = JsonSerializer.Deserialize<ProductVarientDto>(raw, options);

                        if (singleVariant != null)
                        {
                            variants.Add(singleVariant);
                        }
                    }
                    else
                    {
                        return BadRequest(new
                        {
                            message = "Invalid variants JSON format",
                            raw = product.VariantsINJSON
                        });
                    }
                }
                catch (Exception ex)
                {
                    return BadRequest(new
                    {
                        message = "Invalid variants JSON",
                        raw = product.VariantsINJSON,
                        details = ex.Message
                    });
                }
            }
        

            var mappedproduct = new Product
            {
                Name = product.Name,
                Price = product.Price,
                Description = product.Description,
                CategoryId = product.CategoryId ,
                Images = new List<productImage>(),
                Variants = new List<ProductVariant>()
            };

            var currentCategory = mappedproduct.CategoryId > 0
                ? await unit.CategoryRepository.GetById(mappedproduct.CategoryId)
                : null;

            // Images
            if (product.NewImages != null && product.NewImages.Count > 0)
            {
                var folderpath = Path.Combine(webHostEnvironment.WebRootPath, "images/product");
                Directory.CreateDirectory(folderpath);

                foreach (var image in product.NewImages)
                {
                    var imgName = $"{Guid.NewGuid()}{Path.GetExtension(image.FileName)}";
                    var fullpath = Path.Combine(folderpath, imgName);

                    using (var stream = new FileStream(fullpath, FileMode.Create))
                    {
                        await image.CopyToAsync(stream);
                    }

                    var productImage = new productImage
                    {
                        ImageUrl = $"images/product/{imgName}"
                    };

                    mappedproduct.Images.Add(productImage);
                }

                if (currentCategory != null)
                {
                    foreach (var img in mappedproduct.Images)
                    {
                        currentCategory.Images.Add(img.ImageUrl);
                    }
                }
            }

            // Variants
            foreach (var v in variants)
            {
                var currentVariant = new ProductVariant
                {
                    SizeId = v.SizeID,
                    ColorId = v.ColorID,
                    StockQuantity = v.StockQuantity,
                    Length = v.Length,
                    Shoulder = v.Shoulder,
                    bust = v.bust,
                    Sleevelength = v.Sleevelength,
                    Waist = v.Waist,
                    Hip = v.Hip,
                    Inseam = v.Inseam,
                    Thigh = v.Thigh,
                    Weight = v.Weight,
                    Note = v.Note
                };

                mappedproduct.Variants.Add(currentVariant);
            }

            unit.ProductRepository.Add(mappedproduct);
            await unit.saveAsync();

            return Ok(new
            {
                message = "Added Successfully.",
                productId = mappedproduct.Id
            });
        }

        [HttpPut("{id}")]
        [EndpointSummary("Edit Specific Product")]
        public async Task<IActionResult> UpdateProduct(int id, [FromForm] UpdateProductDTO dto)
        {
            try
            {
                var product = await unit.ProductRepository.GetById(id);

                if (product == null)
                {
                    return NotFound(new { message = $"Product with ID {id} not found." });
                }

                // -----------------------------------
                // 1) Update simple product fields with mapper
                // -----------------------------------
                mapper.Map(dto, product);

                if (product.Images == null)
                    product.Images = new List<productImage>();

                if (product.Variants == null)
                    product.Variants = new List<ProductVariant>();

                // -----------------------------------
                // 2) Delete selected old images
                // -----------------------------------
                if (dto.ImagesToDelete != null && dto.ImagesToDelete.Any())
                {
                    foreach (var imageIdToDelete in dto.ImagesToDelete)
                    {
                        var image = product.Images.FirstOrDefault(i => i.Id == imageIdToDelete);
                        if (image != null)
                        {
                            var fullPath = Path.Combine(
                                webHostEnvironment.WebRootPath,
                                image.ImageUrl.TrimStart('/').Replace("/", Path.DirectorySeparatorChar.ToString())
                            );

                            if (System.IO.File.Exists(fullPath))
                            {
                                System.IO.File.Delete(fullPath);
                            }

                            unit.ImgRepository.Delete(image);
                        }
                    }
                }

                // -----------------------------------
                // 3) Add new uploaded images
                // -----------------------------------
                if (dto.NewImages != null && dto.NewImages.Any())
                {
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

                        product.Images.Add(new productImage
                        {
                            ImageUrl = relativePath
                        });
                    }
                }

                // -----------------------------------
                // 4) Parse variants JSON flexibly
                // -----------------------------------
                List<ProductVarientDto> incomingVariants = new();

                if (!string.IsNullOrWhiteSpace(dto.VariantsINJSON))
                {
                    try
                    {
                        var raw = dto.VariantsINJSON.Trim();

                        var options = new System.Text.Json.JsonSerializerOptions
                        {
                            PropertyNameCaseInsensitive = true
                        };

                        if (raw.StartsWith("["))
                        {
                            incomingVariants =
                                System.Text.Json.JsonSerializer.Deserialize<List<ProductVarientDto>>(raw, options)
                                ?? new List<ProductVarientDto>();
                        }
                        else if (raw.StartsWith("{"))
                        {
                            var singleVariant =
                                System.Text.Json.JsonSerializer.Deserialize<ProductVarientDto>(raw, options);

                            if (singleVariant != null)
                            {
                                incomingVariants.Add(singleVariant);
                            }
                        }
                        else
                        {
                            return BadRequest(new
                            {
                                message = "Invalid variants JSON format",
                                raw = dto.VariantsINJSON
                            });
                        }
                    }
                    catch (Exception ex)
                    {
                        return BadRequest(new
                        {
                            message = "Invalid variants JSON",
                            raw = dto.VariantsINJSON,
                            details = ex.Message
                        });
                    }
                }

                // -----------------------------------
                // 5) Sync variants (delete / update / add)
                // -----------------------------------
                var existingVariants = product.Variants.ToList();

                var incomingExistingIds = incomingVariants
                    .Where(v => v.Id > 0)
                    .Select(v => v.Id)
                    .ToHashSet();

                // Delete variants that were removed from request
                var variantsToDelete = existingVariants
                    .Where(v => !incomingExistingIds.Contains(v.Id))
                    .ToList();

                foreach (var variantToDelete in variantsToDelete)
                {
                    unit.VariantRepository.Delete(variantToDelete);
                }

                // Update existing or add new
                foreach (var vDto in incomingVariants)
                {
                    var existingVariant = existingVariants.FirstOrDefault(v => v.Id == vDto.Id);

                    if (existingVariant != null)
                    {
                        // UPDATE existing variant using mapper
                        mapper.Map(vDto, existingVariant);
                    }
                    else
                    {
                        // ADD new variant using mapper
                        var newVariant = mapper.Map<ProductVariant>(vDto);
                        product.Variants.Add(newVariant);
                    }
                }

                // -----------------------------------
                // 6) Save all changes
                // -----------------------------------
                await unit.saveAsync();

                return Ok(new { message = "Product updated successfully." });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return StatusCode(500, new
                {
                    message = "An internal server error occurred while updating the product.",
                    details = ex.Message
                });
            }
        }

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
