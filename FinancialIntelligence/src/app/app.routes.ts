import { Routes } from '@angular/router';
import { HomePage } from './pages/home/home.page';

export const routes: Routes = [
  {
    path: '',
    component: HomePage
  },
  // Redirection pour toutes les autres routes non définies
  {
    path: '**',
    component: HomePage
  }
];
