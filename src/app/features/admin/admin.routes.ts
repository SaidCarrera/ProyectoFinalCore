import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { UserListComponent } from './components/users/user-list/user-list.component';
import { BookManagementComponent } from './components/book-management/book-management.component';
import { ReservationManagementComponent } from './components/reservation-management/reservation-management.component';
import { OverdueReportComponent } from './components/overdue/overdue-report.component';
import { adminGuard } from '../../guards/auth.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    canActivate: [adminGuard],
    children: [
      { path: '', component: AdminDashboardComponent },
      { path: 'users', component: UserListComponent },
      { path: 'books', component: BookManagementComponent },
      { path: 'reservations', component: ReservationManagementComponent },
      { path: 'overdue-reports', component: OverdueReportComponent }
    ]
  }
];