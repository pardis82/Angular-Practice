import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Details } from './details/details';

const routes: Routes = [
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
export default routes;
