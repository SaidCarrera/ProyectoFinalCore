import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../../../../services/user.service';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';
import { User } from '../../../../../models/user.model';
import { formatDate } from '../../../../../utils/date.utils';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  template: `
    <div class="user-list-container">
      <div class="header">
        <h2>User Management</h2>
        <button mat-raised-button color="primary" (click)="openUserDialog()">
          <mat-icon>add</mat-icon>
          Add User
        </button>
      </div>

      <table mat-table [dataSource]="users" class="mat-elevation-z8">
        <ng-container matColumnDef="username">
          <th mat-header-cell *matHeaderCellDef>Username</th>
          <td mat-cell *matCellDef="let user">{{user.username}}</td>
        </ng-container>

        <ng-container matColumnDef="email">
          <th mat-header-cell *matHeaderCellDef>Email</th>
          <td mat-cell *matCellDef="let user">{{user.email}}</td>
        </ng-container>

        <ng-container matColumnDef="role">
          <th mat-header-cell *matHeaderCellDef>Role</th>
          <td mat-cell *matCellDef="let user">
            <mat-chip [color]="user.role === 'admin' ? 'accent' : 'primary'" selected>
              {{user.role}}
            </mat-chip>
          </td>
        </ng-container>

        <ng-container matColumnDef="createdAt">
          <th mat-header-cell *matHeaderCellDef>Created At</th>
          <td mat-cell *matCellDef="let user">{{formatDate(user.createdAt)}}</td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let user">
            <button mat-icon-button color="primary" (click)="openUserDialog(user)">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="deleteUser(user)">
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </div>
  `,
  styles: [`
    .user-list-container {
      padding: 2rem;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    h2 {
      margin: 0;
      font-size: 2rem;
      color: #333;
    }

    table {
      width: 100%;
    }

    .mat-column-actions {
      width: 120px;
      text-align: center;
    }

    .mat-column-role {
      width: 120px;
    }

    th.mat-header-cell {
      background: #f5f5f5;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.87);
      padding: 16px;
    }

    td.mat-cell {
      padding: 16px;
    }

    mat-chip {
      min-height: 24px;
      font-size: 12px;
    }
  `]
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  displayedColumns = ['username', 'email', 'role', 'createdAt', 'actions'];

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  openUserDialog(user?: User): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '500px',
      data: user || null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (user) {
          this.userService.updateUser(user.id!, result).subscribe({
            next: () => {
              this.loadUsers();
              this.snackBar.open('User updated successfully', 'Close', { duration: 3000 });
            },
            error: (error) => {
              this.snackBar.open('Error updating user: ' + error.message, 'Close', { duration: 3000 });
            }
          });
        } else {
          this.userService.createUser(result).subscribe({
            next: () => {
              this.loadUsers();
              this.snackBar.open('User created successfully', 'Close', { duration: 3000 });
            },
            error: (error) => {
              this.snackBar.open('Error creating user: ' + error.message, 'Close', { duration: 3000 });
            }
          });
        }
      }
    });
  }

  deleteUser(user: User): void {
    if (confirm(`Are you sure you want to delete ${user.username}?`)) {
      this.userService.deleteUser(user.id!).subscribe({
        next: () => {
          this.loadUsers();
          this.snackBar.open('User deleted successfully', 'Close', { duration: 3000 });
        },
        error: (error) => {
          this.snackBar.open('Error deleting user: ' + error.message, 'Close', { duration: 3000 });
        }
      });
    }
  }

  formatDate(date: Date | string | undefined): string {
    return date ? formatDate(date) : '';
  }
}