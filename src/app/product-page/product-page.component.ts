import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { DiscountService } from '../services/discount.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css']
})
export class ProductPageComponent implements OnInit {
  product: any;
  priceWithDiscount: string = '';
  priceInstallment: string = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private discountService: DiscountService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    const productId = Number(this.route.snapshot.paramMap.get('id'));

    this.productService.getProductById(productId).subscribe(
      (data) => {
        this.product = data;

        if (this.product) {
          this.product.imageUrl = 'http://localhost:3000' + this.product.imageUrl;

          const originalPrice = this.product.price;
          const discountedPrice = this.discountService.TotalWithPixDiscount(originalPrice);
          this.product.price = this.discountService.formatPrice(originalPrice);
          this.priceWithDiscount = this.discountService.formatPrice(discountedPrice);
          this.priceInstallment = this.discountService.formatPrice(originalPrice / 10);
        }
      },
      (error) => {
        console.error('Erro ao carregar produto:', error);
      }
    );
  }

  addToCart() {
    if (this.product) {
      const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    
      const existingProduct = cartItems.find((item: any) => item.id === this.product.id);
      
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cartItems.push({
          id: this.product.id,
          name: this.product.name,
          price: this.priceWithDiscount,
          image: this.product.imageUrl,
          quantity: 1
        });
      }
  
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      this.toastr.success('Produto adicionado ao carrinho!', 'Sucesso');
    }
  }
}
