// src/app/components/mipyme/mipyme-dashboard.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-mipyme-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <aside class="sidebar">
        <h2>MiPyme</h2>
        <nav>
          <ul>
            <li routerLinkActive="active">
              <a [routerLink]="['/mipyme/panel']">Panel Principal</a>
            </li>
            <li routerLinkActive="active">
              <a [routerLink]="['/mipyme/productos']">Productos</a>
            </li>
            <li routerLinkActive="active">
              <a [routerLink]="['/mipyme/pedidos']">Pedidos</a>
            </li>
            <li>
              <a (click)="logout()">Cerrar Sesión</a>
            </li>
          </ul>
        </nav>
      </aside>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styleUrls: ['./mipyme-dashboard.component.css']
})
export class MipymeDashboardComponent implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    if (!this.auth.isAuthenticated() || this.auth.user?.rolID !== 2) {
      this.router.navigate(['/login']);
    }
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
