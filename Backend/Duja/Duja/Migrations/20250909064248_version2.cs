using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Duja.Migrations
{
    /// <inheritdoc />
    public partial class version2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Variants_ProductId",
                table: "Variants");

            migrationBuilder.CreateIndex(
                name: "IX_Variants_ProductId_SizeId_ColorId",
                table: "Variants",
                columns: new[] { "ProductId", "SizeId", "ColorId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Variants_ProductId_SizeId_ColorId",
                table: "Variants");

            migrationBuilder.CreateIndex(
                name: "IX_Variants_ProductId",
                table: "Variants",
                column: "ProductId");
        }
    }
}
