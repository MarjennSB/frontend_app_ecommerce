import { Component, inject } from '@angular/core';
import { ProductsLayoutComponent } from '../../products/components/products-layout/products-layout.component';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ProductsLayoutComponent],
  templateUrl: './profile.component.html',
})
export class ProfileComponent {
  authService = inject(AuthService);
}
