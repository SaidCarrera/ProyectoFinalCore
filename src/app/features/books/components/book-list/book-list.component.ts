import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { BookService } from '../../../../services/book.service';
import { Book } from '../../../../models/book.model';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    RouterLink
  ],
  template: `
    <div class="book-list-container">
      <h2>Available Books</h2>
      <div class="book-grid">
        <mat-card *ngFor="let book of books" class="book-card">
          <mat-card-header>
            <mat-card-title>{{book.title}}</mat-card-title>
            <mat-card-subtitle>{{book.author}}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="book-info">
              <p><mat-icon>category</mat-icon> {{book.category}}</p>
              <p><mat-icon>attach_money</mat-icon> {{book.price | currency}}</p>
              <p>
                <mat-icon>inventory_2</mat-icon>
                <mat-chip [color]="book.stock > 0 ? 'primary' : 'warn'" selected>
                  {{book.stock > 0 ? book.stock + ' available' : 'Out of stock'}}
                </mat-chip>
              </p>
            </div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" 
                    [routerLink]="['/books', book.id]"
                    [disabled]="book.stock === 0">
              {{book.stock > 0 ? 'Reserve Now' : 'Not Available'}}
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .book-list-container {
      padding: 2rem;
    }

    h2 {
      margin-bottom: 2rem;
      font-size: 2rem;
      color: #333;
    }

    .book-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 2rem;
    }

    .book-card {
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .book-info {
      margin: 1rem 0;
    }

    .book-info p {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    mat-card-actions {
      margin-top: auto;
      padding: 1rem;
    }

    button {
      width: 100%;
    }

    mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      margin-right: 4px;
    }

    @media (max-width: 600px) {
      .book-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class BookListComponent implements OnInit {
  books: Book[] = [];

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.bookService.getBooks().subscribe(books => {
      this.books = books;
    });
  }
}