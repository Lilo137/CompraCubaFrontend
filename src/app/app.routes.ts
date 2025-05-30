// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { PublicarProductoComponent } from './dashboard/publicar-producto/publicar-producto.component';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Inicio' },
  { path: 'login', component: LoginComponent, title: 'Iniciar Sesión' },
  { path: 'register', component: RegisterComponent, title: 'Registrarse' },

  // Dashboard protegido
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'publicar-producto',
        component: PublicarProductoComponent,
        title: 'Publicar Producto'
      },
      // aquí puedes añadir /dashboard/mis-productos, etc.
      { path: '', redirectTo: 'publicar-producto', pathMatch: 'full' }
    ]
  },

  // comodín
  { path: '**', redirectTo: '' }
];
