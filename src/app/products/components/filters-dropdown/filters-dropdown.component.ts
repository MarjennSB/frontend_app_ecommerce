import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { Category } from '../../../core/models/category.model';
import { map, Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { CategoryService } from '../../../core/services/category.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { computed } from '@angular/core';

@Component({
  selector: 'app-filters-dropdown',
  imports: [AsyncPipe, RouterLink],
  templateUrl: './filters-dropdown.component.html',
})
export class FiltersDropdownComponent implements OnInit {
  productService = inject(ProductService);
  route = inject(ActivatedRoute);

  minPrice = signal<number>(0);
  maxPrice = signal<number>(3500);
  rating = signal<number>(5);
  category = signal<string | null>(null);

  categoryService = inject(CategoryService);

  categories = toSignal(
    this.categoryService.getAll().pipe(map(res => res.categorias.data)),
    { initialValue: [] as Category[] }
  );

  groupedCategories = computed(() => {
    const cats = this.categories();
    const groups: { letter: string, items: Category[] }[] = [];
    cats.forEach(c => {
      const letter = c.nombre.charAt(0).toUpperCase();
      let group = groups.find(g => g.letter === letter);
      if (!group) {
        group = { letter, items: [] };
        groups.push(group);
      }
      group.items.push(c);
    });
    return groups.sort((a, b) => a.letter.localeCompare(b.letter));
  });

  results!: Observable<number>;

  constructor() {
    effect(() => {
        this.results = this.productService.getAll()
        .pipe(map((res) => res.productos.data.length));
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const { minPrice, maxPrice, rating, category } = params;

      this.minPrice.set(minPrice ? Number(minPrice) : 0);
      this.maxPrice.set(maxPrice ? Number(maxPrice) : 3500);
      this.rating.set(rating ? Number(rating) : 5);
      this.category.set(category ? category : null);
    });
  }

  updateMinPrice(e: Event) {
    const target = e.target as HTMLInputElement;
    this.minPrice.set(parseInt(target.value));
  }

  updateMaxPrice(e: Event) {
    const target = e.target as HTMLInputElement;
    this.maxPrice.set(parseInt(target.value));
  }

  updateRating(rating: number) {
    this.rating.set(rating);
  }

  updateCategory(category: string) {
    this.category.set(category);
  }
}
