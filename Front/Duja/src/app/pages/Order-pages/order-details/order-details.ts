import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IOrder } from '../../../models/Order/order.model';
import { OrderService } from '../../../services/order-service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ApiResponce } from '../../../models/Product/ApiResponce.model';
import { FormsModule } from '@angular/forms';
import { Global } from '../../../shared/global';

@Component({
  selector: 'app-order-details',
  imports: [CurrencyPipe, DatePipe, FormsModule, CommonModule],
  templateUrl: './order-details.html',
  styleUrl: './order-details.css'
})
export class OrderDetails implements OnInit {
  order !: IOrder;
  orderItems: any[] = [];
  message !: ApiResponce;
  orderId: string | null = '';
  isLoading = true;
  constructor(private orderService : OrderService,private router: Router, private cdr: ChangeDetectorRef, private orderservice: OrderService, private route: ActivatedRoute, public global: Global) { }

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('id');
    if (this.orderId) {
      this.orderservice.getSpecificOrder(this.orderId).subscribe({
        next: (data) => {
          this.order = data;
          console.log(this.order);
          this.orderItems = this.order.orderItems;
          this.isLoading = false;
          this.cdr.detectChanges();

        }
      })
      this.orderservice.getOrderItems(this.orderId).subscribe({
        next: (data) => {
          this.orderItems = data;
          this.cdr.detectChanges();
        }
      })

    }
  }

ConfirmOrder() {
   if(confirm("Are you sure you want to confirm this order?")) {
      this.orderService.confirmOrder(this.order.id).subscribe(() => {
         this.cdr.detectChanges(); 
      });
   }
}
  onImgError(e: Event) {
    (e.target as HTMLImageElement).src = 'assets/no-image.png';
  }
  DeleteCurrentOrder() {

    const ok = confirm('Are you sure you want to delete this order?');
    if (!ok) return;

    this.orderservice.DeleteOrder(Number(this.orderId)).subscribe({
      next: (res) => {
        alert('Order deleted successfully.');
        this.router.navigate(['/manage/orders']);
      },
      error: (err) => {
        console.error(err);
        alert('Failed to delete the order.');
      }
    });
  }

}
