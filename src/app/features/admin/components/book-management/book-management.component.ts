import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BookService } from '../../../../services/book.service';
import { BookDialogComponent } from '../book-dialog/book-dialog.component';
import { Book } from '../../../../models/book.model';

@Component({
  selector: 'app-book-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  template: `
    <div class="book-management-container">
      <h2>Book Management</h2>
      <div class="actions">
        <button mat-raised-button color="primary" (click)="openBookDialog()">
          <mat-icon>add</mat-icon>
          Add Book
        </button>
      </div>
      <mat-table [dataSource]="books" class="mat-elevation-z8">
        <ng-container matColumnDef="title">
          <mat-header-cell *matHeaderCellDef>Title</mat-header-cell>
          <mat-cell *matCellDef="let book">{{book.title}}</mat-cell>
        </ng-container>

        <ng-container matColumnDef="author">
          <mat-header-cell *matHeaderCellDef>Author</mat-header-cell>
          <mat-cell *matCellDef="let book">{{book.author}}</mat-cell>
        </ng-container>

        <ng-container matColumnDef="category">
          <mat-header-cell *matHeaderCellDef>Category</mat-header-cell>
          <mat-cell *matCellDef="let book">{{book.category}}</mat-cell>
        </ng-container>

        <ng-container matColumnDef="price">
          <mat-header-cell *matHeaderCellDef>Price</mat-header-cell>
          <mat-cell *matCellDef="let book">{{book.price | currency}}</mat-cell>
        </ng-container>

        <ng-container matColumnDef="stock">
          <mat-header-cell *matHeaderCellDef>Stock</mat-header-cell>
          <mat-cell *matCellDef="let book">{{book.stock}}</mat-cell>
        </ng-container>

        <ng-container matColumnDef="actions">
          <mat-header-cell *matHeaderCellDef>Actions</mat-header-cell>
          <mat-cell *matCellDef="let book">
            <button mat-icon-button color="primary" (click)="openBookDialog(book)">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="deleteBook(book)">
              <mat-icon>delete</mat-icon>
            </button>
          </mat-cell>
        </ng-container>

        <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
        <mat-row *matRowDef="let row; columns: displayedColumns"></mat-row>
      </mat-table>
    </div>
  `,
  styles: [`
    .book-management-container {
      padding: 2rem;
    }

    .actions {
      margin-bottom: 1rem;
    }

    h2 {
      margin-bottom: 1rem;
      font-size: 2rem;
      color: #333;
    }

    mat-table {
      margin-top: 1rem;
    }

    .mat-column-actions {
      width: 120px;
      text-align: center;
    }

    .mat-column-price,
    .mat-column-stock {
      width: 100px;
    }

    .mat-column-category {
      width: 150px;
    }
  `]
})
export class BookManagementComponent implements OnInit {
  books: Book[] = [];
  displayedColumns = ['title', 'author', 'category', 'price', 'stock', 'actions'];

  constructor(
    private bookService: BookService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.bookService.getBooks().subscribe(books => {
      this.books = books;
    });
  }

  openBookDialog(book?: Book): void {
    const dialogRef = this.dialog.open(BookDialogComponent, {
      width: '500px',
      data: book || null,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (book) {
          this.bookService.updateBook(book.id!, result).subscribe({
            next: () => {
              this.loadBooks();
              this.snackBar.open('Book updated successfully', 'Close', { duration: 3000 });
            },
            error: (error) => {
              this.snackBar.open(error.message || 'Error updating book', 'Close', { duration: 3000 });
            }
          });
        } else {
          this.bookService.createBook(result).subscribe({
            next: () => {
              this.loadBooks();
              this.snackBar.open('Book created successfully', 'Close', { duration: 3000 });
            },
            error: (error) => {
              this.snackBar.open(error.message || 'Error creating book', 'Close', { duration: 3000 });
            }
          });
        }
      }
    });
  }

  deleteBook(book: Book): void {
    if (confirm(`Are you sure you want to delete "${book.title}"?`)) {
      this.bookService.deleteBook(book.id!).subscribe({
        next: () => {
          this.loadBooks();
          this.snackBar.open('Book deleted successfully', 'Close', { duration: 3000 });
        },
        error: (error) => {
          this.snackBar.open(error.message || 'Error deleting book', 'Close', { duration: 3000 });
        }
      });
    }
  }
}