import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, map } from 'rxjs';
import { OverdueReport, OverdueStats } from '../models/overdue.model';
import { ReservationService } from './reservation.service';
import { BookService } from './book.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class OverdueService {
  private readonly BASE_FINE_PER_DAY = 3;
  private readonly HIGH_DEMAND_FINE_PER_DAY = 5;
  private overdueReportsSubject = new BehaviorSubject<OverdueReport[]>([]);
  
  constructor(
    private reservationService: ReservationService,
    private bookService: BookService,
    private storageService: StorageService
  ) {
    this.initializeOverdueReports();
  }

  private initializeOverdueReports(): void {
    this.reservationService.getAllReservations().subscribe(reservations => {
      // Get the most reserved books
      const bookReservationCounts = new Map<string, number>();
      reservations.forEach(reservation => {
        const count = bookReservationCounts.get(reservation.bookId) || 0;
        bookReservationCounts.set(reservation.bookId, count + 1);
      });

      // Find the most reserved book ID
      let maxReservations = 0;
      let mostReservedBookId = '';
      bookReservationCounts.forEach((count, bookId) => {
        if (count > maxReservations) {
          maxReservations = count;
          mostReservedBookId = bookId;
        }
      });

      const overdueReports: OverdueReport[] = reservations
        .filter(reservation => 
          reservation.status === 'active' && 
          new Date(reservation.endDate) < new Date()
        )
        .map(reservation => {
          const daysOverdue = Math.floor(
            (new Date().getTime() - new Date(reservation.endDate).getTime()) / 
            (1000 * 60 * 60 * 24)
          );

          // Apply higher fine for the most reserved book
          const finePerDay = reservation.bookId === mostReservedBookId ? 
            this.HIGH_DEMAND_FINE_PER_DAY : 
            this.BASE_FINE_PER_DAY;

          return {
            id: `${reservation.id}-${Date.now()}`,
            bookId: reservation.bookId,
            userId: reservation.userId,
            bookTitle: reservation.book?.title || 'Unknown Book',
            userName: reservation.user?.username || 'Unknown User',
            dueDate: new Date(reservation.endDate),
            daysOverdue,
            fine: daysOverdue * finePerDay,
            status: 'pending',
            createdAt: new Date()
          };
        });

      this.overdueReportsSubject.next(overdueReports);
    });
  }

  getOverdueReports(): Observable<OverdueReport[]> {
    return this.overdueReportsSubject.asObservable();
  }

  getOverdueStats(): Observable<OverdueStats> {
    return this.overdueReportsSubject.pipe(
      map(reports => {
        const bookCounts = new Map<string, { title: string; count: number }>();
        
        reports.forEach(report => {
          const current = bookCounts.get(report.bookId) || { 
            title: report.bookTitle, 
            count: 0 
          };
          bookCounts.set(report.bookId, {
            title: report.bookTitle,
            count: current.count + 1
          });
        });

        const mostOverdueBooks = Array.from(bookCounts.entries())
          .map(([bookId, { title, count }]) => ({ bookId, title, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        return {
          totalOverdue: reports.length,
          totalFines: reports.reduce((sum, report) => sum + report.fine, 0),
          mostOverdueBooks
        };
      })
    );
  }

  refreshOverdueReports(): void {
    this.initializeOverdueReports();
  }
}