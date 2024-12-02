export type BookCategory = 
  | 'Fiction'
  | 'Non-Fiction'
  | 'Science Fiction'
  | 'Mystery'
  | 'Biography'
  | 'History'
  | 'Fantasy'
  | 'Romance'
  | 'Thriller'
  | 'Science'
  | 'Technology'
  | 'Self-Help'
  | 'Poetry'
  | 'Drama'
  | 'Children';

export interface Book {
  id?: string;
  title: string;
  author: string;
  category: BookCategory;
  publicationYear: number;
  isbn: string;
  price: number;
  stock: number;
  createdAt?: Date;
  updatedAt?: Date;
}