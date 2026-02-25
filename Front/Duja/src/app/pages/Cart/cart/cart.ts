import { ColorService } from './../../../services/color-service';
import { SizeService } from './../../../services/size-service';
import { CartService } from './../../../services/cart-service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IProduct } from '../../../models/Product/product.model';
import { ICartItem } from '../../../models/cart.model';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Isize } from '../../../models/Sizes/size.model';
import { Icolor } from '../../../models/Colors/color.model';
import { forkJoin } from 'rxjs';
import { RouterLink } from '@angular/router';
import { IProductvarient } from '../../../models/Product/productVarient.model';
import { FormsModule } from '@angular/forms';
import { Global } from '../../../shared/global';

@Component({
  selector: 'app-cart',
  imports: [FormsModule, CurrencyPipe, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart implements OnInit {
  cartItems: ICartItem[] = [];
  cartSubtotal: number = 0;
  allSizes: Isize[] = [];
  allColors: Icolor[] = [];
  editingItem: ICartItem | null = null; // The item currently being edited
  editAvailableColors: Icolor[] = [];   // Colors available for the selected size

  // Temporary selections
  editSizeId: number | null = null;
  editColorId: number | null = null;
  constructor(private cdr :ChangeDetectorRef,private sizeService: SizeService, private colorService: ColorService, private cartService: CartService, public global: Global) { }
  ngOnInit(): void {
    forkJoin({
      sizes: this.sizeService.getallSizes(),
      colors: this.colorService.getallColors()
    }).subscribe(data => {
      this.allSizes = data.sizes;
      this.allColors = data.colors;
      this.cdr.detectChanges()
    });
    this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
      this.cdr.detectChanges()
      
      this.calculateTotal();
    });
    console.log(this.cartItems);
  }
  startEditing(item: ICartItem) {
    this.editingItem = item;
    this.editSizeId = item.variant.sizeID;
    this.editColorId = item.variant.colorID;

    // Initialize the color dropdown for the current size
    this.updateAvailableColorsForEdit(item.product.variants);
  }
  // In cart.component.ts

  // Helper to get available sizes for a specific cart item's product
  getAvailableSizesForItem(item: ICartItem): Isize[] {
    if (!item.product || !item.product.variants) return [];

    const sizeIds = item.product.variants.map(v => v.sizeID);
    const uniqueSizeIds = [...new Set(sizeIds)];

    return this.allSizes.filter(s => uniqueSizeIds.includes(s.id));
  }

  // Helper to get available colors for a specific cart item's product AND selected size
  getAvailableColorsForItem(item: ICartItem, selectedSizeId: number): Icolor[] {
    if (!item.product || !item.product.variants || !selectedSizeId) return [];

    const validVariants = item.product.variants.filter(v => v.sizeID == selectedSizeId);
    const colorIds = validVariants.map(v => v.colorID);
    const uniqueColorIds = [...new Set(colorIds)];

    return this.allColors.filter(c => uniqueColorIds.includes(c.id));
  }
  // 2. Cancel Editing
  cancelEdit() {
    this.editingItem = null;
    this.editSizeId = null;
    this.editColorId = null;
  }

  // 3. Save Changes
  saveEdit() {
    if (!this.editingItem || !this.editSizeId || !this.editColorId) return;

    // Find the full variant object based on IDs
    const newVariant = this.editingItem.product.variants.find(v =>
      v.sizeID == this.editSizeId &&
      v.colorID == this.editColorId
    );

    if (newVariant) {
      this.cartService.updateCartItemVariant(this.editingItem, newVariant);
      this.cancelEdit(); // Close edit mode
    } else {
      alert("This combination is not available.");
    }
  }

  // Helper: Filter colors when size changes in the cart
  onEditSizeChange(variants: IProductvarient[]) {
    this.editColorId = null; // Reset color
    this.updateAvailableColorsForEdit(variants);
  }

  updateAvailableColorsForEdit(variants: IProductvarient[]) {
    // Filter variants by the selected Size ID
    const validVariants = variants.filter(v => v.sizeID == this.editSizeId);
    const validColorIds = validVariants.map(v => v.colorID);

    // Filter master colors list
    this.editAvailableColors = this.allColors.filter(c => validColorIds.includes(c.id));
  }
  // Helper to get Size Name (e.g., "Large") from ID
  getSizeName(id: number): string {
    const size = this.allSizes.find(s => s.id === id);
    return size ? size.name : 'Unknown';
  }

  // Helper to get Color Name (e.g., "Red") from ID
  getColorName(id: number): string {
    const color = this.allColors.find(c => c.id === id);
    return color ? color.name : 'Unknown';
  }
  increaseQty(item: ICartItem) {
    // Optional: Check stock limit here using item.variant.stockQuantity
    if (item.quantity < item.variant.stockQuantity) {
      this.cartService.updateQuantity(item, item.quantity + 1);
    } else {
      alert(`Max stock reached! Only ${item.variant.stockQuantity} available.`);
    }
  }

  decreaseQty(item: ICartItem) {
    if (item.quantity > 1) {
      this.cartService.updateQuantity(item, item.quantity - 1);
    }
  }

  removeItem(item: ICartItem) {
    this.cartService.removeFromCart(item);
  } calculateTotal() {
    this.cartSubtotal = this.cartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  }

  goToCheckout() { }

}
