using AutoMapper;
using Duja.DTOs.Category;
using Duja.DTOs.Color;
using Duja.DTOs.Employee;
using Duja.DTOs.Order;
using Duja.DTOs.Product;
using Duja.DTOs.Size;
using Duja.DTOs.User;
using Duja.Models;
using Microsoft.AspNetCore.Identity;

namespace Duja.Mapping
{
     public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<RegisterDto, User>().ForMember(d => d.UserName,
                o => o.MapFrom(s => string.IsNullOrWhiteSpace(s.UserName) ? s.Email : s.UserName)).ForMember(d => d.PasswordHash, o => o.Ignore());
            CreateMap<UpdateProductDTO, Product>().ReverseMap();
            CreateMap<ProductDTO, Product>().ReverseMap();
            CreateMap<ProductVariant, ProductVarientDto>().ReverseMap();
            CreateMap<AddproductDTO, Product>().ForMember(dest => dest.Images, opt => opt.Ignore());
            CreateMap<AddvarientDTO, ProductVariant>().ReverseMap();
            CreateMap<productImage, Product>().ReverseMap();
            CreateMap<productImage, ProductImageDTO>().ReverseMap();

            CreateMap<Category, CategoryDto>().ReverseMap();
            CreateMap<AddCategoryDTO, Category>().ReverseMap();

            CreateMap<OrderItem, OrderItemDTO>()
               .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.ProductVariant.Product.Name))
               .ForMember(dest => dest.ProductImage, opt => opt.MapFrom(src => src.ProductVariant.Product.Images.FirstOrDefault().ImageUrl))
               .ForMember(dest => dest.Size, opt => opt.MapFrom(src => src.ProductVariant.Size.Name))
               .ForMember(dest => dest.Color, opt => opt.MapFrom(src => src.ProductVariant.Color.Name))
               .ForMember(dest => dest.UnitPrice, opt => opt.MapFrom(src => src.ProductVariant.Product.Price));
            CreateMap<Order, OrderDTO>()
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString())) // Enum to String
                .ForMember(dest => dest.PaymentMethod, opt => opt.MapFrom(src => src.PaymentMethod.ToString()))
                .ForMember(des => des.userName, opt => opt.MapFrom(src => src.User.UserName)).ReverseMap();

            CreateMap<AddOrder, Order>()
            .ForMember(dest => dest.PaymentMethod, opt => opt.MapFrom(src =>  src.PaymentMethod
            .ToLower() == "full" ? PaymentMethod.FullAmount : PaymentMethod.DeliveryOnly)).ForMember(dest => dest.Delivery, opt => opt.MapFrom(src => src.DeliveryPrice))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => OrderStatus.Pending));

            CreateMap<OrderItem, addOrderItem>().ReverseMap();
            CreateMap<UpdateOrderDTO, Order>().ReverseMap();

            CreateMap<Size, SizeDTO>().ReverseMap();
            CreateMap<AddSizeDTO, Size>().ReverseMap();

            CreateMap<DeliveryDetails, governorateDTO>().ReverseMap();

            CreateMap<IdentityRole, RoleDTO>().ReverseMap();
            CreateMap<Color, ColorDTO>().ReverseMap();
            CreateMap<AddColorDTO, Color>().ReverseMap();
            CreateMap<AddEmplDTO, employee>()
            .ForMember(d => d.User, o => o.Ignore());

            CreateMap<employee, DisplayEmpDTO>().ForMember(dest => dest.Email,
                       opt => opt.MapFrom(src => src.User.Email)).ForMember(des => des.phoneNumber, opt => opt.MapFrom(src => src.User.PhoneNumber))
                       .ForMember(des => des.UserName, opt => opt.MapFrom(src => src.User.UserName))
                       .ForPath(des => des.FullName, opt => opt.MapFrom(src => src.User.FullName)).ReverseMap();

            CreateMap<AddEmplDTO, User>()
                .ForMember(dest => dest.Address, opt => opt.MapFrom(src => src.Address))
                .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.FullName))
                .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.phoneNumber))
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.UserName))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
                .ReverseMap();
            CreateMap<employee, User>()
                .ForMember(dest => dest.Address, opt => opt.MapFrom(src => src.Address))
                .ReverseMap();

        }

    }

}
