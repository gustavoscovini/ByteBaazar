import { Component } from '@angular/core';

interface CartItem {
  name: string;
  price: number;
  quantity: number;
  image: string;
}

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent {
  cartItens: CartItem[] = [
    {
      name: 'Processador AMD Ryzen 7 5700X3D, 3.6 GHz, (4.1GHz Max Turbo)',
      price: 849.99,
      quantity: 1,
      image: 'https://images.kabum.com.br/produtos/fotos/520369/processador-amd-ryzen-7-5700x3d-3-6-ghz-4-1ghz-max-turbo-cache-4mb-8-nucleos-16-threads-am4-video-integrado-100-100001503wof_1708023990_gg.jpg'
    }
  ];

  get totalProducts(): number {
    return this.cartItens.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  get TotalWithPixDiscount(): number {
    return this.totalProducts * 0.9; // 10% de desconto
  }

  removerItem(index: number): void {
    this.cartItens.splice(index, 1);
  }

  removerTodos(): void {
    this.cartItens = [];
  }

  get valorDescontoPix(): number {
    return this.totalProducts * 0.10; // 10% de desconto no PIX
  }
  
  get totalComDescontoPix(): number {
    return this.totalProducts - this.valorDescontoPix;
  }
}