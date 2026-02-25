import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { IProduct } from '../models/Product/product.model';
import { AuthService } from '../services/auth-service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Global {
  readonly apiBaseUrl = environment.baseUrl;

  constructor(private location: Location, private authService: AuthService) {}

  /**
   * Constructs a full URL for an image.
   * Handles leading slashes in the path to ensure valid URLs.
   */
  getImageUrl(imageUrl: string | null | undefined): string {
    if (!imageUrl) return 'assets/no-image.png'; // Fallback or placeholder
    if (imageUrl.startsWith('http')) return imageUrl; // Already a full URL
    
    // Ensure one slash between base and path
    const cleanPath = imageUrl.startsWith('/') ? imageUrl.substring(1) : imageUrl;
    return `${this.apiBaseUrl}${cleanPath}`;
  }

  /**
   * Navigates back to the previous location in history.
   */
  goBack(): void {
    this.location.back();
  }

  /**
   * Checks if a user has a specific role.
   */
  hasRole(role: string): boolean {
    return this.authService.hasRole(role);
  }

  /**
   * Checks if a product is sold out (no stock in any variant).
   */
  isSoldOut(product: IProduct): boolean {
    if (!product.variants || product.variants.length === 0) return true;
    return product.variants.every(v => v.stockQuantity <= 0);
  }

  /**
   * Filters a list of products based on category and search term.
   */
  filterProducts(products: IProduct[], categoryId: string, searchTerm: string): IProduct[] {
    let filtered = products;

    // Filter by Category
    if (categoryId && categoryId !== 'all') {
      filtered = filtered.filter(p => p.categoryId == Number(categoryId));
    }

    // Filter by Search Term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(term));
    }

    return filtered;
  }
}