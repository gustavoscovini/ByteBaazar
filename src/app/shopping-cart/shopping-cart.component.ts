import { Component, OnInit } from '@angular/core';
import { DiscountService } from '../services/discount.service';
import { PaymentService } from '../services/payment.service';
import { loadStripe } from '@stripe/stripe-js';
import { environment } from '../../environments/environment';

interface CartItem {
  name: string;
  image: string;
  price: number;
  quantity: number;
}

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css'],
})
export class ShoppingCartComponent implements OnInit {
  cartItens: CartItem[] = [];
  totalProducts: number = 0;
  totalPixDiscount: number = 0;

  constructor(
    public discountService: DiscountService,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    this.loadCartItems();
    this.calculateTotals();
  }

  loadCartItems(): void {
    const storedItems: CartItem[] = JSON.parse(localStorage.getItem('cartItems') || '[]');
    this.cartItens = storedItems.map((item: CartItem) => ({
      ...item,
      image: item.image.startsWith('http') ? item.image : `http://localhost:3000${item.image}`,
    }));
  }

  calculateTotals(): void {
    this.totalProducts = this.cartItens.reduce((sum, item) => sum + (item.price / (1 - 0.10)) * item.quantity, 0);
  
    this.totalPixDiscount = this.cartItens.reduce((sum, item) => {
      const priceWithPixDiscount = this.discountService.TotalWithPixDiscount(item.price);
      return sum + priceWithPixDiscount * item.quantity;
    }, 0);
  }

  removerItem(index: number): void {
    this.cartItens.splice(index, 1);
    localStorage.setItem('cartItems', JSON.stringify(this.cartItens));
    this.calculateTotals();
  }

  removerTodos(): void {
    this.cartItens = [];
    localStorage.removeItem('cartItems');
    this.calculateTotals();
  }

  async checkout(): Promise<void> {
    try {
      const response = await this.paymentService.createCheckoutSession(this.cartItens).toPromise();
      const sessionId = response.id;

      const stripe = await loadStripe(environment.stripePublicKey);
      stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error('Erro ao criar a sessão de pagamento:', error);
    }
  }
}
