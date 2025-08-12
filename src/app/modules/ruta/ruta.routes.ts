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
        loadComponent: () => import('../ruta/paginas/ruta-lista/ruta-lista.component'),
      },
      {
        path: 'nuevo',
        loadComponent: () => import('../ruta/paginas/ruta-formulario/ruta-formulario.component'),
      },
      {
        path: 'editar/:id',
        loadComponent: () => import('../ruta/paginas/ruta-formulario/ruta-formulario.component'),
      },
      {
        path: 'detalle/:id',
        loadComponent: () => import('../ruta/paginas/ruta-detalle/ruta-detalle.component'),
      },
    ],
  },
  { path: '', redirectTo: 'lista', pathMatch: 'full' },
  { path: '**', redirectTo: 'lista', pathMatch: 'full' },
];

export default routes;
