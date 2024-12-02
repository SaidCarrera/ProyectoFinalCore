import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivityListComponent, ActivityItem } from './activity-list.component';
import { ReservationService } from '../../../../../services/reservation.service';
import { PurchaseService } from '../../../../../services/purchase.service';
import { Reservation } from '../../../../../models/reservation.model';
import { Purchase } from '../../../../../models/purchase.model';
import { formatDate } from '../../../../../utils/date.utils';

@Component({
  selector: 'app-recent-activities',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTabsModule,
    ActivityListComponent
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Recent Activities</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <mat-tab-group>
          <mat-tab label="Recent Reservations">
            <app-activity-list
              [items]="reservationItems"
              viewAllLink="/admin/reservations"
              viewAllText="View All Reservations">
            </app-activity-list>
          </mat-tab>

          <mat-tab label="Recent Purchases">
            <app-activity-list
              [items]="purchaseItems"
              viewAllLink="/admin/purchases"
              viewAllText="View All Purchases">
            </app-activity-list>
          </mat-tab>
        </mat-tab-group>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    mat-card {
      margin-bottom: 2rem;
    }

    mat-card-header {
      margin-bottom: 1rem;
    }
  `]
})
export class RecentActivitiesComponent implements OnInit {
  reservationItems: ActivityItem[] = [];
  purchaseItems: ActivityItem[] = [];

  constructor(
    private reservationService: ReservationService,
    private purchaseService: PurchaseService
  ) {}

  ngOnInit(): void {
    this.loadRecentActivities();
  }

  private loadRecentActivities(): void {
    this.reservationService.getAllReservations().subscribe(
      reservations => {
        this.reservationItems = this.createReservationItems(
          reservations
            .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
            .slice(0, 5)
        );
      }
    );

    this.purchaseService.getAllPurchases().subscribe(
      purchases => {
        this.purchaseItems = this.createPurchaseItems(
          purchases
            .sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime())
            .slice(0, 5)
        );
      }
    );
  }

  private createReservationItems(reservations: Reservation[]): ActivityItem[] {
    return reservations.map(reservation => ({
      icon: 'book_online',
      title: reservation.book?.title || 'Unknown Book',
      subtitle: `Reserved by ${reservation.user?.username || 'Unknown User'} - ${formatDate(reservation.startDate)}`
    }));
  }

  private createPurchaseItems(purchases: Purchase[]): ActivityItem[] {
    return purchases.map(purchase => ({
      icon: 'shopping_cart',
      title: purchase.book.title,
      subtitle: `Purchased by ${purchase.user.username} - ${formatDate(purchase.purchaseDate)}`
    }));
  }
}