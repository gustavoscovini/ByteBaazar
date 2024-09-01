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

  constructor(
    private router: Router, 
    private productService: ProductService, 
    private discountService: DiscountService
  ) { }

  ngOnInit(): void {
    this.loadProducts();
    console.log(this.loadProducts());
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(
      data => {
        this.products = data;
        this.applyPixDiscount();
      },
      error => {
        console.error('Erro ao carregar produtos:', error);
      }
    );
  }

  goToProduct(productId: number): void {
    this.router.navigate(['/product', productId]);
  }

  addToCart(produto: any): void {
    console.log(`Produto ${produto.name} adicionado ao carrinho!`);
  }

  applyPixDiscount(): void {
    this.productsWithDiscount = this.products.map(product => ({
      ...product,
      priceWithPixDiscount: this.discountService.TotalWithPixDiscount(product.price)
    }));
    console.log(this.productsWithDiscount);
  }
}
