import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css']
})
export class ProductPageComponent implements OnInit {
  product: any;
  priceWithDiscount: string  = '';
  priceInstallment: string  = '';

  constructor(private route: ActivatedRoute, private productService: ProductService) { }

  ngOnInit(): void {
    const productId = Number(this.route.snapshot.paramMap.get('id'));
      this.product = { id: 4, rating: 1, imageUrl: "https://i.zst.com.br/thumbs/12/14/f/1585461727.jpg", name: 'PLACA DE VIDEO MSI GEFORCE RTX 3060 VENTUS 2X OC, 12GB, GDDR6', description: 'A NVIDIA GeForce RTX 3070 é uma placa de vídeo de alta performance, projetada para gamers e criadores que exigem o máximo de seus sistemas. Equipado com a arquitetura Ampere da NVIDIA, a RTX 3070 oferece um desempenho incrível para jogos em 4K e edição de vídeo de alta resolução, com suporte para ray tracing em tempo real e inteligência artificial.', price: 300 }
      if (this.product) {
        // Increase the price by 10%
        const increasedPrice = this.product.price * 1.10;
        this.product.price = this.formatPrice(this.product.price);
        this.priceWithDiscount = this.formatPrice(increasedPrice);
        this.priceInstallment = this.formatPrice(increasedPrice / 10);
      }
    }
  
    formatPrice(price: number): string {
      return price.toFixed(2).replace('.', ',');
    }

      // Verifica se o produto foi encontrado
      // if (!this.product) {
      //   console.error('Produto não encontrado');
      // }
    // } else {
    //   console.error('ID do produto inválido');
    // }

    addToCart() {
      // Implemente a lógica para adicionar o produto ao carrinho
      if (this.product) {
        console.log(`${this.product.name} adicionado ao carrinho!`);
      }
    }
  }


