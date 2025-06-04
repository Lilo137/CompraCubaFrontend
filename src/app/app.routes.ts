// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { PublicarProductoComponent } from './dashboard/publicar-producto/publicar-producto.component';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { CartComponent } from './components/cart/cart.component';
import { AccountComponent } from './components/account/account.component';
import { MipymeDashboardComponent } from './components/mipyme/mipyme-dashboard.component';
import { MipymePanelComponent } from './components/mipyme/mipyme-panel.component';
import { MipymeProductsComponent } from './components/mipyme/mipyme-products.component';
import { MipymeOrdersComponent } from './components/mipyme/mipyme-orders.component'; // <-- Import nuevo

export const routes: Routes = [
  // **Home de compra** (usuarios y público)
  {
    path: '',
    component: HomeComponent,
    title: 'Inicio',
  },

  // Login / Register (solo si NO estás autenticado)
  {
    path: 'login',
    component: LoginComponent,
    title: 'Iniciar Sesión',
    canActivate: [AuthGuard],
    data: { inversion: true }
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Registrarse',
    canActivate: [AuthGuard],
    data: { inversion: true }
  },

  // Carrito y Cuenta (solo rolID=1)
  {
    path: 'cart',
    component: CartComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [1] },
    title: 'Carrito'
  },
  {
    path: 'account',
    component: AccountComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [1] },
    title: 'Mi Cuenta'
  },

  // Panel MiPyme (solo rolID=2)
  {
    path: 'mipyme',
    component: MipymeDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [2] },
    children: [
      { path: '', redirectTo: 'panel', pathMatch: 'full' },
      {
        path: 'panel',
        component: MipymePanelComponent,
        title: 'Panel Principal'
      },
      {
        path: 'productos',
        component: MipymeProductsComponent,
        title: 'Productos'
      },
      {
        path: 'pedidos',
        component: MipymeOrdersComponent,
        title: 'Pedidos'            // <-- Nueva ruta aquí
      }
    ]
  },

  // Dashboard de publicación (parte de MiPyme)
  {
    path: 'dashboard/publicar-producto',
    component: PublicarProductoComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [2] },
    title: 'Publicar Producto'
  },

  // Comodín: redirigir a home
  { path: '**', redirectTo: '' }
];
