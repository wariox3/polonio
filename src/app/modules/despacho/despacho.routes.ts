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
        loadComponent: () => import('./pages/despacho-lista/despacho-lista.component'),
      },
      {
        path: 'detalle/:id',
        loadComponent: () => import('./pages/despacho-detalle/despacho-detalle.component'),
      },
      {
        path: 'nuevo',
        loadComponent: () => import('./pages/despacho-formulario/despacho-formulario.component'),
      },
      {
        path: 'editar/:id',
        loadComponent: () => import('./pages/despacho-formulario/despacho-formulario.component'),
      },
    ],
  },
  { path: '', redirectTo: 'lista', pathMatch: 'full' },
];

export default routes;
