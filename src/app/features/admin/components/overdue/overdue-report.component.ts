import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { OverdueService } from '../../../../services/overdue.service';
import { OverdueReport, OverdueStats } from '../../../../models/overdue.model';

@Component({
  selector: 'app-overdue-report',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule
  ],
  template: `
    <div class="overdue-container">
      <h2>Overdue Books Report</h2>

      <!-- Date Filter -->
      <mat-card class="filter-card">
        <mat-card-content>
          <form [formGroup]="filterForm" class="filter-form">
            <mat-form-field appearance="outline">
              <mat-label>Start Date</mat-label>
              <input matInput [matDatepicker]="startPicker" formControlName="startDate">
              <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
              <mat-datepicker #startPicker></mat-datepicker>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>End Date</mat-label>
              <input matInput [matDatepicker]="endPicker" formControlName="endDate">
              <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
              <mat-datepicker #endPicker></mat-datepicker>
            </mat-form-field>

            <button mat-raised-button color="primary" (click)="applyFilter()">
              Apply Filter
            </button>
            <button mat-button (click)="resetFilter()">
              Reset
            </button>
          </form>
        </mat-card-content>
      </mat-card>

      <!-- Stats Summary -->
      <div class="stats-grid" *ngIf="stats">
        <mat-card>
          <mat-card-content>
            <div class="stat-content">
              <h3>Total Overdue Books</h3>
              <p class="stat-value">{{stats.totalOverdue}}</p>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-content>
            <div class="stat-content">
              <h3>Total Fines</h3>
              <p class="stat-value">{{stats.totalFines | currency}}</p>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Most Overdue Books -->
      <mat-card class="most-overdue">
        <mat-card-header>
          <mat-card-title>Most Frequently Overdue Books</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="book-list">
            <div *ngFor="let book of stats?.mostOverdueBooks" class="book-item">
              <span class="book-title">{{book.title}}</span>
              <mat-chip>{{book.count}} times</mat-chip>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Overdue Reports Table -->
      <mat-card>
        <mat-card-content>
          <table mat-table [dataSource]="filteredReports" class="mat-elevation-z8">
            <ng-container matColumnDef="bookTitle">
              <th mat-header-cell *matHeaderCellDef>Book</th>
              <td mat-cell *matCellDef="let report">{{report.bookTitle}}</td>
            </ng-container>

            <ng-container matColumnDef="userName">
              <th mat-header-cell *matHeaderCellDef>User</th>
              <td mat-cell *matCellDef="let report">{{report.userName}}</td>
            </ng-container>

            <ng-container matColumnDef="dueDate">
              <th mat-header-cell *matHeaderCellDef>Due Date</th>
              <td mat-cell *matCellDef="let report">{{report.dueDate | date:'medium'}}</td>
            </ng-container>

            <ng-container matColumnDef="daysOverdue">
              <th mat-header-cell *matHeaderCellDef>Days Overdue</th>
              <td mat-cell *matCellDef="let report">{{report.daysOverdue}}</td>
            </ng-container>

            <ng-container matColumnDef="fine">
              <th mat-header-cell *matHeaderCellDef>Fine</th>
              <td mat-cell *matCellDef="let report">{{report.fine | currency}}</td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let report">
                <mat-chip [color]="report.status === 'paid' ? 'accent' : 'warn'" selected>
                  {{report.status}}
                </mat-chip>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .overdue-container {
      padding: 2rem;
    }

    h2 {
      margin-bottom: 2rem;
      font-size: 2rem;
      color: #333;
    }

    .filter-card {
      margin-bottom: 2rem;
    }

    .filter-form {
      display: flex;
      gap: 1rem;
      align-items: center;
      flex-wrap: wrap;
    }

    .filter-form mat-form-field {
      flex: 1;
      min-width: 200px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-content {
      text-align: center;
      padding: 1.5rem;
    }

    .stat-content h3 {
      color: #666;
      font-size: 1.1rem;
      margin-bottom: 0.5rem;
    }

    .stat-value {
      font-size: 2.5rem;
      font-weight: 600;
      color: #2c3e50;
      margin: 0;
    }

    .most-overdue {
      margin-bottom: 2rem;
    }

    .book-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1rem 0;
    }

    .book-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem;
      background: #f8f9fa;
      border-radius: 4px;
    }

    .book-title {
      font-weight: 500;
    }

    table {
      width: 100%;
    }

    .mat-column-status {
      width: 120px;
    }

    th.mat-header-cell {
      font-weight: 600;
      color: rgba(0, 0, 0, 0.87);
      padding: 16px;
    }

    td.mat-cell {
      padding: 16px;
    }

    @media (max-width: 600px) {
      .filter-form {
        flex-direction: column;
      }

      .filter-form mat-form-field {
        width: 100%;
      }
    }
  `]
})
export class OverdueReportComponent implements OnInit {
  overdueReports: OverdueReport[] = [];
  filteredReports: OverdueReport[] = [];
  stats: OverdueStats | null = null;
  filterForm: FormGroup;
  displayedColumns = ['bookTitle', 'userName', 'dueDate', 'daysOverdue', 'fine', 'status'];

  constructor(
    private overdueService: OverdueService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      startDate: [null],
      endDate: [null]
    });
  }

  ngOnInit(): void {
    this.loadReports();
    this.loadStats();
  }

  private loadReports(): void {
    this.overdueService.getOverdueReports().subscribe(reports => {
      this.overdueReports = reports;
      this.filteredReports = reports;
    });
  }

  private loadStats(): void {
    this.overdueService.getOverdueStats().subscribe(stats => {
      this.stats = stats;
    });
  }

  applyFilter(): void {
    const { startDate, endDate } = this.filterForm.value;
    
    if (!startDate && !endDate) {
      this.filteredReports = this.overdueReports;
      return;
    }

    this.filteredReports = this.overdueReports.filter(report => {
      const reportDate = new Date(report.dueDate);
      reportDate.setHours(0, 0, 0, 0);
      
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      
      if (start) start.setHours(0, 0, 0, 0);
      if (end) end.setHours(23, 59, 59, 999);
      
      if (start && end) {
        return reportDate >= start && reportDate <= end;
      } else if (start) {
        return reportDate >= start;
      } else if (end) {
        return reportDate <= end;
      }
      
      return true;
    });
  }

  resetFilter(): void {
    this.filterForm.reset();
    this.filteredReports = this.overdueReports;
  }
}