import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Purchase } from '../models/purchase.model';
import { AuthService } from './auth.service';
import { BookService } from './book.service';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  private purchasesSubject = new BehaviorSubject<Purchase[]>([]);
  purchases$ = this.purchasesSubject.asObservable();

  constructor(
    private authService: AuthService,
    private bookService: BookService
  ) {}

  getAllPurchases(): Observable<Purchase[]> {
    return this.purchases$;
  }

  getUserPurchases(userId: string): Observable<Purchase[]> {
    return this.purchases$.pipe(
      map(purchases => purchases.filter(p => p.userId === userId))
    );
  }

  createPurchase(bookId: string, quantity: number): Observable<Purchase> {
    return new Observable(subscriber => {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        subscriber.error(new Error('User not authenticated'));
        return;
      }

      this.bookService.getBook(bookId).subscribe({
        next: (book) => {
          if (book.stock < quantity) {
            subscriber.error(new Error('Insufficient stock'));
            return;
          }

          const purchase: Purchase = {
            id: Date.now().toString(),
            userId: currentUser.id!,
            bookId: book.id!,
            quantity,
            totalPrice: book.price * quantity,
            purchaseDate: new Date(),
            status: 'completed',
            user: {
              id: currentUser.id!,
              username: currentUser.username,
              email: currentUser.email
            },
            book: {
              id: book.id!,
              title: book.title,
              author: book.author,
              price: book.price
            }
          };

          // Update book stock
          this.bookService.updateBook(bookId, { 
            stock: book.stock - quantity 
          }).subscribe();

          // Update purchases list
          const currentPurchases = this.purchasesSubject.value;
          this.purchasesSubject.next([...currentPurchases, purchase]);

          subscriber.next(purchase);
          subscriber.complete();
        },
        error: (error) => {
          subscriber.error(error);
        }
      });
    });
  }
}