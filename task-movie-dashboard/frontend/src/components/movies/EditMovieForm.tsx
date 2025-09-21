"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateMovie, fetchMovies } from "@/store/slices/moviesSlice";
import { useRouter } from "next/navigation";
import { Upload, X, ArrowLeft } from "lucide-react";
import { safeToast } from "@/utils/toast";
import Image from "next/image";
import { uploadApi } from "@/lib/api";
import { Movie } from "@/types";

const schema = yup.object({
  title: yup.string().required("Title is required"),
  publishingYear: yup
    .number()
    .min(1800, "Year must be at least 1800")
    .max(new Date().getFullYear(), "Year cannot be in the future")
    .required("Publishing year is required"),
  poster: yup.string().required("Publishing year is required"),
});

type FormData = yup.InferType<typeof schema>;

interface EditMovieFormProps {
  movieId: number;
}

export default function EditMovieForm({ movieId }: EditMovieFormProps) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { movies, loading } = useAppSelector((state) => state.movies);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  // Find the movie to edit
  useEffect(() => {
    const foundMovie = movies.find((m) => m.id === movieId);
    if (foundMovie) {
      setMovie(foundMovie);
      setValue("title", foundMovie.title);
      setValue("publishingYear", foundMovie.publishingYear);
      if (foundMovie.poster) {
        setUploadedImage(foundMovie.poster);
        setValue("poster", foundMovie.poster);
      }
    } else {
      // If movie not found in current list, fetch all movies
      dispatch(fetchMovies({ page: 1, limit: 1000 }));
    }
  }, [movieId, movies, setValue, dispatch]);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      safeToast.error("Please select an image file");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      safeToast.error("Image size must be less than 5MB");
      return;
    }

    setUploading(true);
    try {
      const response = await uploadApi.uploadPoster(file);
      // Cloudinary returns the full URL directly
      const imageUrl = response.data.url;
      setUploadedImage(imageUrl);
      setValue("poster", imageUrl);
      safeToast.success("Image uploaded successfully");
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : "Failed to upload image";
      safeToast.error(errorMessage || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
    setValue("poster", "");
  };

  const onFormSubmit = async (data: FormData) => {
    if (!movie) return;

    try {
      await dispatch(
        updateMovie({
          id: movie.id,
          data: {
            title: data.title,
            publishingYear: data.publishingYear,
            poster: data.poster || undefined,
          },
        })
      ).unwrap();
      safeToast.success("Movie updated successfully!");
      router.push("/movies");
    } catch (error: unknown) {
      safeToast.error(error);
    }
  };

  if (!movie) {
    return (
      <div className="min-h-screen bg-[#093545] flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading movie...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#093545] relative overflow-hidden">
      {/* Background waves */}
      <div className="absolute bottom-0 left-0 right-0 h-[111px] w-full">
        <Image
          src="/Vectors.svg"
          alt="Wave background"
          fill
          className="w-full h-auto object-cover"
        />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-400 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            <h1 className="text-4xl font-bold text-white">Edit</h1>
          </div>

          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Image Upload Section */}
              <div className="space-y-4">
                <div className="border-2 border-dashed border-white rounded-lg p-8 text-center hover:border-gray-300 transition-colors min-h-[400px] flex flex-col items-center justify-center">
                  {uploadedImage ? (
                    <div className="relative w-full h-full">
                      <img
                        src={uploadedImage}
                        alt="Movie poster"
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex flex-col items-center">
                        <svg
                          className="w-12 h-12 text-gray-300 mb-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        <p className="text-gray-300 text-sm">
                          Drop other image here
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="inline-flex items-center px-4 py-2 bg-[#2BD17E] text-white rounded-lg hover:bg-[#25B86A] transition-colors cursor-pointer disabled:opacity-50 text-sm"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {uploading ? "Uploading..." : "Choose Image"}
                      </label>
                    </div>
                  )}
                </div>

                {errors.poster && (
                  <p className="text-[#EB5757] text-sm">
                    {errors.poster.message}
                  </p>
                )}
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                <div>
                  <input
                    {...register("title")}
                    type="text"
                    className="w-full px-4 py-3 bg-[#224957] border border-[#224957] rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#2BD17E] focus:border-transparent outline-none"
                    placeholder="Title"
                  />
                  {errors.title && (
                    <p className="text-[#EB5757] text-sm mt-1">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    {...register("publishingYear", { valueAsNumber: true })}
                    type="number"
                    min="1800"
                    max={new Date().getFullYear()}
                    className="w-full px-4 py-3 bg-[#224957] border border-[#224957] rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#2BD17E] focus:border-transparent outline-none"
                    placeholder="Publishing year"
                  />
                  {errors.publishingYear && (
                    <p className="text-[#EB5757] text-sm mt-1">
                      {errors.publishingYear.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-8">
              <button
                type="button"
                onClick={() => router.back()}
                className="w-full sm:w-auto px-6 py-3 bg-transparent border border-white text-white rounded-lg hover:bg-white hover:text-[#093545] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploading || loading}
                className="w-full sm:w-auto px-6 py-3 bg-[#2BD17E] text-white rounded-lg hover:bg-[#25B86A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
