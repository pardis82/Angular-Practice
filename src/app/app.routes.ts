import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Details } from './details/details';
import { FormComponent } from './form/form';
import { LoginForm } from './form/login-form/login-form';
import { SignUpForm } from './form/sign-up-form/sign-up-form';

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

  {path: 'signUpform',
    component: SignUpForm,
    title: 'Sign Up practice'
  },

  { path: 'form', component: FormComponent, title: 'Form Practice' },
];
export default routes;
