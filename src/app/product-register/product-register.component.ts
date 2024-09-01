import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-register',
  templateUrl: './product-register.component.html',
  styleUrls: ['./product-register.component.css']
})
export class RegisterProductComponent implements OnInit {
  productForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.productForm = this.fb.group({
      nome: ['', Validators.required],
      descricao: ['', Validators.required],
      preco: ['', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]],
      quantidade: ['', [Validators.required, Validators.min(1)]],
      categoria: ['', Validators.required],
      imagem: [null]
    });
  }

  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.productForm.patchValue({
        imagem: file
      });
    }
  }

  onSubmit() {
    if (this.productForm.valid) {
      const formData = new FormData();
      Object.keys(this.productForm.controls).forEach(key => {
        const control = this.productForm.get(key);
        if (control && control.value) {
          formData.append(key, control.value);
        }
      });

      const fileInput = document.getElementById('imagem') as HTMLInputElement;
      if (fileInput?.files?.length) {
        formData.append('imagem', fileInput.files[0]); // Adiciona o arquivo ao FormData
      }

      console.log('FormData:', formData.get('imagem')); // Debug para verificar se a imagem está sendo capturada

      this.productService.registerProduct(formData).subscribe(
        response => {
          this.toastr.success('Produto registrado com sucesso!', 'Sucesso');
          this.router.navigate(['/products']);
        },
        error => {
          this.toastr.error(error.error.error || 'Erro ao registrar produto', 'Erro');
        }
      );
    } else {
      console.log('Formulário inválido');
    }
  }
}
