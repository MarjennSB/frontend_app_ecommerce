import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../core/models/category.model';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  categoryService = inject(CategoryService);
  categories = signal<Category[]>([]);

  ngOnInit(): void {
    this.categoryService.getAll().subscribe((res) => {
    this.categories.set(res.categorias.data);
    });
  }
}
