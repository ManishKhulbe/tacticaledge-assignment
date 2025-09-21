import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  Movie,
  CreateMovieRequest,
  UpdateMovieRequest,
  PaginationParams,
} from "@/types";
import { moviesApi } from "@/lib/api";

interface MoviesState {
  movies: Movie[];
  total: number;
  totalPages: number;
  currentPage: number;
  loading: boolean;
  error: string | null;
}

const initialState: MoviesState = {
  movies: [],
  total: 0,
  totalPages: 0,
  currentPage: 1,
  loading: false,
  error: null,
};

export const fetchMovies = createAsyncThunk(
  "movies/fetchMovies",
  async (params: PaginationParams = {}, { rejectWithValue }) => {
    try {
      const response = await moviesApi.getAll(params);
      return response.data;
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : "Failed to fetch movies";
      return rejectWithValue(errorMessage || "Failed to fetch movies");
    }
  }
);

export const createMovie = createAsyncThunk(
  "movies/createMovie",
  async (movieData: CreateMovieRequest, { rejectWithValue }) => {
    try {
      const response = await moviesApi.create(movieData);
      return response.data;
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : "Failed to create movie";
      return rejectWithValue(errorMessage || "Failed to create movie");
    }
  }
);

export const updateMovie = createAsyncThunk(
  "movies/updateMovie",
  async (
    { id, data }: { id: number; data: UpdateMovieRequest },
    { rejectWithValue }
  ) => {
    try {
      const response = await moviesApi.update(id, data);
      return response.data;
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : "Failed to update movie";
      return rejectWithValue(errorMessage || "Failed to update movie");
    }
  }
);

export const deleteMovie = createAsyncThunk(
  "movies/deleteMovie",
  async (id: number, { rejectWithValue }) => {
    try {
      await moviesApi.delete(id);
      return id;
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : "Failed to delete movie";
      return rejectWithValue(errorMessage || "Failed to delete movie");
    }
  }
);

const moviesSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch movies
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchMovies.fulfilled,
        (
          state,
          action: PayloadAction<{
            movies: Movie[];
            total: number;
            totalPages: number;
          }>
        ) => {
          state.loading = false;
          state.movies = action.payload.movies;
          state.total = action.payload.total;
          state.totalPages = action.payload.totalPages;
          state.error = null;
        }
      )
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create movie
      .addCase(createMovie.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMovie.fulfilled, (state, action: PayloadAction<Movie>) => {
        state.loading = false;
        state.movies.unshift(action.payload);
        state.total += 1;
        state.error = null;
      })
      .addCase(createMovie.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update movie
      .addCase(updateMovie.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMovie.fulfilled, (state, action: PayloadAction<Movie>) => {
        state.loading = false;
        const index = state.movies.findIndex(
          (movie) => movie.id === action.payload.id
        );
        if (index !== -1) {
          state.movies[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateMovie.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete movie
      .addCase(deleteMovie.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteMovie.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;
          state.movies = state.movies.filter(
            (movie) => movie.id !== action.payload
          );
          state.total -= 1;
          state.error = null;
        }
      )
      .addCase(deleteMovie.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentPage, clearError } = moviesSlice.actions;
export default moviesSlice.reducer;
