import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersSubject = new BehaviorSubject<User[]>([]);
  users$ = this.usersSubject.asObservable();

  constructor(private authService: AuthService) {
    // Initialize with demo users from AuthService
    this.usersSubject.next(this.authService.getDemoUsers());

    // Subscribe to user changes from AuthService
    this.authService.userChanges$.subscribe(() => {
      this.usersSubject.next(this.authService.getDemoUsers());
    });
  }

  getUsers(): Observable<User[]> {
    return this.users$;
  }

  createUser(user: Omit<User, 'id' | 'createdAt'>): Observable<User> {
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    
    const updatedUsers = [...this.usersSubject.value, newUser];
    this.usersSubject.next(updatedUsers);
    this.authService.addUser(newUser);
    
    return new Observable(subscriber => {
      subscriber.next(newUser);
      subscriber.complete();
    });
  }

  updateUser(id: string, userData: Partial<User>): Observable<User> {
    const users = this.usersSubject.value;
    const index = users.findIndex(u => u.id === id);
    
    if (index === -1) {
      throw new Error('User not found');
    }

    const updatedUser = {
      ...users[index],
      ...userData,
      updatedAt: new Date()
    };

    const updatedUsers = [
      ...users.slice(0, index),
      updatedUser,
      ...users.slice(index + 1)
    ];

    this.usersSubject.next(updatedUsers);
    this.authService.updateUser(id, updatedUser);
    
    return new Observable(subscriber => {
      subscriber.next(updatedUser);
      subscriber.complete();
    });
  }

  deleteUser(id: string): Observable<void> {
    const users = this.usersSubject.value;
    const filteredUsers = users.filter(u => u.id !== id);
    
    if (filteredUsers.length === users.length) {
      throw new Error('User not found');
    }

    this.usersSubject.next(filteredUsers);
    this.authService.removeUser(id);
    
    return new Observable(subscriber => {
      subscriber.next();
      subscriber.complete();
    });
  }
}