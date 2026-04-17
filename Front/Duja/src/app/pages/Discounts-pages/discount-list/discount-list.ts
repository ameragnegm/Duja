import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IDiscount } from '../../../models/Discount/Discount.model';
import { DiscountService } from '../../../services/discount-service';
import { Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-discount-list',
  imports: [RouterLink, DatePipe],
  templateUrl: './discount-list.html',
  styleUrl: './discount-list.css'
})
export class DiscountList implements OnInit {
  discounts: IDiscount[] = [];
  filteredDiscounts: IDiscount[] = [];
  isLoading = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private discountService: DiscountService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadDiscounts();
    this.cdr.detectChanges();
  }

  loadDiscounts(): void {
    this.isLoading = true;

    this.discountService.getAllDiscounts().subscribe({
      next: (data) => {
        this.discounts = data;
        this.filteredDiscounts = data;
        this.isLoading = false;
        this.cdr.detectChanges();

      },
      error: (err) => {
        console.error('Failed to load discounts', err);
        this.isLoading = false;
      }
    });
  }

  onDelete(id: number): void {
    const confirmed = confirm('Are you sure you want to delete this discount?');
    if (!confirmed) return;

    this.discountService.deleteDiscount(id).subscribe({
      next: (res) => {
        alert(res.message);
        this.loadDiscounts();
      },
      error: (err) => {
        console.error('Delete failed', err);
        alert('Failed to delete discount.');
      }
    });
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value.toLowerCase().trim();

    this.filteredDiscounts = this.discounts.filter(d =>
      d.name.toLowerCase().includes(value) ||
      (d.description ?? '').toLowerCase().includes(value)
    );
  }

  getProductsCount(discount: IDiscount): number {
    return discount.productIds?.length ?? 0;
  }

  getStatus(discount: IDiscount): string {
    const now = new Date();
    const start = new Date(discount.startDate);
    const end = new Date(discount.endDate);

    if (!discount.isActive) return 'Inactive';
    if (now < start) return 'Scheduled';
    if (now > end) return 'Expired';
    return 'Active';
  }
}
