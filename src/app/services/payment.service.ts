// src/app/payment.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private apiUrl = 'http://localhost:3000/api/payments/create-checkout-session';

  constructor(private http: HttpClient) { }

  createCheckoutSession(cartItems: any[]): Observable<any> {
    return this.http.post(this.apiUrl, { items: cartItems });
  }
}
