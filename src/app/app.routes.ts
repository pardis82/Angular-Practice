import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Details } from './details/details';
import { FormComponent } from './form/form';

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

  {
    path: 'form',
    component: FormComponent,
    title: 'Form practice',
  },
];
export default routes;
