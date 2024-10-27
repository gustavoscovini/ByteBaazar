import { Component, OnInit } from '@angular/core';

interface CartItem {
  name: string;
  image: string;
  price: number;
  quantity: number;
}

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  cartItens: CartItem[] = [];
  totalProducts: number = 0;
  TotalWithPixDiscount: number = 0;

  ngOnInit(): void {
    this.loadCartItems();
    this.calculateTotals();
  }

  loadCartItems(): void {
    const storedItems: CartItem[] = JSON.parse(localStorage.getItem('cartItems') || '[]');
    this.cartItens = storedItems.map((item: CartItem) => ({
      ...item,
      image: item.image.startsWith('http') ? item.image : `http://localhost:3000${item.image}`
    }));
  }

  calculateTotals(): void {
    this.totalProducts = this.cartItens.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    this.TotalWithPixDiscount = this.totalProducts * 0.9; // Desconto de 10% no PIX
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
}
