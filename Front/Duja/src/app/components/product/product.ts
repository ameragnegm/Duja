import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IProduct } from '../../models/Product/product.model';
import { CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Global } from '../../shared/global';

@Component({
  selector: 'app-product',
  imports: [CurrencyPipe],
  templateUrl: './product.html',
  styleUrl: './product.css'
})
export class Product {
  @Input() product: IProduct | undefined;
  @Output() deleteevent = new EventEmitter();
  
  constructor(private route: Router, public global: Global) {
  }
  
  DeleteProduct(id: number) {

    if (confirm("Are you sure to Delete this product ?")) {
      this.deleteevent.emit(this.product?.id);
    }

  }

hasStock(product: any): boolean {
  if (product.variants && product.variants.length > 0) {
    return product.variants.some((v: any) => v.stockQuantity > 0);
  }
   return product.stockQuantity > 0;
}
  goToDetails(id: number) {
    this.route.navigate(['/product', id]);
  }
}
