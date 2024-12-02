import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { StatsService } from '../../../../services/stats.service';
import { CategoryDistributionChartComponent } from './charts/category-distribution-chart.component';
import { RecentActivitiesComponent } from './activities/recent-activities.component';

@Component({
  selector: 'app-dashboard-stats',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    CategoryDistributionChartComponent,
    RecentActivitiesComponent
  ],
  template: `
    <div class="stats-container">
      <div class="stats-grid">
        <!-- User Statistics -->
        <mat-card class="stats-card">
          <mat-card-content>
            <div class="stat-icon user-icon">
              <mat-icon>people</mat-icon>
            </div>
            <div class="stat-content">
              <h3>Users Overview</h3>
              <p class="stat-value">{{stats?.totalUsers || 0}}</p>
              <div class="stat-details">
                <span class="detail-item">
                  <mat-icon>admin_panel_settings</mat-icon>
                  {{stats?.adminUsers || 0}} Admins
                </span>
                <span class="detail-item">
                  <mat-icon>person</mat-icon>
                  {{stats?.regularUsers || 0}} Users
                </span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Book Statistics -->
        <mat-card class="stats-card">
          <mat-card-content>
            <div class="stat-icon book-icon">
              <mat-icon>library_books</mat-icon>
            </div>
            <div class="stat-content">
              <h3>Library Collection</h3>
              <p class="stat-value">{{stats?.totalBooks || 0}}</p>
              <div class="stat-details">
                <span class="detail-item">Total Books in System</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Purchase Statistics -->
        <mat-card class="stats-card">
          <mat-card-content>
            <div class="stat-icon purchase-icon">
              <mat-icon>shopping_cart</mat-icon>
            </div>
            <div class="stat-content">
              <h3>Purchase Activity</h3>
              <p class="stat-value">{{stats?.totalPurchases || 0}}</p>
              <div class="stat-details">
                <span class="detail-item">Books Sold</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Reservation Statistics -->
        <mat-card class="stats-card">
          <mat-card-content>
            <div class="stat-icon reservation-icon">
              <mat-icon>book_online</mat-icon>
            </div>
            <div class="stat-content">
              <h3>Active Reservations</h3>
              <p class="stat-value">{{stats?.activeReservations || 0}}</p>
              <div class="stat-details">
                <span class="detail-item">
                  Of {{stats?.totalReservations || 0}} Total
                </span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Recent Activities -->
      <app-recent-activities></app-recent-activities>

      <!-- Category Distribution Chart -->
      <app-category-distribution-chart></app-category-distribution-chart>
    </div>
  `,
  styles: [`
    .stats-container {
      margin-bottom: 2rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stats-card {
      height: 100%;
      transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    }

    .stats-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    .stats-card mat-card-content {
      display: flex;
      align-items: center;
      padding: 1.5rem;
    }

    .stat-icon {
      border-radius: 12px;
      width: 64px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 1.5rem;
    }

    .stat-icon mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: white;
    }

    .user-icon {
      background: linear-gradient(135deg, #6366f1, #4f46e5);
    }

    .book-icon {
      background: linear-gradient(135deg, #14b8a6, #0d9488);
    }

    .purchase-icon {
      background: linear-gradient(135deg, #f59e0b, #d97706);
    }

    .reservation-icon {
      background: linear-gradient(135deg, #ec4899, #db2777);
    }

    .stat-content {
      flex: 1;
    }

    .stat-content h3 {
      margin: 0;
      font-size: 1rem;
      color: #6b7280;
      font-weight: 500;
    }

    .stat-value {
      font-size: 2.5rem;
      font-weight: 700;
      margin: 0.5rem 0;
      color: #111827;
    }

    .stat-details {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      color: #6b7280;
      font-size: 0.875rem;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .detail-item mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardStatsComponent implements OnInit {
  stats: any = null;

  constructor(private statsService: StatsService) {}

  ngOnInit(): void {
    this.statsService.getStats().subscribe(stats => {
      this.stats = stats;
    });
  }
}