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
