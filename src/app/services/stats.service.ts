import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from './user.service';
import { BookService } from './book.service';
import { ReservationService } from './reservation.service';
import { PurchaseService } from './purchase.service';

export interface DashboardStats {
  totalUsers: number;
  adminUsers: number;
  regularUsers: number;
  totalBooks: number;
  totalPurchases: number;
  totalReservations: number;
  activeReservations: number;
  lastUpdated: Date;
}

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private statsSubject = new BehaviorSubject<DashboardStats>({
    totalUsers: 0,
    adminUsers: 0,
    regularUsers: 0,
    totalBooks: 0,
    totalPurchases: 0,
    totalReservations: 0,
    activeReservations: 0,
    lastUpdated: new Date()
  });

  constructor(
    private userService: UserService,
    private bookService: BookService,
    private reservationService: ReservationService,
    private purchaseService: PurchaseService
  ) {
    this.initializeStats();
    this.setupSubscriptions();
  }

  private setupSubscriptions(): void {
    // Subscribe to purchase changes
    this.purchaseService.purchases$.subscribe(() => {
      this.updateStats();
    });

    // Subscribe to reservation changes
    this.reservationService.reservations$.subscribe(() => {
      this.updateStats();
    });

    // Subscribe to book changes
    this.bookService.getBooks().subscribe(() => {
      this.updateStats();
    });

    // Subscribe to user changes
    this.userService.getUsers().subscribe(() => {
      this.updateStats();
    });
  }

  private initializeStats(): void {
    this.updateStats();
  }

  private updateStats(): void {
    combineLatest([
      this.userService.getUsers(),
      this.bookService.getBooks(),
      this.reservationService.getAllReservations(),
      this.purchaseService.getAllPurchases()
    ]).subscribe(([users, books, reservations, purchases]) => {
      const stats: DashboardStats = {
        totalUsers: users.length,
        adminUsers: users.filter(user => user.role === 'admin').length,
        regularUsers: users.filter(user => user.role === 'user').length,
        totalBooks: books.length,
        totalPurchases: purchases.length,
        totalReservations: reservations.length,
        activeReservations: reservations.filter(res => res.status === 'active').length,
        lastUpdated: new Date()
      };

      this.statsSubject.next(stats);
    });
  }

  getStats(): Observable<DashboardStats> {
    return this.statsSubject.asObservable();
  }

  refreshStats(): Observable<DashboardStats> {
    this.updateStats();
    return this.statsSubject.asObservable();
  }
}