import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Book } from '../../../../models/book.model';

@Component({
  selector: 'app-purchase-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>Purchase Book</h2>
    <mat-dialog-content>
      <form [formGroup]="purchaseForm">
        <div class="book-info">
          <h3>{{data.title}}</h3>
          <p>Price: {{data.price | currency}}</p>
          <p>Available: {{data.stock}} copies</p>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Quantity</mat-label>
          <input matInput type="number" formControlName="quantity" min="1" [max]="data.stock">
          <mat-error *ngIf="purchaseForm.get('quantity')?.hasError('required')">
            Quantity is required
          </mat-error>
          <mat-error *ngIf="purchaseForm.get('quantity')?.hasError('min')">
            Quantity must be at least 1
          </mat-error>
          <mat-error *ngIf="purchaseForm.get('quantity')?.hasError('max')">
            Cannot exceed available stock
          </mat-error>
        </mat-form-field>

        <div class="total-price">
          Total: {{getTotalPrice() | currency}}
        </div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" 
              (click)="onSubmit()"
              [disabled]="purchaseForm.invalid">
        Purchase
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .book-info {
      margin-bottom: 1.5rem;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 4px;
    }

    .book-info h3 {
      margin: 0 0 0.5rem 0;
      color: #2c3e50;
    }

    .book-info p {
      margin: 0.25rem 0;
      color: #666;
    }

    .full-width {
      width: 100%;
      margin-bottom: 1rem;
    }

    .total-price {
      font-size: 1.25rem;
      font-weight: 500;
      text-align: right;
      color: #2c3e50;
      margin-top: 1rem;
    }

    mat-dialog-content {
      min-width: 300px;
      max-width: 400px;
    }
  `]
})
export class PurchaseDialogComponent {
  purchaseForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PurchaseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Book
  ) {
    this.purchaseForm = this.fb.group({
      quantity: [1, [
        Validators.required,
        Validators.min(1),
        Validators.max(this.data.stock)
      ]]
    });
  }

  getTotalPrice(): number {
    const quantity = this.purchaseForm.get('quantity')?.value || 0;
    return quantity * this.data.price;
  }

  onSubmit(): void {
    if (this.purchaseForm.valid) {
      this.dialogRef.close(this.purchaseForm.value.quantity);
    }
  }
}