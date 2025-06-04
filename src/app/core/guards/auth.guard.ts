// src/app/core/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const inversion = !!route.data['inversion']; 
    const isAuth = this.auth.isAuthenticated();

    if (!inversion && !isAuth) {
      // Ruta normal protegida: si no está autenticado, va a login
      this.router.navigate(['/login']);
      return false;
    }

    if (inversion && isAuth) {
      // Ruta invertida: si ya está autenticado, no puede ver login/register → va a home o dashboard
      const user = this.auth.user;
      if (user?.rolID === 2) {
        this.router.navigate(['/mipyme']);
      } else {
        this.router.navigate(['/']);
      }
      return false;
    }

    return true;
  }
}
