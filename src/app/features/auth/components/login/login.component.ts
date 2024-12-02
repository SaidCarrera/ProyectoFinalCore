import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatIconModule
  ],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title>Login</mat-card-title>
          <mat-card-subtitle>Sign in to your account</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email" placeholder="Enter your email">
              <mat-error *ngIf="loginForm.get('email')?.hasError('required')">
                Email is required
              </mat-error>
              <mat-error *ngIf="loginForm.get('email')?.hasError('email')">
                Please enter a valid email
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input matInput formControlName="password" 
                     [type]="hidePassword ? 'password' : 'text'" 
                     placeholder="Enter your password">
              <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" 
                      [attr.aria-label]="'Hide password'" 
                      [attr.aria-pressed]="hidePassword"
                      type="button">
                <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
              <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
                Password is required
              </mat-error>
            </mat-form-field>

            <button mat-raised-button color="primary" 
                    type="submit" 
                    [disabled]="loginForm.invalid"
                    class="full-width">
              Login
            </button>

            <div class="register-link">
              Don't have an account? 
              <a mat-button color="primary" routerLink="/auth/register">Register here</a>
            </div>
          </form>

          <div class="demo-credentials">
            <h3>Demo Credentials</h3>
            <div class="credential-box">
              <strong>Admin:</strong> 
              <code>admin&#64;library.com / admin123</code>
            </div>
            <div class="credential-box">
              <strong>User:</strong> 
              <code>user&#64;library.com / user123</code>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #f5f5f5;
    }

    .login-card {
      width: 100%;
      max-width: 400px;
      margin: 2rem;
    }

    .full-width {
      width: 100%;
      margin-bottom: 1rem;
    }

    .register-link {
      margin-top: 1rem;
      text-align: center;
    }

    .demo-credentials {
      margin-top: 2rem;
      padding-top: 1rem;
      border-top: 1px solid #eee;
    }

    .demo-credentials h3 {
      margin-bottom: 1rem;
      color: #666;
    }

    .credential-box {
      background: #f8f9fa;
      padding: 0.5rem;
      border-radius: 4px;
      margin-bottom: 0.5rem;
    }

    code {
      background: #e9ecef;
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
      margin-left: 0.5rem;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe({
        next: (user) => {
          this.snackBar.open('Login successful!', 'Close', { duration: 3000 });
          if (user.role === 'admin') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/books']);
          }
        },
        error: (error) => {
          this.snackBar.open('Login failed: ' + error.message, 'Close', {
            duration: 3000
          });
        }
      });
    }
  }
}