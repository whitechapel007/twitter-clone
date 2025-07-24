// auth.d.ts
export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  avatar?: string;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  username: string;
  password: string;
  birthMonth: string;
  birthDay: string;
  birthYear: string;
}

export interface AuthResponse {
  user: User;
  accessToken?: string;
}

export interface DecodedToken {
  exp: number;
  iat: number;
  userId: string;
  email: string;
  [key: string]: any;
}

export interface AuthError {
  message: string;
  statusCode?: number;
  field?: string;
}
