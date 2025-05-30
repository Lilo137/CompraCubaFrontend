import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  private router = inject(Router); // Inyección moderna para standalone

  // Método opcional para navegación programática
  navegarAPublicar() {
    this.router.navigate(['/publicar-producto']);
  }
}