// src/app/product.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  products = [
    { id: 1, rating: 3, imageUrl: "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/inspiron-notebooks/15-3520/media-gallery/notebook-inspiron-15-3520-black-gallery-10.psd?fmt=png-alpha&pscan=auto&scl=1&wid=4535&hei=3009&qlt=100,1&resMode=sharp2&size=4535,3009&chrss=full&imwidth=5000", name: 'Product 1', description: 'Description for product 1', price: 100 },
    { id: 2, rating: 5, imageUrl: "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/inspiron-notebooks/15-3520/media-gallery/notebook-inspiron-15-3520-black-gallery-10.psd?fmt=png-alpha&pscan=auto&scl=1&wid=4535&hei=3009&qlt=100,1&resMode=sharp2&size=4535,3009&chrss=full&imwidth=5000", name: 'Product 2', description: 'Description for product 2', price: 200 },
    { id: 3, rating: 1, imageUrl: "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/inspiron-notebooks/15-3520/media-gallery/notebook-inspiron-15-3520-black-gallery-10.psd?fmt=png-alpha&pscan=auto&scl=1&wid=4535&hei=3009&qlt=100,1&resMode=sharp2&size=4535,3009&chrss=full&imwidth=5000", name: 'Product 3', description: 'Description for product 3', price: 300 },
    { id: 4, rating: 1, imageUrl: "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/inspiron-notebooks/15-3520/media-gallery/notebook-inspiron-15-3520-black-gallery-10.psd?fmt=png-alpha&pscan=auto&scl=1&wid=4535&hei=3009&qlt=100,1&resMode=sharp2&size=4535,3009&chrss=full&imwidth=5000", name: 'Product 3', description: 'Description for product 3', price: 300 },
    { id: 5, rating: 5, imageUrl: "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/inspiron-notebooks/15-3520/media-gallery/notebook-inspiron-15-3520-black-gallery-10.psd?fmt=png-alpha&pscan=auto&scl=1&wid=4535&hei=3009&qlt=100,1&resMode=sharp2&size=4535,3009&chrss=full&imwidth=5000", name: 'Product 2', description: 'Description for product 2', price: 200 },
    { id: 6, rating: 1, imageUrl: "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/inspiron-notebooks/15-3520/media-gallery/notebook-inspiron-15-3520-black-gallery-10.psd?fmt=png-alpha&pscan=auto&scl=1&wid=4535&hei=3009&qlt=100,1&resMode=sharp2&size=4535,3009&chrss=full&imwidth=5000", name: 'Product 3', description: 'Description for product 3', price: 300 },
    { id: 7, rating: 1, imageUrl: "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/inspiron-notebooks/15-3520/media-gallery/notebook-inspiron-15-3520-black-gallery-10.psd?fmt=png-alpha&pscan=auto&scl=1&wid=4535&hei=3009&qlt=100,1&resMode=sharp2&size=4535,3009&chrss=full&imwidth=5000", name: 'Product 3', description: 'Description for product 3', price: 300 }
  ];

  constructor() { }

  getProducts() {
    return this.products;
  }

  getProductById(id: number) {
    return this.products.find(product => product.id === id);
  }
}
