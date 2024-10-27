import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { DiscountService } from '../services/discount.service';
import { ToastrService } from 'ngx-toastr';

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
    private discountService: DiscountService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadProducts();
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

  addToCart(product: any): void {
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    
    const existingProduct = cartItems.find((item: any) => item.id === product.id);
    
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else { 
      cartItems.push({
        id: product.id,
        name: product.name,
        price: product.priceWithPixDiscount,
        image: product.imageUrl,
        quantity: 1
      });
    }
  
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    this.toastr.success('Produto adicionado ao carrinho!', 'Sucesso');
  }
  applyPixDiscount(): void {
    this.productsWithDiscount = this.products.map(product => ({
      ...product,
      priceWithPixDiscount: this.discountService.TotalWithPixDiscount(product.price)
    }));
  }
}
