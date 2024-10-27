import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-crud-list',
  templateUrl: './product-crud-list.component.html',
  styleUrls: ['./product-crud-list.component.css']
})
export class ProductCrudListComponent implements OnInit {
  products: any[] = [];

  constructor(
    private productService: ProductService, 
    private router: Router, 
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(
      (data) => {
        this.products = data;
      },
      (error) => {
        console.error('Erro ao carregar produtos:', error);
      }
    );
  }

  viewProduct(productId: number): void {
    this.router.navigate(['/product', productId]);
  }

  editProduct(productId: number): void {
    this.router.navigate(['/edit-product', productId]);
  }

  deleteProduct(productId: number): void {
    if (confirm('Tem certeza que deseja deletar este produto?')) {
      this.productService.deleteProduct(productId).subscribe(
        () => {
          this.toastr
          this.loadProducts();
        },
        (error) => {
          console.error('Erro ao deletar produto:', error);
        }
      );
    }
  }
}
