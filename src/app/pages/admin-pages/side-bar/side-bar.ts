import {Component, inject} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {NgClass} from '@angular/common';
import {AuthService} from '../../../services/auth-service';

@Component({
  selector: 'app-side-bar',
  imports: [
    RouterLink,
    RouterLinkActive,
    NgClass
  ],
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.css',
})
export class SideBar {
  isCollapsed = false;
  auth= inject(AuthService)
  router = inject(Router)

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
  logout() {
    this.auth.logout().subscribe({
      next: (res) => {
        this.router.navigate(['/login']);
      }
    });

  }
}
