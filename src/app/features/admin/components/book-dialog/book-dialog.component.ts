import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Book, BookCategory } from '../../../../models/book.model';
import { BookService } from '../../../../services/book.service';

@Component({
  selector: 'app-book-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Edit Book' : 'Add Book' }}</h2>
    <form [formGroup]="bookForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Title</mat-label>
          <input matInput formControlName="title" placeholder="Enter title">
          <mat-error *ngIf="bookForm.get('title')?.hasError('required')">
            Title is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Author</mat-label>
          <input matInput formControlName="author" placeholder="Enter author">
          <mat-error *ngIf="bookForm.get('author')?.hasError('required')">
            Author is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Category</mat-label>
          <mat-select formControlName="category">
            <mat-option *ngFor="let category of categories" [value]="category">
              {{category}}
            </mat-option>
          </mat-select>
          <mat-error *ngIf="bookForm.get('category')?.hasError('required')">
            Category is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Publication Year</mat-label>
          <input matInput type="number" formControlName="publicationYear" 
                 placeholder="Enter publication year"
                 min="1800" [max]="currentYear">
          <mat-error *ngIf="bookForm.get('publicationYear')?.hasError('required')">
            Publication year is required
          </mat-error>
          <mat-error *ngIf="bookForm.get('publicationYear')?.hasError('min')">
            Year must be 1800 or later
          </mat-error>
          <mat-error *ngIf="bookForm.get('publicationYear')?.hasError('max')">
            Year cannot be in the future
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>ISBN</mat-label>
          <input matInput formControlName="isbn" placeholder="Enter ISBN">
          <mat-error *ngIf="bookForm.get('isbn')?.hasError('required')">
            ISBN is required
          </mat-error>
          <mat-error *ngIf="bookForm.get('isbn')?.hasError('pattern')">
            Invalid ISBN format
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Price</mat-label>
          <input matInput type="number" formControlName="price" 
                 placeholder="Enter price" min="0" step="0.01">
          <mat-error *ngIf="bookForm.get('price')?.hasError('required')">
            Price is required
          </mat-error>
          <mat-error *ngIf="bookForm.get('price')?.hasError('min')">
            Price must be greater than 0
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Stock</mat-label>
          <input matInput type="number" formControlName="stock" 
                 placeholder="Enter stock" min="0">
          <mat-error *ngIf="bookForm.get('stock')?.hasError('required')">
            Stock is required
          </mat-error>
          <mat-error *ngIf="bookForm.get('stock')?.hasError('min')">
            Stock cannot be negative
          </mat-error>
        </mat-form-field>
      </mat-dialog-content>
      
      <mat-dialog-actions align="end">
        <button mat-button type="button" mat-dialog-close>Cancel</button>
        <button mat-raised-button color="primary" 
                type="submit"
                [disabled]="bookForm.invalid">
          {{ data ? 'Update' : 'Create' }}
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [`
    mat-dialog-content {
      min-width: 400px;
      max-height: 70vh;
      overflow-y: auto;
    }
    .full-width {
      width: 100%;
      margin-bottom: 1rem;
    }
    form {
      display: flex;
      flex-direction: column;
    }
  `]
})
export class BookDialogComponent implements OnInit {
  bookForm: FormGroup;
  categories: BookCategory[];
  currentYear = new Date().getFullYear();

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private dialogRef: MatDialogRef<BookDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Book | null
  ) {
    this.categories = this.bookService.getCategories();
    this.bookForm = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      category: ['', Validators.required],
      publicationYear: [
        this.currentYear,
        [
          Validators.required,
          Validators.min(1800),
          Validators.max(this.currentYear)
        ]
      ],
      isbn: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/)
        ]
      ],
      price: [
        0,
        [Validators.required, Validators.min(0)]
      ],
      stock: [
        0,
        [Validators.required, Validators.min(0)]
      ]
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.bookForm.patchValue(this.data);
    }
    // Marcar todos los campos como touched para activar la validación
    Object.keys(this.bookForm.controls).forEach(key => {
      const control = this.bookForm.get(key);
      control?.markAsTouched();
    });
  }

  onSubmit(): void {
    if (this.bookForm.valid) {
      const bookData = this.bookForm.getRawValue();
      this.dialogRef.close(bookData);
    }
  }
}