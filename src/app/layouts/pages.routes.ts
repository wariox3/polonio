import { Routes } from '@angular/router';
import { authGuard } from '@app/common/guards/auth.guard';
import { contenedorGuard } from '@app/common/guards/contenedor.guard';

export default [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'contenedor',
    canActivate: [authGuard],
    loadComponent: () => import('./simple-layout/simple-layout.component'),
    children: [
      {
        path: '',
        loadChildren: () => import('../modules/contenedor/contenedor.routes'),
      },
    ],
  },
  {
    path: 'dashboard',
    canActivate: [authGuard, contenedorGuard],
    loadComponent: () => import('./admin-layout/admin-layout.component'),
    children: [
      {
        path: '',
        loadChildren: () => import('../modules/home/pages/dashboard/dashboard.routes'),
      },
    ],
  },
  {
    path: 'administracion',
    canActivate: [authGuard, contenedorGuard],
    loadComponent: () => import('./admin-layout/admin-layout.component'),
    children: [
      {
        path: 'vehuculo',
        loadChildren: () => import('../modules/administrador/administrador-routing'),
      },
      {
        path: 'conductor',
        loadChildren: () => import('../modules/administrador/administrador-routing'),
      },
    ],
  },
] as Routes;
