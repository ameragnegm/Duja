using Duja.Models;
using Duja.Repositories;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel;

namespace Duja.UnitOfWorks
{
    public class UnitOfWork
    {
        private readonly DujaContext context;
        ProductRepository productRepository;
        CategoryRepository categoryRepository;
        OrderRepository orderRepository;
        SizeRepository sizeRepository;
        ColorRepository colorRepository;
        ProductImageRepository imgRepository;
        EmployeeRepository employeeRepository;
        BrandAdRepository brandAdRepository;
        GovernorateRepository governorateRepository;
        BrandRepository brandINFORepository;
        VariantRepository variantRepository;

        public UnitOfWork(DujaContext context)
        {
            this.context = context;
        }
        public BrandRepository BrandInfoRepository
        {
            get
            {
                if (brandINFORepository == null)
                    brandINFORepository = new BrandRepository(context);
                return brandINFORepository;
            }
        }
        public VariantRepository VariantRepository
        {
            get
            {
                if (variantRepository == null)
                    variantRepository = new VariantRepository(context);
                return variantRepository;
            }
        }
        public GovernorateRepository GovernorateRepository
        {
            get
            {
                if (governorateRepository == null)
                    governorateRepository = new GovernorateRepository(context);
                return governorateRepository;
            }
        }
        public BrandAdRepository BrandAdRepository
        {
            get
            {
                if (brandAdRepository == null)
                    brandAdRepository = new BrandAdRepository(context);
                return brandAdRepository;
            }
        }
        public EmployeeRepository EmployeeRepository
        {
            get
            {
                if (employeeRepository == null)
                    employeeRepository = new EmployeeRepository(context);
                return employeeRepository;
            }
        }
        public ProductImageRepository ImgRepository
        {
            get
            {
                if (imgRepository == null)
                    imgRepository = new ProductImageRepository(context);
                return imgRepository;
            }
        }
        public ColorRepository ColorRepository
        {
            get
            {
                if (colorRepository == null)
                    colorRepository = new ColorRepository(context);
                return colorRepository;
            }
        }
        public SizeRepository SizeRepository
        {
            get
            {
                if (sizeRepository == null)
                    sizeRepository = new SizeRepository(context);
                return sizeRepository;
            }
        }

        public OrderRepository OrderRepository
        {
            get
            {
                if (orderRepository == null)
                    orderRepository = new OrderRepository(context);
                return orderRepository;
            }
        }


        public CategoryRepository CategoryRepository
        {
            get
            {
                if (categoryRepository == null)
                    categoryRepository = new CategoryRepository(context);
                return categoryRepository;
            }
        }
        public ProductRepository ProductRepository
        {
            get
            {
                if (productRepository == null)
                    productRepository = new ProductRepository(context);

                return productRepository;
            }
        }
        public int Save()
        {
            return context.SaveChanges();
        }
        public async Task saveAsync ()
        {
           await context.SaveChangesAsync();
        }

    }
}

