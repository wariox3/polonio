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
        loadComponent: () => import('./paginas/guia-lista/guia-lista.component'),
      },
      {
        path: 'nuevo',
        loadComponent: () => import('./paginas/guia-formulario/guia-formulario.component'),
      },
      {
        path: 'editar/:id',
        loadComponent: () => import('./paginas/guia-formulario/guia-formulario.component'),
      },
      {
        path: 'detalle/:id',
        loadComponent: () => import('./paginas/guia-detalle/guia-detalle.component'),
      },
    ],
  },
  { path: '', redirectTo: 'lista', pathMatch: 'full' },
  { path: '**', redirectTo: 'lista', pathMatch: 'full' },
];

export default routes;
