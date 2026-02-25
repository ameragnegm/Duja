import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IOrder } from '../../../models/Order/order.model';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { OrderService } from '../../../services/order-service';
import { RouterLink } from "@angular/router";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-list',
  imports: [RouterLink, DatePipe, CommonModule, FormsModule, RouterLink],
  templateUrl: './order-list.html',
  styleUrl: './order-list.css'
})
export class OrderList implements OnInit {
  searchTerm: string = '';
  statusFilter: string = 'All';
  dateFilter: string | null = null;
  orders: IOrder[] = [];
  filteredOrders: IOrder[] = [];
  isLoading = true;
  editingOrderId: number | null = null;
  constructor(private orderservice: OrderService, private cdr: ChangeDetectorRef) { }
  ngOnInit(): void {
    this.loadOrders();
  }
  loadOrders() {

    this.orderservice.getAllOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.isLoading = false;
        this.filteredOrders = this.orders;
        this.cdr.detectChanges();

      }
    });
  }
  getStatusConfig(status: string) {
    switch (status) {
      case 'Pending':
        return { icon: 'bi-hourglass-split', color: 'text-warning', bg: 'bg-warning' };
      case 'Confirmed':
        return { icon: 'bi-check2-circle', color: 'text-info', bg: 'bg-info' };
      case 'Processing':
        return { icon: 'bi-gear-wide-connected', color: 'text-primary', bg: 'bg-primary' };
      case 'Shipped':
        return { icon: 'bi-truck', color: 'text-primary', bg: 'bg-primary' };
      case 'Delivered':
        return { icon: 'bi-box-seam-fill', color: 'text-success', bg: 'bg-success' };
      case 'Cancelled':
        return { icon: 'bi-x-circle-fill', color: 'text-danger', bg: 'bg-danger' };
      default:
        return { icon: 'bi-question-circle', color: 'text-secondary', bg: 'bg-secondary' };
    }
  }
  onSearch(event: any) {
    this.searchTerm = event.target.value.toLowerCase();
    this.applyFilters();
  }

  onStatusFilter(event: any) {
    this.statusFilter = event.target.value;
    this.applyFilters();
  }

  onDateFilter(event: any) {
    this.dateFilter = event.target.value; // Returns '2024-01-15'
    this.applyFilters();
  }

  // 3. The Master Filter Logic
  applyFilters() {
    this.filteredOrders = this.orders.filter(o => {

      // Check 1: Text Search (Name, Phone, or Address)
      const matchesSearch = !this.searchTerm ||
        (o.ownerName && o.ownerName.toLowerCase().includes(this.searchTerm)) ||
        (o.ownerPhone && o.ownerPhone.includes(this.searchTerm)) ||
        (o.address && o.address.toLowerCase().includes(this.searchTerm));

      // Check 2: Status
      const matchesStatus = this.statusFilter === 'All' || o.status === this.statusFilter;

      // Check 3: Date (Compare YYYY-MM-DD strings)
      // Assuming o.orderDate is a valid date string or Date object
      let matchesDate = true;
      if (this.dateFilter) {
        const orderDateString = new Date(o.orderDate).toISOString().split('T')[0]; // Extract YYYY-MM-DD
        matchesDate = orderDateString === this.dateFilter;
      }

      // RETURN: Only true if ALL conditions are met
      return matchesSearch && matchesStatus && matchesDate;
    });
  }
  startEdit(id: number) {
    this.editingOrderId = id;
  }

  cancelEdit() {
    this.editingOrderId = null;
    this.loadOrders();
  }

  saveOrder(order: any) {
    this.orderservice.updateOrder(this.editingOrderId, order).subscribe({
      next: (data) => {
        this.cdr.detectChanges();
        this.loadOrders();
        alert(data.message);
      }
    })
    this.editingOrderId = null;
  }
}