import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { RegisterComponent } from './components/register/register';
import { LoginComponent } from './components/login/login';
import { DashboardComponent } from './components/dashboard/dashboard';
import { AuthGuard } from './guards/auth-guard';
import { SearchComponent } from './components/search/search';
import { BookDetailsComponent } from './components/book-details/book-details';
import { ChartCreatorComponent } from './components/chart-creator/chart-creator';
import { ChartViewComponent } from './components/chart-view/chart-view';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'search', component: SearchComponent },
  { path: 'book/:id', component: BookDetailsComponent },
  { path: 'chart/:id', component: ChartViewComponent },
  { path: 'create-chart', component: ChartCreatorComponent },
  { path: '**', redirectTo: '' }
];
