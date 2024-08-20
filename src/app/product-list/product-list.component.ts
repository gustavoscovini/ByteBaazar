// src/app/product-list/product-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: any[] = [];

  constructor(private router: Router, private productService: ProductService) { }

  ngOnInit(): void {
    this.products = this.productService.getProducts();
  }

  goToProduct(productId: number): void {
    this.router.navigate(['/product', productId]);
  }
}
