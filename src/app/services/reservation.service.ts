import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { Reservation } from '../models/reservation.model';
import { BookService } from './book.service';
import { AuthService } from './auth.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private reservationsSubject = new BehaviorSubject<Reservation[]>([]);
  reservations$ = this.reservationsSubject.asObservable();

  constructor(
    private bookService: BookService,
    private authService: AuthService,
    private userService: UserService
  ) {
    this.initializeDemoData();
  }

  private initializeDemoData(): void {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 15); // 15 days ago

    const demoReservations: Reservation[] = [
      {
        id: '1',
        userId: '1',
        bookId: '1',
        startDate: new Date(pastDate),
        endDate: new Date(pastDate.setDate(pastDate.getDate() + 7)),
        status: 'active',
        user: {
          id: '1',
          username: 'Admin',
          email: 'admin@library.com'
        },
        book: {
          id: '1',
          title: 'The Great Gatsby',
          author: 'F. Scott Fitzgerald'
        },
        createdAt: new Date()
      },
      {
        id: '2',
        userId: '2',
        bookId: '2',
        startDate: new Date(pastDate.setDate(pastDate.getDate() - 20)),
        endDate: new Date(pastDate.setDate(pastDate.getDate() + 7)),
        status: 'active',
        user: {
          id: '2',
          username: 'User',
          email: 'user@library.com'
        },
        book: {
          id: '2',
          title: '1984',
          author: 'George Orwell'
        },
        createdAt: new Date()
      },
      {
        id: '3',
        userId: '2',
        bookId: '3',
        startDate: new Date(pastDate.setDate(pastDate.getDate() - 10)),
        endDate: new Date(pastDate.setDate(pastDate.getDate() + 7)),
        status: 'active',
        user: {
          id: '2',
          username: 'User',
          email: 'user@library.com'
        },
        book: {
          id: '3',
          title: 'To Kill a Mockingbird',
          author: 'Harper Lee'
        },
        createdAt: new Date()
      }
    ];
    this.reservationsSubject.next(demoReservations);
  }

  getAllReservations(): Observable<Reservation[]> {
    return this.reservations$;
  }

  getUserReservations(userId: string): Observable<Reservation[]> {
    return this.reservations$.pipe(
      map(reservations => reservations.filter(r => r.userId === userId))
    );
  }

  createReservation(bookId: string, startDate: Date, endDate: Date): Observable<Reservation> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return throwError(() => new Error('User not authenticated'));
    }

    return this.bookService.getBook(bookId).pipe(
      map(book => {
        if (book.stock <= 0) {
          throw new Error('Book is not available for reservation');
        }

        const reservation: Reservation = {
          id: Date.now().toString(),
          userId: currentUser.id!,
          bookId,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          status: 'active',
          createdAt: new Date(),
          book: {
            id: book.id!,
            title: book.title,
            author: book.author
          },
          user: {
            id: currentUser.id!,
            username: currentUser.username,
            email: currentUser.email
          }
        };

        const currentReservations = this.reservationsSubject.value;
        this.reservationsSubject.next([...currentReservations, reservation]);

        // Update book stock
        this.bookService.updateBook(bookId, { stock: book.stock - 1 }).subscribe();

        return reservation;
      })
    );
  }

  cancelReservation(reservationId: string): Observable<void> {
    const reservations = this.reservationsSubject.value;
    const reservation = reservations.find(r => r.id === reservationId);
    
    if (!reservation) {
      return throwError(() => new Error('Reservation not found'));
    }

    if (reservation.status !== 'active') {
      return throwError(() => new Error('Reservation cannot be cancelled'));
    }

    reservation.status = 'cancelled';
    this.reservationsSubject.next([...reservations]);

    // Update book stock
    this.bookService.getBook(reservation.bookId).subscribe(book => {
      this.bookService.updateBook(reservation.bookId, {
        stock: book.stock + 1
      }).subscribe();
    });

    return of(void 0);
  }

  completeReservation(reservationId: string): Observable<void> {
    const reservations = this.reservationsSubject.value;
    const reservation = reservations.find(r => r.id === reservationId);
    
    if (!reservation) {
      return throwError(() => new Error('Reservation not found'));
    }

    if (reservation.status !== 'active') {
      return throwError(() => new Error('Reservation cannot be completed'));
    }

    reservation.status = 'completed';
    this.reservationsSubject.next([...reservations]);
    return of(void 0);
  }
}