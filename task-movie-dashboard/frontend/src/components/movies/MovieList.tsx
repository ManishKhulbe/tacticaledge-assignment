"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchMovies,
  deleteMovie,
  setCurrentPage,
} from "@/store/slices/moviesSlice";
import { Movie } from "@/types";
import MovieCard from "./MovieCard";
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { safeToast } from "@/utils/toast";
import EmptyState from "../ui/EmptyState";
import ConfirmDialog from "../ui/ConfirmDialog";
import LoadingSpinner from "../ui/LoadingSpinner";
import { CirclePlus } from "lucide-react";

export default function MovieList() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { movies, totalPages, currentPage, loading } = useAppSelector(
    (state) => state.movies
  );

  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    movieId: number | null;
  }>({
    isOpen: false,
    movieId: null,
  });

  useEffect(() => {
    dispatch(fetchMovies({ page: currentPage, limit: 8 }));
  }, [dispatch, currentPage]);

  const handleLogout = () => {
    dispatch({ type: "auth/logout" });
    router.push("/login");
  };

  const handleEdit = (movie: Movie) => {
    router.push(`/movies/edit/${movie.id}`);
  };

  const handleDelete = (id: number) => {
    setDeleteConfirm({ isOpen: true, movieId: id });
  };

  const confirmDelete = async () => {
    if (deleteConfirm.movieId) {
      try {
        await dispatch(deleteMovie(deleteConfirm.movieId)).unwrap();
        safeToast.success("Movie deleted successfully");
      } catch (error: unknown) {
        safeToast.error(error);
      }
    }
    setDeleteConfirm({ isOpen: false, movieId: null });
  };

  const cancelDelete = () => {
    setDeleteConfirm({ isOpen: false, movieId: null });
  };

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            i === currentPage
              ? "bg-[#2BD17E] text-white"
              : "text-white hover:bg-white hover:bg-opacity-20"
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex items-center justify-center space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {pages}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  };

  if (loading && movies.length === 0) {
    return (
      <div className="min-h-screen bg-[#093545] flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-gray-300 mt-4">Loading movies...</p>
        </div>
      </div>
    );
  }

  if (movies.length === 0 && !loading) {
    return (
      <EmptyState
        title="Your movie list is empty"
        description="Start building your movie collection by adding your first movie"
        actionText="Add a new movie"
        onAction={() => setShowForm(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#093545]">
      {/* Header */}
      <div className="bg-[#093545] text-white p-4 md:p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <h1 className="text-xl md:text-[48px] font-semibold">
                  My movies
                </h1>
                <CirclePlus
                  onClick={() => router.push("/movies/create")}
                  className="w-6 h-6 cursor-pointer hover:text-gray-300 transition-colors"
                />
              </div>
              <button
                onClick={handleLogout}
                className="md:hidden flex items-center space-x-1 text-white hover:text-gray-300 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleLogout}
                className="hidden cursor-pointer md:flex items-center space-x-2 text-white hover:text-gray-300 transition-colors"
              >
                <span>Logout</span>
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Movie Grid */}
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 md:mt-8 flex justify-center">
            {renderPagination()}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete Movie"
        message="Are you sure you want to delete this movie? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        type="danger"
      />
    </div>
  );
}
