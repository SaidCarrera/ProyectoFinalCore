import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of, throwError, Subject } from 'rxjs';
import { User } from '../models/user.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  private userChangesSubject = new Subject<void>();
  
  currentUser$: Observable<User | null>;
  userChanges$ = this.userChangesSubject.asObservable();

  private readonly demoUsers: User[] = [
    {
      id: '1',
      username: 'Admin',
      email: 'admin@library.com',
      password: 'admin123',
      role: 'admin',
      createdAt: new Date()
    },
    {
      id: '2',
      username: 'User',
      email: 'user@library.com',
      password: 'user123',
      role: 'user',
      createdAt: new Date()
    }
  ];

  constructor(private storageService: StorageService) {
    // Initialize demo users if none exist
    const existingUsers = this.storageService.getUsers();
    if (existingUsers.length === 0) {
      this.storageService.setUsers(this.demoUsers);
    }

    this.currentUserSubject = new BehaviorSubject<User | null>(
      this.storageService.getCurrentUser()
    );
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  getDemoUsers(): User[] {
    return this.storageService.getUsers();
  }

  getToken(): string | null {
    return this.storageService.getAuthToken();
  }

  addUser(user: User): void {
    const users = this.storageService.getUsers();
    this.storageService.setUsers([...users, user]);
    this.userChangesSubject.next();
  }

  updateUser(id: string, updatedUser: User): void {
    const users = this.storageService.getUsers();
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updatedUser };
      this.storageService.setUsers(users);
      this.userChangesSubject.next();
    }
  }

  removeUser(id: string): void {
    const users = this.storageService.getUsers();
    const filteredUsers = users.filter(u => u.id !== id);
    this.storageService.setUsers(filteredUsers);
    this.userChangesSubject.next();
  }

  login(email: string, password: string): Observable<User> {
    const users = this.storageService.getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      this.storageService.setCurrentUser(userWithoutPassword as User);
      this.storageService.setAuthToken(user.id!);
      this.currentUserSubject.next(userWithoutPassword as User);
      return of(userWithoutPassword as User);
    }

    return throwError(() => new Error('Invalid email or password'));
  }

  register(username: string, email: string, password: string): Observable<User> {
    const users = this.storageService.getUsers();
    
    if (users.some(u => u.email === email)) {
      return throwError(() => new Error('Email already registered'));
    }

    const newUser: User = {
      id: Date.now().toString(),
      username,
      email,
      password,
      role: 'user',
      createdAt: new Date()
    };

    this.addUser(newUser);
    const { password: _, ...userWithoutPassword } = newUser;
    return of(userWithoutPassword as User);
  }

  logout(): void {
    this.storageService.removeCurrentUser();
    this.storageService.removeAuthToken();
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }
}