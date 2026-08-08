import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Category } from '../../../core/models/category.model';
import { CategoryService } from '../../../core/services/category.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  categoryService = inject(CategoryService);

  // Aquí guardaremos las categorías del backend
  categories = signal<Category[]>([]);

  ngOnInit(): void {
    // Llamamos al backend al cargar el componente
    this.categoryService.getAll().subscribe((response) => {
      this.categories.set(response.categorias.data);
    });
  }
}
