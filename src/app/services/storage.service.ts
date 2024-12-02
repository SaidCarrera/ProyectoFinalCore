import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Book } from '../models/book.model';
import { Reservation } from '../models/reservation.model';
import { Purchase } from '../models/purchase.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly STORAGE_KEYS = {
    USERS: 'library_users',
    BOOKS: 'library_books',
    RESERVATIONS: 'library_reservations',
    PURCHASES: 'library_purchases',
    AUTH_TOKEN: 'auth_token',
    CURRENT_USER: 'current_user',
    STATS: 'library_stats'
  };

  // Users
  getUsers(): User[] {
    return this.getItem(this.STORAGE_KEYS.USERS, []);
  }

  setUsers(users: User[]): void {
    this.setItem(this.STORAGE_KEYS.USERS, users);
  }

  // Books
  getBooks(): Book[] {
    return this.getItem(this.STORAGE_KEYS.BOOKS, []);
  }

  setBooks(books: Book[]): void {
    this.setItem(this.STORAGE_KEYS.BOOKS, books);
  }

  // Reservations
  getReservations(): Reservation[] {
    return this.getItem(this.STORAGE_KEYS.RESERVATIONS, []);
  }

  setReservations(reservations: Reservation[]): void {
    this.setItem(this.STORAGE_KEYS.RESERVATIONS, reservations);
  }

  // Purchases
  getPurchases(): Purchase[] {
    return this.getItem(this.STORAGE_KEYS.PURCHASES, []);
  }

  setPurchases(purchases: Purchase[]): void {
    this.setItem(this.STORAGE_KEYS.PURCHASES, purchases);
    // Trigger a storage event to notify other components
    window.dispatchEvent(new Event('storage'));
  }

  // Auth
  getAuthToken(): string | null {
    return localStorage.getItem(this.STORAGE_KEYS.AUTH_TOKEN);
  }

  setAuthToken(token: string): void {
    localStorage.setItem(this.STORAGE_KEYS.AUTH_TOKEN, token);
  }

  removeAuthToken(): void {
    localStorage.removeItem(this.STORAGE_KEYS.AUTH_TOKEN);
  }

  getCurrentUser(): User | null {
    return this.getItem(this.STORAGE_KEYS.CURRENT_USER, null);
  }

  setCurrentUser(user: User): void {
    this.setItem(this.STORAGE_KEYS.CURRENT_USER, user);
  }

  removeCurrentUser(): void {
    localStorage.removeItem(this.STORAGE_KEYS.CURRENT_USER);
  }

  // Helper methods
  private getItem<T>(key: string, defaultValue: T): T {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  }

  private setItem(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  clearAll(): void {
    Object.values(this.STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
}