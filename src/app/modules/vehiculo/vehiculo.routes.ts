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
        loadComponent: () => import('./pages/vehiculo-lista/vehiculo-lista.component'),
      },
      {
        path: 'nuevo',
        loadComponent: () => import('./pages/vehiculo-formulario/vehiculo-formulario.component'),
      },
      {
        path: 'editar/:id',
        loadComponent: () => import('./pages/vehiculo-formulario/vehiculo-formulario.component'),
      },
      {
        path: 'detalle/:id',
        loadComponent: () => import('./pages/vehiculo-detalle/vehiculo-detalle.component'),
      },
    ],
  },
  { path: '', redirectTo: 'lista', pathMatch: 'full' },
  { path: '**', redirectTo: 'lista', pathMatch: 'full' },
];

export default routes;
