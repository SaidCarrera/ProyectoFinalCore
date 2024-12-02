import { Routes } from '@angular/router';
import { BookListComponent } from './components/book-list/book-list.component';
import { BookDetailComponent } from './components/book-detail/book-detail.component';
import { authGuard } from '../../guards/auth.guard';

export const BOOKS_ROUTES: Routes = [
  {
    path: '',
    component: BookListComponent,
    canActivate: [authGuard]
  },
  {
    path: ':id',
    component: BookDetailComponent,
    canActivate: [authGuard]
  }
];