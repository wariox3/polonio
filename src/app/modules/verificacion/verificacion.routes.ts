import { Routes } from '@angular/router';

export default [
  { path: '', redirectTo: 'verificacion', pathMatch: 'full' },
  {
    path: '',
    loadComponent: () => import('./pages/verificacion-lista/verificacion-lista.component'),
  },
] as Routes;
