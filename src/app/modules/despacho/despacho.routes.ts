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
        loadComponent: () => import('./paginas/despacho-lista/despacho-lista.component'),
      },
      {
        path: 'detalle/:id',
        loadComponent: () => import('./paginas/despacho-detalle/despacho-detalle.component'),
      },
      {
        path: 'nuevo',
        loadComponent: () => import('./paginas/despacho-formulario/despacho-formulario.component'),
      },
      {
        path: 'editar/:id',
        loadComponent: () => import('./paginas/despacho-formulario/despacho-formulario.component'),
      },
    ],
  },
  { path: '', redirectTo: 'lista', pathMatch: 'full' },
];

export default routes;
