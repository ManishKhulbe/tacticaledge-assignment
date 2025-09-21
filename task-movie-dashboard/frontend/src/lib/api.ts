import axios from "axios";
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  CreateMovieRequest,
  UpdateMovieRequest,
  MoviesResponse,
  PaginationParams,
  UploadResponse,
  Movie,
} from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (data: LoginRequest): Promise<{ data: AuthResponse }> =>
    api.post("/auth/login", data),

  register: (data: RegisterRequest): Promise<{ data: AuthResponse }> =>
    api.post("/auth/register", data),
};

export const moviesApi = {
  getAll: (params?: PaginationParams): Promise<{ data: MoviesResponse }> =>
    api.get("/movies", { params }),

  getById: (id: number): Promise<{ data: Movie }> => api.get(`/movies/${id}`),

  create: (data: CreateMovieRequest): Promise<{ data: Movie }> =>
    api.post("/movies", data),

  update: (id: number, data: UpdateMovieRequest): Promise<{ data: Movie }> =>
    api.patch(`/movies/${id}`, data),

  delete: (id: number): Promise<{ data: { message: string } }> =>
    api.delete(`/movies/${id}`),
};

export const uploadApi = {
  uploadPoster: (file: File): Promise<{ data: UploadResponse }> => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/upload/poster", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default api;
