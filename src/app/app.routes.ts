import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Details } from './details/details';
import { LoginForm } from './form/login-form/login-form';
import { SignUpForm } from './form/sign-up-form/sign-up-form';
import { CodePage } from './pages/signUp/code';
import { userProfile } from './pages/signUp/userprofile';

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
  {path:'codeVerification',
    component:CodePage,
    title: 'code verification page'
  },

{path:'userProfile', 
  component: userProfile,
  title:'user profile page'
}
 
];
export default routes;
