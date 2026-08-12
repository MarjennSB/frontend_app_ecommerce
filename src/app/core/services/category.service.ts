import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Category } from '../models/category.model';
import { CategoryResponse } from '../models/category-response.model';

import { environment } from '../../../environments/environment.development';


@Injectable({
  providedIn: 'root',
})
export class CategoryService {


  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/categorias`;

  getAll(): Observable<CategoryResponse> {
    return this.http.get<CategoryResponse>(
      `${this.baseUrl}?per_page=10`
    );
  }

  getById(id: number): Observable<Category> {
    return this.http.get<Category>(
      `${this.baseUrl}/${id}`
    );
  }
}
