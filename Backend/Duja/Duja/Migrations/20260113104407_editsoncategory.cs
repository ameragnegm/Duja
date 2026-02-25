using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Duja.Migrations
{
    /// <inheritdoc />
    public partial class editsoncategory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_productImage_Categories_CategoryId",
                table: "productImage");

            migrationBuilder.DropIndex(
                name: "IX_productImage_CategoryId",
                table: "productImage");

            migrationBuilder.DropColumn(
                name: "CategoryId",
                table: "productImage");

            migrationBuilder.AddColumn<string>(
                name: "Images",
                table: "Categories",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "[]");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Images",
                table: "Categories");

            migrationBuilder.AddColumn<int>(
                name: "CategoryId",
                table: "productImage",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_productImage_CategoryId",
                table: "productImage",
                column: "CategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_productImage_Categories_CategoryId",
                table: "productImage",
                column: "CategoryId",
                principalTable: "Categories",
                principalColumn: "Id");
        }
    }
}
