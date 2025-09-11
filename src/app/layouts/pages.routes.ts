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
    path: 'viaje',
    canActivate: [authGuard, contenedorGuard],
    loadComponent: () => import('./admin-layout/admin-layout.component'),
    children: [
      {
        path: '',
        loadChildren: () => import('../modules/viaje/viaje.routes'),
      },
    ],
  },
  {
    path: 'movimiento',
    canActivate: [authGuard, contenedorGuard],
    loadComponent: () => import('./admin-layout/admin-layout.component'),
    children: [
      {
        path: 'guia',
        loadChildren: () => import('../modules/guia/guia.routes'),
      },
      {
        path: 'negocio',
        loadChildren: () => import('../modules/negocio/negocio.routes'),
      },
      {
        path: 'despacho',
        loadChildren: () => import('../modules/despacho/despacho.routes'),
      },
    ],
  },
  {
    path: 'administracion',
    canActivate: [authGuard, contenedorGuard],
    loadComponent: () => import('./admin-layout/admin-layout.component'),
    children: [
      {
        path: 'vehiculo',
        loadChildren: () => import('../modules/vehiculo/vehiculo.routes'),
      },
      {
        path: 'conductor',
        loadChildren: () => import('../modules/conductor/conductor.routes'),
      },
      {
        path: 'operacion',
        loadChildren: () => import('../modules/operacion/operacion.routes'),
      },
      {
        path: 'ruta',
        loadChildren: () => import('../modules/ruta/ruta.routes'),
      },
    ],
  },
  {
    path: 'utilidad',
    canActivate: [authGuard, contenedorGuard],
    loadComponent: () => import('./admin-layout/admin-layout.component'),
    children: [
      {
        path: 'rndc',
        loadChildren: () => import('../modules/rndc/rndc.routes'),
      },
    ],
  },
  {
    path: 'informe',
    canActivate: [authGuard, contenedorGuard],
    loadComponent: () => import('./admin-layout/admin-layout.component'),
    children: [
      {
        path: 'pendiente_despacho',
        loadComponent: () =>
          import('../modules/guia/pages/guia-pendiente-despacho/guia-pendiente-despacho.component'),
      },
      {
        path: 'pendiente_entrega',
        loadComponent: () =>
          import('../modules/guia/pages/guia-pendiente-entrega/guia-pendiente-entrega.component'),
      },
    ],
  },
  {
    path: 'proceso',
    canActivate: [authGuard, contenedorGuard],
    loadComponent: () => import('./admin-layout/admin-layout.component'),
    children: [
      {
        path: 'entrega_guia',
        loadComponent: () => import('../modules/guia/pages/guia-entregar/guia-entregar.component'),
      },
    ],
  },
] as Routes;
