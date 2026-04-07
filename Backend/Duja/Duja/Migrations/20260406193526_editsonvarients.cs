using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Duja.Migrations
{
    /// <inheritdoc />
    public partial class editsonvarients : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Width",
                table: "Variants");

            migrationBuilder.AlterColumn<decimal>(
                name: "Length",
                table: "Variants",
                type: "decimal(18,2)",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.AddColumn<decimal>(
                name: "Hip",
                table: "Variants",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Inseam",
                table: "Variants",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Note",
                table: "Variants",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Shoulder",
                table: "Variants",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Sleevelength",
                table: "Variants",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Thigh",
                table: "Variants",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Waist",
                table: "Variants",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Weight",
                table: "Variants",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "bust",
                table: "Variants",
                type: "decimal(18,2)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Hip",
                table: "Variants");

            migrationBuilder.DropColumn(
                name: "Inseam",
                table: "Variants");

            migrationBuilder.DropColumn(
                name: "Note",
                table: "Variants");

            migrationBuilder.DropColumn(
                name: "Shoulder",
                table: "Variants");

            migrationBuilder.DropColumn(
                name: "Sleevelength",
                table: "Variants");

            migrationBuilder.DropColumn(
                name: "Thigh",
                table: "Variants");

            migrationBuilder.DropColumn(
                name: "Waist",
                table: "Variants");

            migrationBuilder.DropColumn(
                name: "Weight",
                table: "Variants");

            migrationBuilder.DropColumn(
                name: "bust",
                table: "Variants");

            migrationBuilder.AlterColumn<decimal>(
                name: "Length",
                table: "Variants",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)",
                oldNullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Width",
                table: "Variants",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);
        }
    }
}
