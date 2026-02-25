import { routes } from '../../../app.routes';
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ProductService } from '../../../services/product-service';
import { IProduct } from '../../../models/Product/product.model';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ApiResponce } from '../../../models/Product/ApiResponce.model';
import { Icolor } from '../../../models/Colors/color.model';
import { Isize } from '../../../models/Sizes/size.model';
import { FormsModule } from "@angular/forms";
import { IProductvarient } from '../../../models/Product/productVarient.model';
import { CartService } from '../../../services/cart-service';
import { Global } from '../../../shared/global';

@Component({
  selector: 'app-produc-details',
  imports: [CommonModule, CurrencyPipe, RouterLink, FormsModule],
  templateUrl: './produc-details.html',
  styleUrl: './produc-details.css'
})
export class ProducDetails implements OnInit {

  productID: string | null = "";
  product: IProduct | undefined;
  selectedSizeId: number | null = null;
  selectedColorId: number | null = null;
  currentQuantity: number | undefined;
  AvailableColorsID: number[] = [];
  selectedVariant !: IProductvarient | undefined;
  quantityToBuy: number = 1;
  currentVariants: IProductvarient[] = [];
  AvailableSizesID: number[] = [];
  currentSizes: Isize[] = [];
  currentColors: Icolor[] = [];
  allSizes: Isize[] = [];
  allColors: Icolor[] = [];
  message !: ApiResponce;
  @Output() deleteevent = new EventEmitter();
  constructor(private cartservice : CartService, public global: Global, private router: Router, private productservice: ProductService, private route: ActivatedRoute, private cdr: ChangeDetectorRef) {
  }
  ngOnInit(): void {
    this.productID = this.route.snapshot.paramMap.get('id');
    if (this.productID) {

      this.productservice.getproductByID(this.productID).subscribe(
        {
          next: (data) => {
            this.product = data;

            this.cdr.detectChanges();
            console.log(this.product);
          }
        }
      )
      this.productservice.getProductFormData(this.productID).subscribe(
        {
          next: (data) => {
            this.allSizes = data.sizes;
            this.allColors = data.colors;
            this.getProductAvailableSizes();


          }
        }
      )
    }
  }
  getAvailableColorsforSelectedSize() {
    // 1. Reset state when size changes
    this.selectedColorId = null;
    this.selectedVariant = undefined; // Clear the variant
    this.quantityToBuy = 1;

    if (!this.selectedSizeId || !this.product || !this.product.variants) {
      this.AvailableColorsID = [];
      return;
    }

    // 2. Get variants for this size
    // Ensure we compare numbers to numbers by using == (or ensuring selectedSizeId is a number)
    this.currentVariants = this.product.variants.filter(v => v.sizeID == this.selectedSizeId);

    // 3. Get unique Color IDs
    this.AvailableColorsID = this.currentVariants.map(v => v.colorID);
    const uniqueColorIds = [...new Set(this.AvailableColorsID)];

    // 4. FIX IS HERE: Correctly filter the master color list
    this.currentColors = this.allColors.filter(c => uniqueColorIds.includes(c.id));

    console.log("Available Colors:", this.currentColors);
  }
  getProductAvailableSizes() {
    if (!this.product || !this.product.variants) return;

    this.AvailableSizesID = this.product.variants.map(v => v.sizeID);
    const uniqueSizeIds = [...new Set(this.AvailableSizesID)];
    this.currentSizes = this.allSizes.filter(s => uniqueSizeIds.includes(s.id));
    this.cdr.detectChanges();
    console.log("Available Sizes:", this.currentSizes);

  }

  getSelectedSizeName(): string {
    const size = this.currentSizes.find(s => s.id === this.selectedSizeId);
    return size ? size.name : '';
  }
  onDeleteProduct(productID: number | undefined) {
    if (productID) {
      this.productservice.DeleteProduct(String(productID)).subscribe({
        next: (data) => {
          this.message = data;
          this.cdr.detectChanges();
          alert(this.message.message);
          this.router.navigate(['/product'])
        }
      })

    }

  }
  // ... inside your class

  increaseQty() {
    if (!this.selectedVariant) {
      alert("Please select a size and color first.");
      return;
    }

    // 2. Check if increasing will exceed the available stock
    // Note: We check if the CURRENT quantity is LESS than the stock
    if (this.quantityToBuy < this.selectedVariant.stockQuantity) {
      this.quantityToBuy++;
      console.log(this.selectedVariant.stockQuantity);
    } else {
      alert(`Sorry, only ${this.selectedVariant.stockQuantity} items available.`);
    }

    // No need for cdr.detectChanges() here usually, but keep it if you use OnPush
    this.cdr.detectChanges();
  }

  decreaseQty() {
    // 1. Simply ensure we don't go below 1
    if (this.quantityToBuy > 1) {
      this.quantityToBuy--;
      this.cdr.detectChanges();
    }
  }
  onColorChange() {
    console.log(this.selectedColorId);
    console.log(this.selectedSizeId);

    this.selectedVariant = this.currentVariants.find(v => v.colorID == this.selectedColorId && v.sizeID == this.selectedSizeId);

    console.log(this.selectedVariant);

    this.quantityToBuy = 1;
  }
  goBack() {
    this.global.goBack();
  }AddToCartandView() {
  this.cartservice.addToCart(this.product, this.selectedVariant, this.quantityToBuy);

    const goToCart = confirm(
      'Item added to cart.\n\nPress OK → Go to Cart\nPress Cancel → Continue Shopping'
    );

    if (goToCart) {
      this.router.navigate(['/cart']);
    }
  }

}
