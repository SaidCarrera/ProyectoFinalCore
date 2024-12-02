import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DashboardStatsComponent } from '../dashboard/stats/dashboard-stats.component';
import { RecentActivitiesComponent } from '../dashboard/activities/recent-activities.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    DashboardStatsComponent,
    RecentActivitiesComponent
  ],
  template: `
    <div class="dashboard-container">
      <header class="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div class="quick-actions">
          <button mat-raised-button color="primary" routerLink="/admin/users">
            <mat-icon>people</mat-icon>
            Manage Users
          </button>
          <button mat-raised-button color="primary" routerLink="/admin/books">
            <mat-icon>library_books</mat-icon>
            Manage Books
          </button>
          <button mat-raised-button color="primary" routerLink="/admin/reservations">
            <mat-icon>book_online</mat-icon>
            Manage Reservations
          </button>
          <button mat-raised-button color="warn" routerLink="/admin/overdue-reports">
            <mat-icon>report_problem</mat-icon>
            Overdue Reports
          </button>
        </div>
      </header>

      <div class="dashboard-content">
        <app-dashboard-stats></app-dashboard-stats>
        <app-recent-activities></app-recent-activities>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    h1 {
      font-size: 2.2rem;
      color: #111827;
      margin: 0;
      font-weight: 600;
    }

    .quick-actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .quick-actions button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0 1.5rem;
      height: 48px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .dashboard-content {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    @media (max-width: 768px) {
      .dashboard-header {
        flex-direction: column;
        align-items: stretch;
      }

      .quick-actions {
        flex-direction: column;
      }

      .quick-actions button {
        width: 100%;
      }
    }
  `]
})
export class AdminDashboardComponent {}