import {Component, HostListener, Inject, inject, PLATFORM_ID} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {isPlatformBrowser, NgClass} from '@angular/common';
import {AuthService} from '../../../services/auth-service';

@Component({
  selector: 'app-side-bar',
  imports: [
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.css',
})
export class SideBar {
  isCollapsed = false;
  isMobileOpen = false;
  auth= inject(AuthService)
  router = inject(Router)
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}
  toggleSidebar() {
    if (isPlatformBrowser(this.platformId) && window.innerWidth <= 768) {
      this.isMobileOpen = !this.isMobileOpen;
    } else {
      this.isCollapsed = !this.isCollapsed;
    }
  }
  closeSidebar(): void {
    this.isMobileOpen = false;
  }
  @HostListener('window:resize')
  onResize(): void {
    if (isPlatformBrowser(this.platformId) && window.innerWidth > 768) {
      this.isMobileOpen = false;
    }
  }
  logout() {
    this.auth.logout()
  }
}
