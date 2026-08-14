import { Component, inject, OnInit, AfterViewInit } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-products-layout',
  imports: [SidebarComponent, FormsModule],
  templateUrl: './products-layout.component.html',
})
export class ProductsLayoutComponent implements OnInit, AfterViewInit {
  router = inject(Router);
  route = inject(ActivatedRoute);
  authService = inject(AuthService);

  searchTerm = '';

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const searchTerm = params.get('searchTerm');

      this.searchTerm = searchTerm ?? '';
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      initFlowbite();
    }, 0);
  }

  search() {
    if (this.searchTerm) {
      this.router.navigate([], {
        queryParams: { searchTerm: this.searchTerm },
        queryParamsHandling: 'merge',
      });
    }
  }

  me() {
    this.router.navigate(['/profile']);
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.authService.clearSession();
        this.router.navigate(['/']);
      },
      error: () => {
        // Even if the backend fails, clear local session
        this.authService.clearSession();
        this.router.navigate(['/']);
      }
    });
  }
}
