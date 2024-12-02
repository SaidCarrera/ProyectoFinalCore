import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

export interface ActivityItem {
  icon: string;
  title: string;
  subtitle: string;
}

@Component({
  selector: 'app-activity-list',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule, MatButtonModule, RouterLink],
  template: `
    <mat-list>
      <mat-list-item *ngFor="let item of items">
        <mat-icon matListItemIcon>{{item.icon}}</mat-icon>
        <div matListItemTitle>{{item.title}}</div>
        <div matListItemLine>{{item.subtitle}}</div>
      </mat-list-item>
    </mat-list>
    <div class="view-all">
      <button mat-button color="primary" [routerLink]="viewAllLink">
        {{viewAllText}}
      </button>
    </div>
  `,
  styles: [`
    .view-all {
      padding: 1rem;
      text-align: center;
    }

    mat-list-item {
      margin-bottom: 0.5rem;
    }
  `]
})
export class ActivityListComponent {
  @Input() items: ActivityItem[] = [];
  @Input() viewAllLink: string = '';
  @Input() viewAllText: string = 'View All';
}