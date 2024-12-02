export interface OverdueReport {
  id: string;
  bookId: string;
  userId: string;
  bookTitle: string;
  userName: string;
  dueDate: Date;
  returnDate?: Date;
  daysOverdue: number;
  fine: number;
  status: 'pending' | 'paid';
  createdAt: Date;
}

export interface OverdueStats {
  totalOverdue: number;
  totalFines: number;
  mostOverdueBooks: {
    bookId: string;
    title: string;
    count: number;
  }[];
}