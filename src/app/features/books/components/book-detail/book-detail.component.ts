import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { BookService } from '../../../../services/book.service';
import { ReservationService } from '../../../../services/reservation.service';
import { PurchaseService } from '../../../../services/purchase.service';
import { Book } from '../../../../models/book.model';
import { PurchaseDialogComponent } from '../purchase-dialog/purchase-dialog.component';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="book-detail-container">
      <div *ngIf="loading" class="loading-spinner">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <mat-card *ngIf="book && !loading">
        <mat-card-header>
          <mat-card-title>{{book.title}}</mat-card-title>
          <mat-card-subtitle>{{book.author}}</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <div class="book-info">
            <p><strong>Category:</strong> {{book.category}}</p>
            <p><strong>Publication Year:</strong> {{book.publicationYear}}</p>
            <p><strong>ISBN:</strong> {{book.isbn}}</p>
            <p><strong>Price:</strong> {{book.price | currency}}</p>
            <p>
              <strong>Availability:</strong>
              <span [class.text-success]="book.stock > 0" 
                    [class.text-danger]="book.stock === 0">
                {{book.stock > 0 ? book.stock + ' copies available' : 'Out of stock'}}
              </span>
            </p>
          </div>

          <div class="action-buttons" *ngIf="book.stock > 0">
            <button mat-raised-button color="primary" (click)="openPurchaseDialog()">
              Purchase Book
            </button>
            <button mat-raised-button color="accent" (click)="showReservationForm = true"
                    *ngIf="!showReservationForm">
              Reserve Book
            </button>
          </div>

          <div class="reservation-form" *ngIf="showReservationForm && book.stock > 0">
            <h3>Reserve this Book</h3>
            <form [formGroup]="reservationForm" (ngSubmit)="onSubmit()">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Start Date</mat-label>
                <input matInput [matDatepicker]="startPicker" 
                       formControlName="startDate"
                       [min]="minDate">
                <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
                <mat-datepicker #startPicker></mat-datepicker>
                <mat-error *ngIf="reservationForm.get('startDate')?.hasError('required')">
                  Start date is required
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>End Date</mat-label>
                <input matInput [matDatepicker]="endPicker" 
                       formControlName="endDate"
                       [min]="reservationForm.get('startDate')?.value || minDate">
                <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
                <mat-datepicker #endPicker></mat-datepicker>
                <mat-error *ngIf="reservationForm.get('endDate')?.hasError('required')">
                  End date is required
                </mat-error>
              </mat-form-field>

              <div class="form-actions">
                <button mat-button type="button" (click)="showReservationForm = false">
                  Cancel
                </button>
                <button mat-raised-button color="primary" 
                        type="submit"
                        [disabled]="reservationForm.invalid || submitting">
                  {{submitting ? 'Reserving...' : 'Reserve Book'}}
                </button>
              </div>
            </form>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .book-detail-container {
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }

    .loading-spinner {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 200px;
    }

    .book-info {
      margin-bottom: 2rem;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .book-info p {
      margin-bottom: 0.5rem;
    }

    .text-success {
      color: #28a745;
    }

    .text-danger {
      color: #dc3545;
    }

    .action-buttons {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .reservation-form {
      margin-top: 2rem;
      padding-top: 1rem;
      border-top: 1px solid #dee2e6;
    }

    .reservation-form h3 {
      margin-bottom: 1rem;
      color: #333;
    }

    .full-width {
      width: 100%;
      margin-bottom: 1rem;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 1rem;
    }

    button[type="submit"] {
      min-width: 120px;
    }
  `]
})
export class BookDetailComponent implements OnInit {
  book: Book | null = null;
  reservationForm: FormGroup;
  loading = true;
  submitting = false;
  showReservationForm = false;
  minDate = new Date();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private bookService: BookService,
    private reservationService: ReservationService,
    private purchaseService: PurchaseService,
    private snackBar: MatSnackBar
  ) {
    this.reservationForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.bookService.getBook(id).subscribe({
        next: (book) => {
          this.book = book;
          this.loading = false;
        },
        error: (error) => {
          this.snackBar.open('Error loading book details', 'Close', { duration: 3000 });
          this.router.navigate(['/books']);
        }
      });
    }
  }

  openPurchaseDialog(): void {
    if (!this.book) return;

    const dialogRef = this.dialog.open(PurchaseDialogComponent, {
      data: this.book,
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(quantity => {
      if (quantity) {
        this.purchaseService.createPurchase(this.book!.id!, quantity).subscribe({
          next: () => {
            this.snackBar.open('Purchase successful!', 'Close', { duration: 3000 });
            this.router.navigate(['/books']);
          },
          error: (error) => {
            this.snackBar.open(error.message || 'Error processing purchase', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  onSubmit(): void {
    if (this.reservationForm.valid && this.book) {
      this.submitting = true;
      const { startDate, endDate } = this.reservationForm.value;

      this.reservationService.createReservation(
        this.book.id!,
        startDate,
        endDate
      ).subscribe({
        next: () => {
          this.snackBar.open('Book reserved successfully!', 'Close', { duration: 3000 });
          this.router.navigate(['/books']);
        },
        error: (error) => {
          this.snackBar.open(error.message || 'Error reserving book', 'Close', { duration: 3000 });
          this.submitting = false;
        }
      });
    }
  }
}