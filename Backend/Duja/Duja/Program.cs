
using Duja.Interfaces;
using Duja.Models;
using Duja.Models.payments;
using Duja.Service;
using Duja.UnitOfWorks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace Duja
{
    public class Program
    {

        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddDbContext<DujaContext>(options =>
            options.UseSqlServer(builder.Configuration.GetConnectionString("SqlCon"))
            );
            builder.Services.AddScoped<UnitOfWork>();
            builder.Services.AddScoped<IPaymentClient, PaymobService>();


            builder.Services.AddControllers().AddJsonOptions(option =>
            {
                option.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
            });
            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            //builder.Services.AddOpenApi();
            builder.Services.AddSwaggerGen();
            builder.Services.AddAutoMapper(typeof(Program));

            builder.Services.AddIdentity<User, IdentityRole>().AddEntityFrameworkStores<DujaContext>().AddDefaultTokenProviders();
            builder.Services.AddAuthentication(option =>
            {
                option.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                option.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                option.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;

            }).AddJwtBearer(op =>
            {
                var SigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("Jifkyi7^aU&Ez27jE0XtblDJ@wCrc^@9Ndf3boL%Vpd%vux!pDJm2H5F0aFUjQ!r"));

                op.TokenValidationParameters = new TokenValidationParameters
                {
                    IssuerSigningKey = SigningKey,
                    ValidateAudience = false,
                    ValidateIssuer = false
                };
            });
            // allow angular app to access this api
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", policy =>
                {
                    policy.AllowAnyOrigin()
                          .AllowAnyMethod()
                          .AllowAnyHeader();
                });
            });
            builder.Services.Configure<PaymentOptions>(builder.Configuration.GetSection("Paymob"));
            builder.Services.AddHttpClient("Paymob", (sp, client) =>
            {
                var paymentOptions = sp.GetRequiredService<IOptions<PaymentOptions>>().Value;
                client.BaseAddress = new Uri(paymentOptions.BaseUrl.TrimEnd('/') + "/");
                Console.WriteLine("Paymob BaseAddress = " + client.BaseAddress);

            });
            // 2. In the app section (Before MapControllers)
            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                //app.MapOpenApi();
                app.UseSwagger();
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Duja API v1");
                    c.RoutePrefix = string.Empty;
                });
            }
            app.UseStaticFiles();
            app.UseHttpsRedirection();
            app.UseRouting(); 
            app.UseCors(policy => policy
                .AllowAnyHeader()
                .AllowAnyMethod()
                .SetIsOriginAllowed(origin => true)
                .AllowCredentials());
            app.UseAuthentication();
            app.UseAuthorization();


            app.MapControllers();
            async Task SeedRolesAsync(IServiceProvider services)
            {
                using var scope = services.CreateScope();
                var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

                string[] roles = { "Admin", "User", "Employee" };

                foreach (var role in roles)
                {
                    if (!await roleManager.RoleExistsAsync(role))
                        await roleManager.CreateAsync(new IdentityRole(role));
                }
            }


            await SeedRolesAsync(app.Services);
            app.Run();
        }
    }
}
