import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Details } from './details/details';
import { FormComponent } from './form/form';
import { LoginForm } from './form/login-form/login-form';

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
    path: 'loginform',
    component: LoginForm,
    title: 'Login Form practice',
  },

  { path: 'form', component: FormComponent, title: 'Form Practice' },
];
export default routes;
