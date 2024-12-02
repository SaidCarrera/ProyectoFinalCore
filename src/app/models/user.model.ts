export interface User {
  id?: string;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  token?: string;
  createdAt?: Date;
  updatedAt?: Date;
}