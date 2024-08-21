import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DiscountService {

  constructor() { }

  TotalWithPixDiscount(price: number): number {
    const discountRate = 0.10; // 10% de desconto
    return price - (price * discountRate);
  }

  formatPrice(price: number): string {
    return price.toFixed(2).replace('.', ',');
  }
}
