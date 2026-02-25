import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ICartItem } from '../models/cart.model';
import { IProduct } from '../models/Product/product.model';
import { IProductvarient } from '../models/Product/productVarient.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // 1. Use a private BehaviorSubject to hold state
  private cartSubject = new BehaviorSubject<ICartItem[]>([]);
  
  // 2. Expose it as an Observable for components to listen to
  cart$ = this.cartSubject.asObservable();

  constructor() {
    const stored = localStorage.getItem('cart');
    if (stored) {
      this.cartSubject.next(JSON.parse(stored));
    }
  }

  private saveCart(cartItems: ICartItem[]) {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    this.cartSubject.next(cartItems); // Notify all subscribers
  }

  addToCart(product: IProduct | undefined, selectedVariant: IProductvarient | undefined, quantity: number) {
    if (!product || !selectedVariant) return;

    const currentCart = this.cartSubject.value;

    // FIX: Check both Product ID AND Variant ID
    const existingItem = currentCart.find(x => 
      x.product.id === product.id && x.variant.id === selectedVariant.id
    );

    if (existingItem) {
      // FIX: Add the selected quantity, not just 1
      existingItem.quantity += quantity;
    } else {
      currentCart.push({ product, variant: selectedVariant, quantity });
    }

    this.saveCart(currentCart);
    console.log("Cart Updated:", currentCart);
  }

  // Helper to get items directly
  getCartItems(): ICartItem[] {
    return this.cartSubject.value;
  }
  
  removeFromCart(itemToRemove: ICartItem) {
    const currentCart = this.cartSubject.value.filter(item => item !== itemToRemove);
    this.saveCart(currentCart);
  }
  
  clearCart() {
    this.saveCart([]);
  }

  // In CartService class
updateQuantity(itemToUpdate: ICartItem, newQuantity: number) {
  const currentCart = this.cartSubject.value;
  const foundItem = currentCart.find(x => 
    x.product.id === itemToUpdate.product.id && 
    x.variant.id === itemToUpdate.variant.id
  );

  if (foundItem) {
    foundItem.quantity = newQuantity;
    // Remove item if quantity hits 0
    if (foundItem.quantity <= 0) {
      this.removeFromCart(foundItem);
      return;
    }
  }
  this.saveCart(currentCart);
}
// In CartService
updateCartItemVariant(itemToUpdate: ICartItem, newVariant: IProductvarient) {
  const currentCart = this.cartSubject.value;

  // 1. If the variant hasn't changed, do nothing
  if (itemToUpdate.variant.id === newVariant.id) return;

  // 2. Check if the NEW variant already exists in the cart as a different item
  const existingItemWithNewVariant = currentCart.find(x => 
    x.product.id === itemToUpdate.product.id && 
    x.variant.id === newVariant.id &&
    x !== itemToUpdate // Don't find itself
  );

  if (existingItemWithNewVariant) {
    // MERGE: The user changed this item to a variant that is already in the cart.
    // Add quantities together and remove the old item.
    existingItemWithNewVariant.quantity += itemToUpdate.quantity;
    
    // Remove the old itemToUpdate from the list
    const index = currentCart.indexOf(itemToUpdate);
    if (index > -1) {
      currentCart.splice(index, 1);
    }
  } else {
    // UPDATE: No conflict. Just swap the variant.
    itemToUpdate.variant = newVariant;
  }

  this.saveCart(currentCart);
}
getSubtotal(): number {
  return this.cartSubject.value.reduce((total, item) => {
    const price = item?.product?.price ?? 0;
    const qty = item?.quantity ?? 0;
    return total + (price * qty);
  }, 0);
}
}