import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, LoginDto } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule    // para routerLink si lo usas
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
  const dto = this.loginForm.value;
  this.authService.login(dto).subscribe({
    next: () => {
      // Tomamos el usuario que ahora AuthService almacenó
      const user = this.authService.user;
      if (!user) {
        // Algo raro: no debería pasar
        this.router.navigate(['/']);
        return;
      }
      if (user.rolID === 2) {
        // Es mipyme → al dashboard administrativo
        this.router.navigate(['/mipyme']);
      } else {
        // Es usuario normal → a home de compra
        this.router.navigate(['/']);
      }
    },
    error: err => console.error('Error en login', err)
  });
}
}
