export interface DashboardStats {
  totalUsers: number;
  adminUsers: number;
  regularUsers: number;
  totalBooks: number;
  totalPurchases: number;
  totalReservations: number;
  activeReservations: number;
  lastUpdated: Date;
}

export interface StatCard {
  icon: string;
  title: string;
  value: number;
  subtitle?: string;
}