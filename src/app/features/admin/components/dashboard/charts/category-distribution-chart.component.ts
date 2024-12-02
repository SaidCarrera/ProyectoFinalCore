import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BookService } from '../../../../../services/book.service';
import { Book, BookCategory } from '../../../../../models/book.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-category-distribution-chart',
  standalone: true,
  imports: [CommonModule, MatCardModule, NgChartsModule],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Book Distribution by Category</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <canvas baseChart
          [data]="pieChartData"
          [options]="pieChartOptions"
          [type]="'pie'">
        </canvas>
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

    mat-card-content {
      display: flex;
      justify-content: center;
      min-height: 300px;
    }

    canvas {
      max-width: 100%;
      height: auto !important;
    }
  `]
})
export class CategoryDistributionChartComponent implements OnInit, OnDestroy {
  private subscription: Subscription | null = null;

  pieChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [
        '#4CAF50',
        '#2196F3',
        '#FFC107',
        '#F44336',
        '#9C27B0',
        '#FF9800',
        '#00BCD4',
        '#795548',
        '#607D8B',
        '#E91E63',
        '#3F51B5',
        '#009688',
        '#FFEB3B',
        '#8BC34A',
        '#673AB7'
      ]
    }]
  };

  pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed;
            const total = (context.dataset.data as number[]).reduce((a, b) => a + b, 0);
            const percentage = ((value * 100) / total).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.subscription = this.bookService.getBooks().subscribe(books => {
      this.updateChartData(books);
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private updateChartData(books: Book[]): void {
    const categoryCount = new Map<BookCategory, number>();
    
    // Initialize all categories with 0
    this.bookService.getCategories().forEach(category => {
      categoryCount.set(category, 0);
    });

    // Count books by category
    books.forEach(book => {
      const count = categoryCount.get(book.category) || 0;
      categoryCount.set(book.category, count + 1);
    });

    // Filter out categories with 0 books
    const nonEmptyCategories = Array.from(categoryCount.entries())
      .filter(([_, count]) => count > 0);

    // Update chart data
    this.pieChartData = {
      labels: nonEmptyCategories.map(([category]) => category),
      datasets: [{
        data: nonEmptyCategories.map(([_, count]) => count),
        backgroundColor: this.pieChartData.datasets[0].backgroundColor
      }]
    };
  }
}