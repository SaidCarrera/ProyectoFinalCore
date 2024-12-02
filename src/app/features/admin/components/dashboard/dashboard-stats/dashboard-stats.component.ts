import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { StatsService } from '../../../../../services/stats.service';

@Component({
  selector: 'app-dashboard-stats',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <div class="stats-grid">
      <mat-card class="stats-card">
        <mat-card-content>
          <div class="stat-icon">
            <mat-icon>people</mat-icon>
          </div>
          <div class="stat-content">
            <h3>Total Users</h3>
            <p class="stat-value">{{stats?.totalUsers || 0}}</p>
            <small>{{stats?.adminUsers || 0}} Admins | {{stats?.regularUsers || 0}} Users</small>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card class="stats-card">
        <mat-card-content>
          <div class="stat-icon">
            <mat-icon>library_books</mat-icon>
          </div>
          <div class="stat-content">
            <h3>Total Books</h3>
            <p class="stat-value">{{stats?.totalBooks || 0}}</p>
            <small>In Library Collection</small>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card class="stats-card">
        <mat-card-content>
          <div class="stat-icon">
            <mat-icon>shopping_cart</mat-icon>
          </div>
          <div class="stat-content">
            <h3>Total Purchases</h3>
            <p class="stat-value">{{stats?.totalPurchases || 0}}</p>
            <small>Books Sold</small>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card class="stats-card">
        <mat-card-content>
          <div class="stat-icon">
            <mat-icon>book_online</mat-icon>
          </div>
          <div class="stat-content">
            <h3>Active Reservations</h3>
            <p class="stat-value">{{stats?.activeReservations || 0}}</p>
            <small>Of {{stats?.totalReservations || 0}} Total</small>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stats-card {
      height: 100%;
    }

    .stats-card mat-card-content {
      display: flex;
      align-items: center;
      padding: 1.5rem;
    }

    .stat-icon {
      background: #f5f5f5;
      border-radius: 50%;
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 1rem;
    }

    .stat-icon mat-icon {
      font-size: 30px;
      width: 30px;
      height: 30px;
      color: #3f51b5;
    }

    .stat-content {
      flex: 1;
    }

    .stat-content h3 {
      margin: 0;
      font-size: 1rem;
      color: #666;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: bold;
      margin: 0.5rem 0;
      color: #333;
    }

    small {
      color: #666;
      font-size: 0.875rem;
    }

    @media (max-width: 600px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardStatsComponent implements OnInit {
  stats: any;

  constructor(private statsService: StatsService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  private loadStats(): void {
    this.statsService.getStats().subscribe(
      stats => this.stats = stats
    );
  }
}