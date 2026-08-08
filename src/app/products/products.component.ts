import {
  Component,
  computed,
  effect,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { initFlowbite } from 'flowbite';
import { ProductsLayoutComponent } from './components/products-layout/products-layout.component';
import { FiltersDropdownComponent } from './components/filters-dropdown/filters-dropdown.component';
import { ProductService } from '../core/services/product.service';
import { ProductCardComponent } from '../shared/components/product-card/product-card.component';
import { Router, RouterLink } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { map, switchMap } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { CategoryService } from '../core/services/category.service';
import { Category } from '../core/models/category.model';
import {
  getProductsOfTheCurrentPage,
  getTotalProductPages,
} from '../utils/pagination';
import { ProductLoadingComponent } from '../shared/components/product-loading/product-loading.component';
import { Product } from '../core/models/product-model';

@Component({
  selector: 'app-products',
  imports: [
    ProductsLayoutComponent,
    FiltersDropdownComponent,
    ProductCardComponent,
    RouterLink,
    TitleCasePipe,
    ProductLoadingComponent,
  ],
  templateUrl: './products.component.html',
})
export class ProductsComponent implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);

  private readonly categories = toSignal(
    this.categoryService.getAll().pipe(map(res => res.categorias.data)),
    { initialValue: [] as Category[] }
  );

  currentCategoryName = computed(() => {
    const id = this.queryParams().category;
    if (!id) return null;
    const category = this.categories().find(c => c.id.toString() === id);
    return category ? category.nombre : 'Categoría Desconocida';
  });
  router = inject(Router);

  rating = input<string>();
  minPrice = input<string>();
  maxPrice = input<string>();
  category = input<string>();
  page = input<string>();
  sortBy = input<string>();
  searchTerm = input<string>();

  queryParams = computed(() => ({
    rating: this.rating() ? Number(this.rating()) : 5,
    minPrice: this.minPrice() ? Number(this.minPrice()) : 0,
    maxPrice: this.maxPrice() ? Number(this.maxPrice()) : 3500,
    category: this.category(),
    sortBy: this.sortBy(),
    searchTerm: this.searchTerm(),
    page: this.page() ? parseInt(this.page() as string) : 1,
  }));

  private readonly filteredProducts = toSignal(
    toObservable(this.queryParams).pipe(
      switchMap(params =>
        this.productService.getByFilters(params.category).pipe(
          map(res => res.productos.data)
        )
      )
    ),
    { initialValue: [] as Product[] }
  );

  totalProductPages = computed(() =>
    getTotalProductPages(this.filteredProducts())
  );

  products = computed(() =>
    getProductsOfTheCurrentPage(
      this.filteredProducts(),
      this.queryParams().page
    )
  );

  ngOnInit(): void {
    setTimeout(() => {
      initFlowbite();
    }, 100);
  }

  loadPage(page: number) {
    if (!this.totalProductPages().includes(page)) return;

    this.router.navigate(['/products'], {
      queryParams: { page },
      queryParamsHandling: 'merge',
    });
  }
}
