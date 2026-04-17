import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

interface ManageTab {
  label: string;
  link: string;
  icon: string;
}

@Component({
  selector: 'app-management',
  standalone: true,
  imports: [RouterLink, RouterOutlet, RouterLinkActive],
  templateUrl: './management.html',
  styleUrl: './management.css'
})
export class Management {

  @ViewChild('navContainer') navContainer!: ElementRef<HTMLElement>;

  tabs: ManageTab[] = [
    { label: 'Brand', link: 'brand', icon: 'bi bi-gear-fill' },
    { label: 'Products', link: 'products', icon: 'bi bi-box-seam-fill' },
    { label: 'Orders', link: 'orders', icon: 'bi bi-cart-check-fill' },
    { label: 'Discounts', link: 'discounts', icon: 'bi bi-percent' },
    { label: 'Ads ', link: 'ads', icon: 'bi bi-megaphone-fill' },
    { label: 'Employees', link: 'employees', icon: 'bi bi-people-fill' }
  ];

  visibleTabs: ManageTab[] = [];
  overflowTabs: ManageTab[] = [];
  isMoreOpen = false;

  private readonly tabWidths = [130, 145, 130, 170, 145];
  private readonly moreButtonWidth = 120;
  private readonly navGap = 10;
  private readonly navPaddingAllowance = 24;

  ngAfterViewInit(): void {
    queueMicrotask(() => this.calculateTabs());
  }

  @HostListener('window:resize')
  onResize(): void {
    this.calculateTabs();
    this.closeMoreMenu();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.more-menu')) {
      this.closeMoreMenu();
    }
  }

  toggleMoreMenu(): void {
    this.isMoreOpen = !this.isMoreOpen;
  }

  closeMoreMenu(): void {
    this.isMoreOpen = false;
  }

  private calculateTabs(): void {
    if (!this.navContainer?.nativeElement) return;

    const containerWidth = this.navContainer.nativeElement.offsetWidth;
    const availableWidth = containerWidth - this.navPaddingAllowance;

    let usedWidth = 0;
    const visible: ManageTab[] = [];
    const overflow: ManageTab[] = [];

    for (let i = 0; i < this.tabs.length; i++) {
      const currentTabWidth = this.tabWidths[i] + this.navGap;
      const remainingTabs = this.tabs.length - (i + 1);

      const needsMoreButton = remainingTabs > 0;
      const reservedWidth = needsMoreButton ? this.moreButtonWidth : 0;

      if (usedWidth + currentTabWidth + reservedWidth <= availableWidth) {
        visible.push(this.tabs[i]);
        usedWidth += currentTabWidth;
      } else {
        overflow.push(...this.tabs.slice(i));
        break;
      }
    }
    const isMobile = window.innerWidth <= 575.98;

    if (isMobile && visible.length < 2 && this.tabs.length >= 2) {
      visible.splice(0, visible.length, this.tabs[0], this.tabs[1]);
      overflow.splice(0, overflow.length, ...this.tabs.slice(2));
    }

    this.visibleTabs = visible;
    this.overflowTabs = overflow;
  }

}
