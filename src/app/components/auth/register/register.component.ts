import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserRole } from '../../../core/models/user.model'; // Asegúrate que esta ruta es correcta

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  UserRole = UserRole; // Para usarlo en el template
  provincias = [
    'Pinar del Rio', 'Artemisa', 'La Habana', 'Mayabeque', 'Matanzas',
    'Cienfuegos', 'Villa Clara', 'Sancti Spiritus', 'Ciego de Avila',
    'Camagüey', 'Las Tunas', 'Granma', 'Holguin', 'Santiago de Cuba',
    'Guantanamo', 'Isla de la Juventud'
  ];

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      provincia: ['', Validators.required],
      role: [UserRole.USER, Validators.required]
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      // Lógica para manejar el envío del formulario
      console.log(this.registerForm.value);
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      this.registerForm.markAllAsTouched();
    }
  }
}