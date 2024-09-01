import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../services/login.service'; // Serviço de login
import { Router } from '@angular/router'; // Importar Router
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private loginService: LoginService, private toastr: ToastrService,
    private router: Router) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loginService.login(this.loginForm.value).subscribe(
        (response: any) => {
          this.toastr.success('Login bem-sucedido!', 'Sucesso');
          // this.router.navigate(['/products']);
        },
        (error: any) => {
          this.toastr.error('Usuário ou senha inválidos', 'Erro');
        }
      );
    }
  }
}
