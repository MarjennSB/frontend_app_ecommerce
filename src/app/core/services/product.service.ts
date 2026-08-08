import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { SortProductsStrategyFactory } from '../../utils/sortStrategy';

import { HttpClient } from '@angular/common/http';
import { ProductResponse } from '../models/product-response.model';
import { environment } from '../../../environments/environment.development';
import { Product } from '../models/product-model';

/* interface ProductFilterOptions {
  maxPrice?: number;
  minPrice?: number;
  category?: ProductCategory;
  rating?: number;
  searchTerm?: string;
} */

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  sortProductsStrategyFactory = inject(SortProductsStrategyFactory);

  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/productos`;

  /* getAll(): Observable<Product[]> {
    return of(this.products);
  } */

  getAll(): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(
      `${this.baseUrl}?per_page=15`
    );
  }

  /* getById(id: string): Observable<Product | undefined> {
    const product = this.products.find((product) => product.id === id);
    return of(product);
  } */

  getById(id: string): Observable<Product> {
    return this.http.get<{codigo: number, producto: Product}>(
      `${this.baseUrl}/${id}`
    ).pipe(
      map(response => response.producto)
    );
  }

  /**
   * Filtra la lista de productos según las opciones de filtro proporcionadas.
   *
   * @param {ProductFilterOptions} filters - Las opciones de filtro a aplicar.
   * @param {string} [filters.category] - La categoría por la cual filtrar.
   * @param {number} [filters.minPrice] - El precio mínimo por el cual filtrar.
   * @param {number} [filters.maxPrice] - El precio máximo por el cual filtrar.
   * @param {number} [filters.rating] - La calificación máxima por la cual filtrar.
   * @param {string} [filters.searchTerm] - El término de búsqueda por el cual filtrar, que se compara con el nombre y la descripción del producto.
   * @returns {Observable<Product[]>} Un observable de la lista filtrada de productos.
   */
  /* getByFilters(filters: ProductFilterOptions): Observable<Product[]> {
    const { category, minPrice, maxPrice, rating, searchTerm } = filters;

    const filteredProducts = this.products.filter((product) => {
      let matched = true;

      if (category && product.category !== category) matched = false;
      if (minPrice && product.price < minPrice) matched = false;
      if (maxPrice !== undefined && product.price > maxPrice) matched = false;
      if (rating && product.rating > rating) matched = false;
      if (
        searchTerm &&
        !product.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        matched = false;
      }

      return matched;
    });
    return of(filteredProducts);
  } */

      getByFilters(categoryId?: string): Observable<ProductResponse> {
    console.log('DEBUG (Service): categoryId received is:', categoryId);
    // Si hay categoría, le agregamos el filtro. Si no, solo pedimos la página 15 por defecto.
    const url = categoryId
      ? `${this.baseUrl}?categoria_id=${categoryId}&per_page=15`
      : `${this.baseUrl}?per_page=15`;
    console.log('DEBUG (Service): HTTP GET to URL:', url);
    return this.http.get<ProductResponse>(url);
  }

  /* sortBy(products: Product[], strategy: string): Product[] {
    const sortStrategy = this.sortProductsStrategyFactory.getStrategy(strategy);
    return sortStrategy.sort(products);
  } */
}
