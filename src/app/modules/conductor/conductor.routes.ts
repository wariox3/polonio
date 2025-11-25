import { Route } from '@angular/router';

const routes: Route[] = [
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: '',
    children: [
      {
        path: 'lista',
        loadComponent: () => import('./pages/conductor-lista/conductor-lista.component'),
      },
      {
        path: 'nuevo',
        loadComponent: () => import('./pages/conductor-formulario/conductor-formulario.component'),
      },
      {
        path: 'editar/:id',
        loadComponent: () => import('./pages/conductor-formulario/conductor-formulario.component'),
      },
      {
        path: 'detalle/:id',
        loadComponent: () => import('./pages/conductor-detalle/conductor-detalle.component'),
      },
    ],
  },
  { path: '', redirectTo: 'lista', pathMatch: 'full' },
  { path: '**', redirectTo: 'lista', pathMatch: 'full' },
];

export default routes;
