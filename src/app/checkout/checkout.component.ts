import { environment } from '../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  stripe: any;
  elements: any;
  clientSecret: string | null = null;

  async ngOnInit() {
    this.stripe = await loadStripe(environment.stripePublicKey);
    
    // Obter o clientSecret do backend
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
    });
    const paymentIntentResponse = await response.json();
    this.clientSecret = paymentIntentResponse.clientSecret;
    
    if (this.stripe && this.clientSecret) {
      // Criação do elemento de cartão
      this.elements = this.stripe.elements();
      const card = this.elements.create('card');
      card.mount('#card-element');
    }
  }

  // Função para enviar o pagamento ao Stripe
  async handleSubmit() {
    if (this.stripe && this.clientSecret) {
      const { error, paymentIntent } = await this.stripe.confirmCardPayment(this.clientSecret, {
        payment_method: {
          card: this.elements.getElement('card'),
          billing_details: {
            name: 'Cliente de Teste',
          },
        },
      });

      if (error) {
        console.log(error.message);
      } else if (paymentIntent?.status === 'succeeded') {
        console.log('Pagamento realizado com sucesso!');
      }
    }
  }
}
