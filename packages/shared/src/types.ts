export interface User {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
  fullName?: string;
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface UpdateUserDto {
  email?: string;
  fullName?: string;
  password?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
}

// Impulse Entry Types
export interface ImpulseEntry {
  id: string;
  userId: number;
  createdAt: string;
  updatedAt?: string;
  impulseText: string;
  trigger?: string;
  emotion?: string;
  didAct: 'yes' | 'no' | 'unknown';
  notes?: string;
}

export interface CreateImpulseEntry {
  impulseText: string;
  trigger?: string;
  emotion?: string;
  didAct?: 'yes' | 'no' | 'unknown';
  notes?: string;
}

export interface UpdateImpulseEntry extends Partial<CreateImpulseEntry> {}

export interface ImpulseFilters {
  startDate?: string;
  endDate?: string;
  didAct?: 'all' | 'yes' | 'no' | 'unknown';
}
