import { Routes } from '@angular/router';

export default [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/verificacion-lista/verificacion-lista.component'),
      },
      {
        path: 'detalle/:id',
        loadComponent: () => import('./pages/verificacion-detalle/verificacion-detalle.component'),
      },
      { path: '', redirectTo: 'verificacion', pathMatch: 'full' },
      { path: '**', redirectTo: 'verificacion', pathMatch: 'full' },
    ],
  },
] as Routes;
