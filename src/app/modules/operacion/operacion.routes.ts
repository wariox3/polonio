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
        loadComponent: () => import('./pages/operacion-lista/operacion-lista.component'),
      },
      {
        path: 'nuevo',
        loadComponent: () => import('./pages/operacion-formulario/operacion-formulario.component'),
      },
      {
        path: 'editar/:id',
        loadComponent: () => import('./pages/operacion-formulario/operacion-formulario.component'),
      },
      {
        path: 'detalle/:id',
        loadComponent: () => import('./pages/operacion-detalle/operacion-detalle.component'),
      },
    ],
  },
  { path: '', redirectTo: 'lista', pathMatch: 'full' },
  { path: '**', redirectTo: 'lista', pathMatch: 'full' },
];

export default routes;
