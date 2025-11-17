import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Details } from './details/details';

export const routesConfig: Routes = [
  {
    path: '',
    component: Home,
    title: 'Home page',
  },
  {
    path: 'details/:id',
    component: Details,
    title: 'Home details',
  },
];
