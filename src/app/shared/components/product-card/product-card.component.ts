import { Component, input, OnInit } from '@angular/core';
import {
  CurrencyPipe
} from '@angular/common';
import { RouterLink } from '@angular/router';
import { Cart } from '../../models/cart';
import { initTooltips } from 'flowbite';
import { Product } from '../../../core/models/product-model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-card',
  imports: [
    CurrencyPipe,
    RouterLink,
  ],
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent implements OnInit {
  product = input.required<Product>();

  productTooltipId = crypto.randomUUID();

  addToCart() {
    console.log('addToCart method triggered!');
    
    let cart: Cart = [];
    try {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        cart = JSON.parse(storedCart);
      }
    } catch (e) {
      console.warn('Cart localStorage corrupted, resetting cart');
      cart = [];
    }

    // Filtrar elementos corruptos que no tengan producto válido
    cart = cart.filter(item => item && item.product && item.product.id !== undefined);

    const matched = cart.find(
      (item) => item.product.id === this.product().id
    );

    if (matched) {
      matched.quantity++;
    } else {
      cart.push({
        product: this.product(),
        quantity: 1,
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    try {
      Swal.fire({
        toast: true,
        position: 'bottom-end',
        icon: 'success',
        title: '¡Agregado al carrito!',
        text: this.product().nombre,
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true
      });
    } catch(error) {
      console.error('SweetAlert error:', error);
      alert('¡Producto ' + this.product().nombre + ' agregado al carrito! (Fallback native alert)');
    }
  }

  ngOnInit(): void {
    initTooltips();
  }
}
