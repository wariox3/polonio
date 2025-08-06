import { Route } from '@angular/router';

const routes: Route[] = [
  {
    path: '',
    redirectTo: 'lista',
    pathMatch: 'full',
  },
  {
    path: '',
    children: [
      {
        path: 'lista',
        loadComponent: () => import('./paginas/negocio-lista/negocio-lista.component'),
      },
      {
        path: 'detalle/:id',
        loadComponent: () => import('./paginas/negocio-detalle/negocio-detalle.component'),
      },
      {
        path: 'nuevo',
        loadComponent: () => import('./paginas/negocio-formulario/negocio-formulario.component'),
      },
      {
        path: 'editar/:id',
        loadComponent: () => import('./paginas/negocio-formulario/negocio-formulario.component'),
      },
    ],
  },
];

export default routes;
