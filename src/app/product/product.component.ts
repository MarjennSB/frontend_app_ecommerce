  import {
  Component,
  ElementRef,
  inject,
  input,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { BaseLayoutComponent } from '../shared/components/base-layout/base-layout.component';
import { ProductService } from '../core/services/product.service';
import { CurrencyPipe } from '@angular/common';
import { Cart } from '../shared/models/cart';
import { initFlowbite } from 'flowbite';
import { Product } from '../core/models/product-model';

@Component({
  selector: 'app-product',
  imports: [BaseLayoutComponent, CurrencyPipe],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent implements OnInit {
  id = input('');

  productService = inject(ProductService);
  product?: Product;

  activeImgSrc = signal('');
  productImg = viewChild<ElementRef>('productImg');

  ngOnInit(): void {
    this.productService.getById(this.id()).subscribe((product) => {
      this.product = product;

      if (product?.imagenes?.length) {
        this.activeImgSrc.set(product.imagenes[0].ruta_imagen);
      }
    });

    initFlowbite();
  }

  addToCart() {
    const cart: Cart =
      JSON.parse(localStorage.getItem('cart') as string) || [];

    const matched = cart.find(
      ({ product }) => product.id === this.product?.id
    );

    if (matched) {
      matched.quantity++;
    } else {
      cart.push({
        product: this.product!,
        quantity: 1,
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
  }

  changeActiveImg(src: string) {
    const productImgElement = this.productImg()?.nativeElement;

    if (productImgElement) {
      productImgElement.classList.toggle('animate-slideOut');

      setTimeout(() => {
        this.activeImgSrc.set(src);
        productImgElement.classList.toggle('animate-slideOut');
        productImgElement.classList.add('animate-slideIn');
      }, 250);
    }
  }
}
