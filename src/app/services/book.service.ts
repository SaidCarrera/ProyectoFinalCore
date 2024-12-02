import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Book, BookCategory } from '../models/book.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private booksSubject: BehaviorSubject<Book[]>;

  private readonly categories: BookCategory[] = [
    'Fiction',
    'Non-Fiction',
    'Science Fiction',
    'Mystery',
    'Biography',
    'History',
    'Fantasy',
    'Romance',
    'Thriller',
    'Science',
    'Technology',
    'Self-Help',
    'Poetry',
    'Drama',
    'Children'
  ];

  constructor(private storageService: StorageService) {
    const initialBooks = this.storageService.getBooks();
    if (initialBooks.length === 0) {
      const demoBooks: Book[] = [
        {
          id: '1',
          title: 'The Great Gatsby',
          author: 'F. Scott Fitzgerald',
          category: 'Fiction',
          publicationYear: 1925,
          isbn: '978-0743273565',
          price: 9.99,
          stock: 5,
          createdAt: new Date()
        },
        {
          id: '2',
          title: '1984',
          author: 'George Orwell',
          category: 'Science Fiction',
          publicationYear: 1949,
          isbn: '978-0451524935',
          price: 12.99,
          stock: 3,
          createdAt: new Date()
        },
        {
          id: '3',
          title: 'To Kill a Mockingbird',
          author: 'Harper Lee',
          category: 'Fiction',
          publicationYear: 1960,
          isbn: '978-0446310789',
          price: 14.99,
          stock: 7,
          createdAt: new Date()
        },
        {
          id: '4',
          title: 'The Hobbit',
          author: 'J.R.R. Tolkien',
          category: 'Fantasy',
          publicationYear: 1937,
          isbn: '978-0547928227',
          price: 11.99,
          stock: 4,
          createdAt: new Date()
        },
        {
          id: '5',
          title: 'Pride and Prejudice',
          author: 'Jane Austen',
          category: 'Romance',
          publicationYear: 1813,
          isbn: '978-0141439518',
          price: 8.99,
          stock: 6,
          createdAt: new Date()
        },
        {
          id: '6',
          title: 'The Da Vinci Code',
          author: 'Dan Brown',
          category: 'Thriller',
          publicationYear: 2003,
          isbn: '978-0307474278',
          price: 15.99,
          stock: 8,
          createdAt: new Date()
        },
        {
          id: '7',
          title: 'A Brief History of Time',
          author: 'Stephen Hawking',
          category: 'Science',
          publicationYear: 1988,
          isbn: '978-0553380163',
          price: 18.99,
          stock: 3,
          createdAt: new Date()
        },
        {
          id: '8',
          title: 'The Catcher in the Rye',
          author: 'J.D. Salinger',
          category: 'Fiction',
          publicationYear: 1951,
          isbn: '978-0316769488',
          price: 10.99,
          stock: 5,
          createdAt: new Date()
        },
        {
          id: '9',
          title: 'The Alchemist',
          author: 'Paulo Coelho',
          category: 'Fiction',
          publicationYear: 1988,
          isbn: '978-0062315007',
          price: 13.99,
          stock: 9,
          createdAt: new Date()
        },
        {
          id: '10',
          title: 'Dune',
          author: 'Frank Herbert',
          category: 'Science Fiction',
          publicationYear: 1965,
          isbn: '978-0441172719',
          price: 16.99,
          stock: 4,
          createdAt: new Date()
        }
      ];
      this.storageService.setBooks(demoBooks);
      this.booksSubject = new BehaviorSubject<Book[]>(demoBooks);
    } else {
      this.booksSubject = new BehaviorSubject<Book[]>(initialBooks);
    }
  }

  getCategories(): BookCategory[] {
    return [...this.categories];
  }

  getBooks(): Observable<Book[]> {
    return this.booksSubject.asObservable();
  }

  getBook(id: string): Observable<Book> {
    return new Observable(subscriber => {
      const books = this.booksSubject.value;
      const book = books.find(b => b.id === id);
      if (book) {
        subscriber.next(book);
      } else {
        subscriber.error(new Error('Book not found'));
      }
      subscriber.complete();
    });
  }

  createBook(bookData: Omit<Book, 'id' | 'createdAt'>): Observable<Book> {
    return new Observable(subscriber => {
      try {
        const newBook: Book = {
          ...bookData,
          id: Date.now().toString(),
          createdAt: new Date()
        };

        const updatedBooks = [...this.booksSubject.value, newBook];
        this.booksSubject.next(updatedBooks);
        this.storageService.setBooks(updatedBooks);

        subscriber.next(newBook);
        subscriber.complete();
      } catch (error) {
        subscriber.error(error);
      }
    });
  }

  updateBook(id: string, bookData: Partial<Book>): Observable<Book> {
    return new Observable(subscriber => {
      try {
        const books = this.booksSubject.value;
        const index = books.findIndex(b => b.id === id);
        
        if (index === -1) {
          throw new Error('Book not found');
        }

        const updatedBook = {
          ...books[index],
          ...bookData,
          updatedAt: new Date()
        };

        const updatedBooks = [
          ...books.slice(0, index),
          updatedBook,
          ...books.slice(index + 1)
        ];

        this.booksSubject.next(updatedBooks);
        this.storageService.setBooks(updatedBooks);

        subscriber.next(updatedBook);
        subscriber.complete();
      } catch (error) {
        subscriber.error(error);
      }
    });
  }

  deleteBook(id: string): Observable<void> {
    return new Observable(subscriber => {
      try {
        const books = this.booksSubject.value;
        const filteredBooks = books.filter(b => b.id !== id);
        
        if (filteredBooks.length === books.length) {
          throw new Error('Book not found');
        }

        this.booksSubject.next(filteredBooks);
        this.storageService.setBooks(filteredBooks);

        subscriber.next();
        subscriber.complete();
      } catch (error) {
        subscriber.error(error);
      }
    });
  }
}