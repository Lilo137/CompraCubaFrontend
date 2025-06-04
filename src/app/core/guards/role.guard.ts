// src/app/core/guards/role.guard.ts
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  Router
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRoles: number[] = route.data['roles'];
    const user = this.auth.user;

    if (!user) {
      // No está autenticado, redirigir a login
      this.router.navigate(['/login']);
      return false;
    }

    if (!expectedRoles.includes(user.rolID)) {
      // Rol no permitido, redirigir al home
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
}
