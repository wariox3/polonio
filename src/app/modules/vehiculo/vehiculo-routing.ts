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
        loadComponent: () => import('./paginas/vehiculo-lista/vehiculo-lista.component'),
      },
      {
        path: 'nuevo',
        loadComponent: () => import('./paginas/vehiculo-formulario/vehiculo-formulario.component'),
      },
      {
        path: 'editar/:id',
        loadComponent: () => import('./paginas/vehiculo-formulario/vehiculo-formulario.component'),
      },
      {
        path: 'detalle',
        loadComponent: () => import('./paginas/vehiculo-detalle/vehiculo-detalle.component'),
      },
    ],
  },
  { path: '', redirectTo: 'lista', pathMatch: 'full' },
  { path: '**', redirectTo: 'lista', pathMatch: 'full' },
];

export default routes;
