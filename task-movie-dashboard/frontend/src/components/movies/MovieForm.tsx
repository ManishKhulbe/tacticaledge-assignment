"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Movie, CreateMovieRequest, UpdateMovieRequest } from "@/types";
import { uploadApi } from "@/lib/api";
import { X, Upload } from "lucide-react";
import { safeToast } from "@/utils/toast";
import Image from "next/image";

const schema = yup.object({
  title: yup
    .string()
    .required("Title is required")
    .min(1, "Title must not be empty"),
  publishingYear: yup
    .number()
    .required("Publishing year is required")
    .min(1800, "Year must be at least 1800")
    .max(
      new Date().getFullYear(),
      `Year must not exceed ${new Date().getFullYear()}`
    ),
  poster: yup.string().nullable().notRequired()
});

type FormData = yup.InferType<typeof schema>;

interface MovieFormProps {
  movie?: Movie;
  onSubmit: (data: CreateMovieRequest | UpdateMovieRequest) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function MovieForm({
  movie,
  onSubmit,
  onCancel,
  loading,
}: MovieFormProps) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: movie?.title || "",
      publishingYear: movie?.publishingYear || new Date().getFullYear(),
      poster: movie?.poster || "",
    },
  });

  useEffect(() => {
    if (movie?.poster) {
      setUploadedImage(movie.poster);
    }
  }, [movie]);

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
      const imageUrl = `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
      }${response.data.url}`;
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

  const onFormSubmit = (data: FormData) => {
    onSubmit({
      title: data.title,
      publishingYear: data.publishingYear,
      poster: data.poster || undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-[#093545] rounded-lg max-w-4xl w-full max-h-[95vh] overflow-y-auto relative">
        {/* Background pattern */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0A3A47] to-transparent opacity-30"></div>

        <div className="p-6 sm:p-8 relative z-10">
          {/* Header */}
          <div className="mb-8">
            <p className="text-gray-400 text-sm mb-2">Create a new movie</p>
            <h2 className="text-4xl font-bold text-white">
              {movie ? "Edit Movie" : "Create a new movie"}
            </h2>
            <button
              onClick={onCancel}
              className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors p-1"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Image Upload Section */}
              <div className="space-y-4">
                <div className="border-2 border-dashed border-white rounded-lg p-8 text-center hover:border-gray-300 transition-colors min-h-[300px] flex flex-col items-center justify-center">
                  {uploadedImage ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={uploadedImage}
                        alt="Movie poster"
                        fill
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
                          Drop an image here
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
                onClick={onCancel}
                className="w-full sm:w-auto px-6 py-3 bg-transparent border border-white text-white rounded-lg hover:bg-white hover:text-[#093545] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || uploading}
                className="w-full sm:w-auto px-6 py-3 bg-[#2BD17E] text-white rounded-lg hover:bg-[#25B86A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Saving..." : movie ? "Update" : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
