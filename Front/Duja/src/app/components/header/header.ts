import { ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CartService } from '../../services/cart-service';
import { RouterLink } from '@angular/router';
import { ILoginedUser } from '../../models/Auth/logineduser.model';
import { AuthService } from '../../services/auth-service';
import { IProduct } from '../../models/Product/product.model';
import { ProductService } from '../../services/product-service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit, OnDestroy {
  readonly apiBaseUrl = environment.baseUrl;
  isScrolled: boolean = false;
  isMenuCollapsed = true;
  AllProducts: IProduct[] = [];
  constructor(private productservice: ProductService, private authservice: AuthService, private cartService: CartService , private cdr : ChangeDetectorRef) {}

  private onScroll = () => {
    const nav = document.getElementById('navbar');
    if (!nav) return;

    if (window.scrollY > 20) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 100;
  }
  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.onScroll);
  }
  searchResults: any[] = [];
  searchQuery: string = '';
  isSearchActive: boolean = false; toggleSearch() {
    this.isSearchActive = !this.isSearchActive;

    // Clear data when closing
    if (!this.isSearchActive) {
      this.searchResults = [];
      this.searchQuery = '';
    }
  }
  // 2. The Search Logic
  openSearch() {
    this.loadProducts();
    this.isSearchActive = true;
    this.searchQuery = '';
  }

  // 2. The Filter Logic
  onSearch(event: any) {
    const query = event.target.value.toLowerCase();
    this.searchQuery = query;

    if (query.trim() === '') {
      // If input is empty, show ALL products again
      this.searchResults = [...this.AllProducts];
    } else {
      // Filter based on name (or other fields)
      this.searchResults = this.AllProducts.filter(product =>
        product.name.toLowerCase().includes(query)
      );
    }
  }

  closeSearch() {
    this.isSearchActive = false;
  }
  // Clear search when clicking a result
  clearSearch() {
    this.searchQuery = '';
    this.searchResults = [];
  }
  user !: ILoginedUser | null;
  isLoggedIn = false;
  
  cartCount: number = 0;
  hasRole(role: string): boolean {
    return this.authservice.hasRole(role);
  }
  ngOnInit(): void {
    window.addEventListener('scroll', this.onScroll, { passive: true });
    this.onScroll();

    this.cartService.cart$.subscribe(items => {
      this.cartCount = items.reduce((total, item) => total + item.quantity, 0);
    });
    this.authservice.user$.subscribe(u => {
      this.user = u;
      this.isLoggedIn = !!u;
    });
  }
  loadProducts() {
    this.productservice.getProducts().subscribe({
      next: (data) => {
        this.AllProducts = data;
        this.searchResults = [...this.AllProducts];
        this.cdr.detectChanges();

      }
    })
  }

  logout() {
    this.authservice.logout();
  }
  toggleMenu() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }
}
