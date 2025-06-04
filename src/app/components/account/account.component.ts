// src/app/components/account/account.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UserService, User, UpdateUserDto } from '../../core/services/user.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  userId!: number;
  userData!: User;
  error: string | null = null;

  accountForm!: FormGroup;
  submitting = false;

  // Para desplegar “no encontrado” mientras carga
  loading = true;

  ngOnInit() {
    // Validar autenticación y rol
    if (!this.authService.isAuthenticated() || this.authService.user?.rolID !== 1) {
      this.router.navigate(['/login']);
      return;
    }
    this.userId = this.authService.user!.id;
    this.buildForm();
    this.fetchUser();
  }

  private buildForm() {
    this.accountForm = this.fb.group({
      username: [{ value: '', disabled: true }], // solo lectura
      email: [{ value: '', disabled: true }], // solo lectura
      provincia: ['', Validators.required],
      metodoPago: ['', Validators.required],
      password: ['', [Validators.minLength(6)]],
      confirmPassword: ['']
      // telefono: ['']  // si tienes campo teléfono en tu modelo
    }, {
      validators: this.passwordMatchValidator
    });
  }

  private fetchUser() {
    this.userService.getUser(this.userId).subscribe({
      next: user => {
        this.userData = user;
        this.loading = false;
        // Rellenar form con los datos obtenidos
        this.accountForm.patchValue({
          username: user.username,
          email: user.email,
          provincia: user.provincia || '',
          metodoPago: user.metodoPago,
          password: '',
          confirmPassword: ''
          // telefono: user.telefono || ''
        });
      },
      error: err => {
        console.error('Error al obtener usuario:', err);
        this.error = 'No se pudo cargar la información de la cuenta.';
        this.loading = false;
      }
    });
  }

  private passwordMatchValidator(group: FormGroup) {
    const pwd = group.get('password')?.value;
    const cpwd = group.get('confirmPassword')?.value;
    if (pwd && cpwd && pwd !== cpwd) {
      return { passwordsMismatch: true };
    }
    return null;
  }

  onSubmit() {
    if (this.accountForm.invalid) {
      this.accountForm.markAllAsTouched();
      return;
    }
    const fv = this.accountForm.value;
    const updateDto: UpdateUserDto = {
      provincia: fv.provincia,
      metodoPago: fv.metodoPago,
      password: fv.password ? fv.password : undefined
      // telefono: fv.telefono
    };
    this.submitting = true;
    this.userService.updateUser(this.userId, updateDto).subscribe({
      next: updated => {
        this.submitting = false;
        alert('Tus datos se han actualizado correctamente.');
        // Opcionalmente, actualizar AuthService.user:
        const stored = localStorage.getItem('user');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.id === updated.id) {
            parsed.provincia = updated.provincia;
            parsed.metodoPago = updated.metodoPago;
            localStorage.setItem('user', JSON.stringify(parsed));
            this.authService.setUser(parsed); 
          }
        }
      },
      error: err => {
        console.error('Error al actualizar usuario:', err);
        this.error = 'Hubo un problema al guardar los cambios.';
        this.submitting = false;
      }
    });
  }
}
