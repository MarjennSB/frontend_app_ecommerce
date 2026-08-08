import { Product } from './product-model';

export interface ProductResponse {
  productos: {
    data: Product[];
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
