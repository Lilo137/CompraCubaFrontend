// src/app/components/layout/header/header.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  public router = inject(Router);   // <-- público
  public auth   = inject(AuthService);

  public logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
