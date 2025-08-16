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
        loadComponent: () => import('./pages/guia-lista/guia-lista.component'),
      },
      {
        path: 'nuevo',
        loadComponent: () => import('./pages/guia-formulario/guia-formulario.component'),
      },
      {
        path: 'editar/:id',
        loadComponent: () => import('./pages/guia-formulario/guia-formulario.component'),
      },
      {
        path: 'detalle/:id',
        loadComponent: () => import('./pages/guia-detalle/guia-detalle.component'),
      },
    ],
  },
  { path: '', redirectTo: 'lista', pathMatch: 'full' },
  { path: '**', redirectTo: 'lista', pathMatch: 'full' },
];

export default routes;
