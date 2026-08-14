import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Category } from '../../../core/models/category.model';
import { CategoryService } from '../../../core/services/category.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  categoryService = inject(CategoryService);
  authService = inject(AuthService);

  categories = signal<Category[]>([]);
  isCategoriesOpen = signal(false);

  ngOnInit(): void {
    this.categoryService.getAll().subscribe((response) => {
      this.categories.set(response.categorias.data);
    });
  }

  toggleCategories(): void {
    this.isCategoriesOpen.update(value => !value);
  }

  closeCategories(): void {
    this.isCategoriesOpen.set(false);
  }
}
