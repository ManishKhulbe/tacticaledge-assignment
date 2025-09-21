"use client";

import { Movie } from "@/types";
import { Edit, Trash2, Calendar, Film } from "lucide-react";
import Image from "next/image";

interface MovieCardProps {
  movie: Movie;
  onEdit: (movie: Movie) => void;
  onDelete: (id: number) => void;
}

export default function MovieCard({ movie, onEdit, onDelete }: MovieCardProps) {
  return (
    <div className="bg-[#092C39] rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group transform hover:-translate-y-1">
      <div className="relative h-48 sm:h-56 md:h-[504px] w-[289px] bg-gray-200">
        {movie.poster ? (
          <Image
            src={movie.poster}
            alt={movie.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-100 to-gray-200">
            <Film className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
          </div>
        )}

        {/* Overlay with actions */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          
          
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(movie)}
              className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all duration-200 shadow-lg"
              title="Edit movie"
            >
              <Edit className="w-4 h-4 text-gray-700" />
            </button>
            <button
              onClick={() => onDelete(movie.id)}
              className="p-2 bg-[#EB5757] bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all duration-200 shadow-lg"
              title="Delete movie"
            >
              <Trash2 className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-3 sm:p-4">
        <h3 className="text-base sm:text-lg font-semibold text-white mb-2 line-clamp-2 min-h-[2.5rem]">
          {movie.title}
        </h3>
        <div className="flex items-center text-gray-300 text-sm">
          <span className="truncate">{movie.publishingYear}</span>
        </div>
      </div>
    </div>
  );
}
