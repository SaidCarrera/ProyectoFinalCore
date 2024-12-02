import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ReservationService } from '../../../../services/reservation.service';
import { Reservation } from '../../../../models/reservation.model';

@Component({
  selector: 'app-reservation-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatSnackBarModule
  ],
  template: `
    <div class="reservation-management-container">
      <h2>Reservation Management</h2>
      <mat-table [dataSource]="reservations" class="mat-elevation-z8">
        <ng-container matColumnDef="user">
          <mat-header-cell *matHeaderCellDef>User</mat-header-cell>
          <mat-cell *matCellDef="let reservation">
            {{reservation.user?.username}}
          </mat-cell>
        </ng-container>

        <ng-container matColumnDef="book">
          <mat-header-cell *matHeaderCellDef>Book</mat-header-cell>
          <mat-cell *matCellDef="let reservation">
            {{reservation.book?.title}}
          </mat-cell>
        </ng-container>

        <ng-container matColumnDef="startDate">
          <mat-header-cell *matHeaderCellDef>Start Date</mat-header-cell>
          <mat-cell *matCellDef="let reservation">
            {{reservation.startDate | date}}
          </mat-cell>
        </ng-container>

        <ng-container matColumnDef="endDate">
          <mat-header-cell *matHeaderCellDef>End Date</mat-header-cell>
          <mat-cell *matCellDef="let reservation">
            {{reservation.endDate | date}}
          </mat-cell>
        </ng-container>

        <ng-container matColumnDef="status">
          <mat-header-cell *matHeaderCellDef>Status</mat-header-cell>
          <mat-cell *matCellDef="let reservation">
            <mat-chip [color]="getStatusColor(reservation.status)" selected>
              {{reservation.status}}
            </mat-chip>
          </mat-cell>
        </ng-container>

        <ng-container matColumnDef="actions">
          <mat-header-cell *matHeaderCellDef>Actions</mat-header-cell>
          <mat-cell *matCellDef="let reservation">
            <button mat-icon-button color="primary" 
                    (click)="completeReservation(reservation)"
                    [disabled]="reservation.status !== 'active'">
              <mat-icon>check_circle</mat-icon>
            </button>
            <button mat-icon-button color="warn" 
                    (click)="cancelReservation(reservation)"
                    [disabled]="reservation.status !== 'active'">
              <mat-icon>cancel</mat-icon>
            </button>
          </mat-cell>
        </ng-container>

        <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
        <mat-row *matRowDef="let row; columns: displayedColumns"></mat-row>
      </mat-table>
    </div>
  `,
  styles: [`
    .reservation-management-container {
      padding: 2rem;
    }

    h2 {
      margin-bottom: 1rem;
      font-size: 2rem;
      color: #333;
    }

    mat-table {
      margin-top: 1rem;
    }

    mat-chip {
      min-height: 24px;
      font-size: 12px;
    }

    .mat-column-actions {
      width: 120px;
      text-align: center;
    }

    .mat-column-status {
      width: 120px;
    }

    mat-header-cell {
      font-weight: 600;
      color: rgba(0, 0, 0, 0.87);
    }
  `]
})
export class ReservationManagementComponent implements OnInit {
  reservations: Reservation[] = [];
  displayedColumns = ['user', 'book', 'startDate', 'endDate', 'status', 'actions'];

  constructor(
    private reservationService: ReservationService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.reservationService.getAllReservations().subscribe(
      reservations => {
        this.reservations = reservations;
      }
    );
  }

  getStatusColor(status: string): 'primary' | 'accent' | 'warn' {
    switch (status) {
      case 'active':
        return 'primary';
      case 'completed':
        return 'accent';
      case 'cancelled':
        return 'warn';
      default:
        return 'primary';
    }
  }

  completeReservation(reservation: Reservation): void {
    if (confirm(`Are you sure you want to complete this reservation?`)) {
      this.reservationService.completeReservation(reservation.id!).subscribe({
        next: () => {
          this.snackBar.open('Reservation completed successfully', 'Close', { duration: 3000 });
          this.loadReservations();
        },
        error: (error) => {
          this.snackBar.open('Error completing reservation: ' + error.message, 'Close', { duration: 3000 });
        }
      });
    }
  }

  cancelReservation(reservation: Reservation): void {
    if (confirm(`Are you sure you want to cancel this reservation?`)) {
      this.reservationService.cancelReservation(reservation.id!).subscribe({
        next: () => {
          this.snackBar.open('Reservation cancelled successfully', 'Close', { duration: 3000 });
          this.loadReservations();
        },
        error: (error) => {
          this.snackBar.open('Error cancelling reservation: ' + error.message, 'Close', { duration: 3000 });
        }
      });
    }
  }
}