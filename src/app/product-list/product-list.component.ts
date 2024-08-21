// src/app/product-list/product-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { DiscountService } from '../services/discount.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  productsWithDiscount: any[] = [];

  constructor(private router: Router, private productService: ProductService, private discountService:DiscountService) { 

  }

  ngOnInit(): void {
    this.products = this.productService.getProducts();
    this.applyPixDiscount();
    this.products = this.products.map(product => {
      return {
        ...product,
        priceWithPixDiscount: this.discountService.TotalWithPixDiscount(product.price)
      };
    });
  }

  goToProduct(productId: number): void {
    this.router.navigate(['/product', productId]);
  }

  addToCart(produto: any) {
    console.log(`Produto ${produto.name} adicionado ao carrinho!`);
    // Lógica para adicionar o produto ao carrinho
  }

  applyPixDiscount(): void {
    this.productsWithDiscount = this.productService.getProducts().map(product => ({
      ...product,
      priceWithPixDiscount: this.discountService.TotalWithPixDiscount(product.price)
    }));
    console.log(this.productsWithDiscount);
  }

}
