import { Component, inject, OnInit, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ProductOfferComponent } from '../shared/components/product-offer/product-offer.component';
import { ProductCardComponent } from '../shared/components/product-card/product-card.component';
import { BaseLayoutComponent } from '../shared/components/base-layout/base-layout.component';
import { ProductLoadingComponent } from '../shared/components/product-loading/product-loading.component';

import { Product } from '../core/models/product-model';

import { ProductService } from '../core/services/product.service';
import { CategoryService } from '../core/services/category.service';

import { Category } from '../core/models/category.model';

import { MAX_PRODUCTS_PER_PAGE } from '../utils/pagination';
import { initFlowbite, initCarousels } from 'flowbite';


@Component({
  selector: 'app-home',
  imports: [
    ProductOfferComponent,
    ProductCardComponent,
    BaseLayoutComponent,
    ProductLoadingComponent,
    RouterLink,
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {


  private readonly productService = inject(ProductService);

  private readonly categoryService = inject(CategoryService);



  categories: Category[] = [];

  products: Product[] = [];

  productsOffers: Product[] = [];



  ngOnInit(): void {


    this.loadCategories();



    this.productService.getAll()
  .subscribe((response) => {

    const products = response.productos.data;

    this.products = products.filter(
      (_, index) => index < MAX_PRODUCTS_PER_PAGE
    );

    this.productsOffers = products.filter(
      (p: Product) => p.precio_oferta !== null && p.precio_oferta !== undefined && Number(p.precio_oferta) > 0
    );

    setTimeout(() => {
      initFlowbite();
      initCarousels();
    }, 50);
  });


  }



  private loadCategories(): void {


    this.categoryService.getAll()
      .subscribe(response => {


        this.categories = response.categorias.data;


      });


  }


}
