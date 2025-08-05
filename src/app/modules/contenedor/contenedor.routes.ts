import { Routes } from '@angular/router';

export default [
  { path: '', redirectTo: 'contenedor', pathMatch: 'full' },
  {
    path: '',
    loadComponent: () => import('./pages/contenedor-lista/contenedor-lista.component'),
  },
] as Routes;
