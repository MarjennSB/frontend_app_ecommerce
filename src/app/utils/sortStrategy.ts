import { Injectable } from '@angular/core';
import { Product } from '../core/models/product-model';

interface SortStrategy {
  type: string;
  sort(arr: Product[]): Product[];
}

class MostPopularSortStrategy implements SortStrategy {
  type: string = 'most-popular';

  sort(arr: Product[]): Product[] {
    return arr;
  }
}

class IncreasingPriceSortStrategy implements SortStrategy {
  type: string = 'increasing-price';

  sort(arr: Product[]): Product[] {
    return arr.sort((a, b) => Number(a.precio_venta) - Number(b.precio_venta));
  }
}

class DecreasingPriceSortStrategy implements SortStrategy {
  type: string = 'decreasing-price';

  sort(arr: Product[]): Product[] {
    return arr.sort((a, b) => Number(b.precio_venta) - Number(a.precio_venta));
  }
}

class DiscountSortStrategy implements SortStrategy {
  type: string = 'discount';

  sort(arr: Product[]): Product[] {
    return arr;
    }
  }

  /* private getDiscount(product: Product) {
    return product.previousPrice
      ? (product.previousPrice - product.price) / product.previousPrice
      : 0;
  } */

@Injectable({
  providedIn: 'root',
})
export class SortProductsStrategyFactory {
  private readonly defaultSortStrategy = new MostPopularSortStrategy();
  private readonly sortStrategies: SortStrategy[] = [
    new MostPopularSortStrategy(),
    new IncreasingPriceSortStrategy(),
    new DecreasingPriceSortStrategy(),
    new DiscountSortStrategy(),
  ];

  getStrategy(type: string): SortStrategy {
    const sortStrategy = this.sortStrategies.find(
      (sortStrategy) => sortStrategy.type === type
    );

    return sortStrategy ?? this.defaultSortStrategy;
  }
}
