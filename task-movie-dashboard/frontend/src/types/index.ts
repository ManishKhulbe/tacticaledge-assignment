export interface User {
  id: number;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Movie {
  id: number;
  title: string;
  publishingYear: number;
  poster?: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface CreateMovieRequest {
  title: string;
  publishingYear: number;
  poster?: string;
}

export interface UpdateMovieRequest {
  title?: string;
  publishingYear?: number;
  poster?: string;
}

export interface MoviesResponse {
  movies: Movie[];
  total: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface UploadResponse {
  filename: string;
  url: string;
  originalName: string;
  size: number;
}
