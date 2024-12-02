export interface PurchaseUser {
  id: string;
  username: string;
  email: string;
}

export interface PurchaseBook {
  id: string;
  title: string;
  author: string;
  price: number;
}

export interface Purchase {
  id: string;
  userId: string;
  bookId: string;
  user: PurchaseUser;
  book: PurchaseBook;
  quantity: number;
  totalPrice: number;
  purchaseDate: Date;
  status: 'completed' | 'cancelled' | 'refunded';
  createdAt?: Date;
  updatedAt?: Date;
}