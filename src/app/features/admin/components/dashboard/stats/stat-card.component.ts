import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { StatCard } from './stats.model';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <mat-card class="stats-card">
      <mat-card-content>
        <div class="stat-icon">
          <mat-icon>{{data.icon}}</mat-icon>
        </div>
        <div class="stat-content">
          <h3>{{data.title}}</h3>
          <p class="stat-value">{{data.value}}</p>
          <small *ngIf="data.subtitle">{{data.subtitle}}</small>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
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
  `]
})
export class StatCardComponent {
  @Input() data!: StatCard;
}