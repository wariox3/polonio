import { Route } from '@angular/router';

const routes: Route[] = [
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: 'vehiculo',
    children: [
      {
        path: 'lista',
        loadComponent: () =>
          import('./paginas/administrador/vehiculo/vehiculo-lista/vehiculo-lista.component'),
      },
      {
        path: 'nuevo',
        loadComponent: () =>
          import(
            './paginas/administrador/vehiculo/vehiculo-formulario/vehiculo-formulario.component'
          ),
      },
      {
        path: 'editar/:id',
        loadComponent: () =>
          import('./paginas/administrador/vehiculo/vehiculo-lista/vehiculo-lista.component'),
      },
    ],
  },
  { path: '', redirectTo: 'lista', pathMatch: 'full' },
  { path: '**', redirectTo: 'lista', pathMatch: 'full' },
];

export default routes;
