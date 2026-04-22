import { Routes } from '@angular/router';

import { LoginComponent } from './features/auth/login/login/login';
import { RegisterComponent } from './features/auth/register/register';
import { AuthGuard } from './core/guards/auth-guard';

import { DashboardComponent } from './features/dashboard/dashboard/dashboard/dashboard';
import { AddTransactionComponent } from './features/transactions/add-transaction/add-transaction/add-transaction';
import { TransactionListComponent } from './features/transactions/transaction-list/transaction-list';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'add-transaction',
    component: AddTransactionComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'transactions',
    component: TransactionListComponent,
    canActivate: [AuthGuard]
  },

  { path: '**', redirectTo: 'login' }
];
