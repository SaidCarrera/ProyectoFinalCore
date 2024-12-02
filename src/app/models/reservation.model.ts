export interface ReservationUser {
  id: string;
  username: string;
  email: string;
}

export interface ReservationBook {
  id: string;
  title: string;
  author: string;
}

export interface Reservation {
  id?: string;
  userId: string;
  bookId: string;
  user?: ReservationUser;
  book?: ReservationBook;
  startDate: Date;
  endDate: Date;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  createdAt?: Date;
  updatedAt?: Date;
}