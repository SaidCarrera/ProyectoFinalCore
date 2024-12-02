import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    MatToolbarModule,
    MatButtonModule
  ],
  template: `
    <div class="app-container">
      <mat-toolbar color="primary">
        <span>Library Management System</span>
        <span class="spacer"></span>
        <ng-container *ngIf="authService.currentUser$ | async as user; else loginButton">
          <button mat-button routerLink="/books">Books</button>
          <button mat-button *ngIf="authService.isAdmin()" routerLink="/admin">Admin</button>
          <button mat-button (click)="logout()">Logout</button>
        </ng-container>
        <ng-template #loginButton>
          <button mat-button routerLink="/auth/login">Login</button>
        </ng-template>
      </mat-toolbar>
      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .spacer {
      flex: 1 1 auto;
    }
    main {
      flex: 1;
      padding: 2rem;
    }
  `]
})
export class AppComponent {
  constructor(public authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}