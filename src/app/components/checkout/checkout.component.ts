import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup = this.fb.group({}); // Inicialización directa

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.checkoutForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      paymentMethod: ['creditCard', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.checkoutForm.valid) {
      console.log('Formulario enviado:', this.checkoutForm.value);
    } else {
      this.checkoutForm.markAllAsTouched();
    }
  }
}