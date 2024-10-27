import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {
  productForm!: FormGroup;
  productId!: number;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    
    this.productService.getProductById(this.productId).subscribe(
      product => {
        this.productForm.patchValue({
          nome: product.name,
          descricao: product.description,
          preco: product.price,
          quantidade: product.quantity,
          categoria: product.category
        });
      },
      error => {
        this.toastr.error('Erro ao carregar produto', 'Erro');
      }
    );

    this.productForm = this.fb.group({
      nome: ['', Validators.required],
      descricao: ['', Validators.required],
      preco: ['', [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')]],
      quantidade: ['', [Validators.required, Validators.min(1)]],
      categoria: ['', Validators.required],
      imagem: [null]
    });
  }

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const formData = new FormData();
      Object.keys(this.productForm.controls).forEach(key => {
        const control = this.productForm.get(key);
        if (control && control.value) {
          formData.append(key, control.value);
        }
      });

      if (this.selectedFile) {
        formData.append('imagem', this.selectedFile);
      }

      this.productService.updateProduct(this.productId, formData).subscribe(
        response => {
          this.toastr.success('Produto atualizado com sucesso!', 'Sucesso');
          this.router.navigate(['/product-crud-list']);
        },
        error => {
          this.toastr.error('Erro ao atualizar produto', 'Erro');
        }
      );
    } else {
      this.toastr.error('Formulário inválido', 'Erro');
    }
  }
}
