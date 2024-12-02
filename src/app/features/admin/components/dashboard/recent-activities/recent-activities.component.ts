import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { ReservationService } from '../../../../../services/reservation.service';
import { PurchaseService } from '../../../../../services/purchase.service';
import { Reservation } from '../../../../../models/reservation.model';
import { Purchase } from '../../../../../models/purchase.model';

@Component({
  selector: 'app-recent-activities',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTabsModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    RouterLink
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Recent Activities</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <mat-tab-group>
          <mat-tab label="Recent Reservations">
            <mat-list>
              <mat-list-item *ngFor="let reservation of recentReservations">
                <mat-icon matListItemIcon>book_online</mat-icon>
                <div matListItemTitle>
                  {{reservation.book ? reservation.book.title : 'Unknown Book'}}
                </div>
                <div matListItemLine>
                  Reserved by {{reservation.user ? reservation.user.username : 'Unknown User'}} 
                  - {{reservation.startDate | date}}
                </div>
              </mat-list-item>
            </mat-list>
            <div class="view-all">
              <button mat-button color="primary" routerLink="/admin/reservations">
                View All Reservations
              </button>
            </div>
          </mat-tab>

          <mat-tab label="Recent Purchases">
            <mat-list>
              <mat-list-item *ngFor="let purchase of recentPurchases">
                <mat-icon matListItemIcon>shopping_cart</mat-icon>
                <div matListItemTitle>
                  {{purchase.book.title}}
                </div>
                <div matListItemLine>
                  Purchased by {{purchase.user.username}} - {{purchase.purchaseDate | date}}
                </div>
              </mat-list-item>
            </mat-list>
            <div class="view-all">
              <button mat-button color="primary" routerLink="/admin/purchases">
                View All Purchases
              </button>
            </div>
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

    .view-all {
      padding: 1rem;
      text-align: center;
    }

    mat-list-item {
      margin-bottom: 0.5rem;
    }
  `]
})
export class RecentActivitiesComponent implements OnInit {
  recentReservations: Reservation[] = [];
  recentPurchases: Purchase[] = [];

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
        this.recentReservations = reservations
          .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
          .slice(0, 5);
      }
    );

    this.purchaseService.getAllPurchases().subscribe(
      purchases => {
        this.recentPurchases = purchases
          .sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime())
          .slice(0, 5);
      }
    );
  }
}