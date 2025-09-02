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
        loadComponent: () => import('./pages/rndc-lista/rndc-lista.component'),
      },
    ],
  },
  { path: '', redirectTo: 'lista', pathMatch: 'full' },
];

export default routes;
