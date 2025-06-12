// src/app/components/auth/register/register.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, RegisterDto } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], 
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  errorMsg: string | null = null;
  UserRole = UserRole;
  provincias = [
    'Pinar del Río', 'Artemisa', 'La Habana', 'Mayabeque', 'Matanzas',
    'Cienfuegos', 'Villa Clara', 'Sancti Spíritus', 'Ciego de Ávila',
    'Camagüey', 'Las Tunas', 'Granma', 'Holguín', 'Santiago de Cuba',
    'Guantánamo', 'Isla de la Juventud'
  ];
  metodosPago: Array<'Enzona' | 'Transfermovil'> = [
    'Enzona',
    'Transfermovil'
  ];

  private roleToIdMap: Record<string, number> = {
    USER: 1,
    MIPYME: 2
  };

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      metodoPago: ['', Validators.required],
      provincia: ['', Validators.required],
      role: [this.UserRole.USER, Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    const fv = this.registerForm.value;
    const dto: RegisterDto = {
      username: fv.username,
      email: fv.email,
      password: fv.password,
      metodoPago: fv.metodoPago,
      provincia: fv.provincia,
      rolID: 1
    };
    this.auth.register(dto).subscribe({
      next: () => this.router.navigate(['/login']),
      error: err => {
        // Si el backend devuelve JSON { statusCode, message }
        if (err.error?.message) {
          this.errorMsg = Array.isArray(err.error.message) 
            ? err.error.message.join(', ') 
            : err.error.message;
        } else {
          this.errorMsg = 'Error desconocido al registrar';
        }
      }
    });
  }
}
