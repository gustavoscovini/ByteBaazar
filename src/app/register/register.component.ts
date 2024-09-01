import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'; // Importar Router
import { RegisterService } from '../services/register.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  cadastroForm!: FormGroup;

  constructor(private fb: FormBuilder, private registerService: RegisterService, private toastr: ToastrService,
    private router: Router) { }

  ngOnInit(): void {
    this.cadastroForm = this.fb.group({
      nome: ['', Validators.required],
      cpf: ['', [Validators.required, this.cpfValidator]],
      dataNascimento: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required],
      confirmaSenha: ['', Validators.required],
      genero: [''],
      telefone: ['', [Validators.required, this.phoneValidator]],
      ofertas: [false]
    }, { validator: this.passwordMatchValidator });
  }

  onSubmit() {
    if (this.cadastroForm.valid) {
      const formData = this.cadastroForm.value;

      this.registerService.register(formData).subscribe(
        (response: any) => {
          this.toastr.success('Usuário registrado com sucesso!', 'Sucesso');
          this.router.navigate(['/products']);
        },
        (error: any) => {
          this.toastr.error(error.error.message);
        }
      );
    } else {
      console.log('Formulário inválido');
    }
  }

  cpfValidator(control: any) {
    const cpf = control.value;
    if (!cpf) return null;

    let sum = 0;
    let remainder;
    if (cpf.length !== 11 || isNaN(cpf)) return { invalidCpf: true };

    for (let i = 1; i <= 9; i++) sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    remainder = (sum * 10) % 11;

    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return { invalidCpf: true };

    sum = 0;
    for (let i = 1; i <= 10; i++) sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    remainder = (sum * 10) % 11;

    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11))) return { invalidCpf: true };
    return null;
  }

  phoneValidator(control: any) {
    const phone = control.value;
    if (!phone) return null;

    const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    return phoneRegex.test(phone) ? null : { invalidPhone: true };
  }

  passwordMatchValidator(group: FormGroup) {
    const senha = group.get('senha')?.value;
    const confirmaSenha = group.get('confirmaSenha')?.value;

    return senha === confirmaSenha ? null : { mismatch: true };
  }
}
