import { Category } from './category.model';

export interface CategoryResponse {

  categorias: {

    data: Category[];

  };

  total: number;

  pagination: {

    total: number;
    current_page: number;
    last_page: number;
    per_page: number;
    total_visible: number;
    itemsPerPage: number;

  };

}
