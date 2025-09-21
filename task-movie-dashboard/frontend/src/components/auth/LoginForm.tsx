"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { login as loginUser } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { safeToast } from "@/utils/toast";
import Image from "next/image";

const schema = yup.object({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

type FormData = yup.InferType<typeof schema>;

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const result = dispatch(loginUser(data));
      await result.unwrap();
      safeToast.success("Login successful!");
      router.push("/movies");
    } catch (error: unknown) {
      safeToast.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#093545] relative overflow-hidden">
      {/* Background waves */}
      <div className="absolute bottom-0 left-0 right-0 h-[111px] w-full">
        <Image
          src="/Vectors.svg"
          alt="Wave background"
          fill
          className="w-full h-auto object-cover"
        />
      </div>

      <div className="w-full max-w-md px-6 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Sign in</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                {...register("email")}
                type="email"
                placeholder="Email"
                className="w-full pl-12 pr-4 py-3 bg-[#224957] text-white placeholder-gray-400 rounded-lg border-0 focus:ring-2 focus:ring-[#2BD17E] focus:outline-none"
              />
            </div>
            {errors.email && (
              <p className="mt-2 text-[#EB5757] text-sm">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full pl-12 pr-12 py-3 bg-[#224957] text-white placeholder-gray-400 rounded-lg border-0 focus:ring-2 focus:ring-[#2BD17E] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-2 text-[#EB5757] text-sm">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="w-4 h-4 text-[#60D68A] bg-[#3A5765] border-gray-600 rounded focus:ring-[#60D68A] focus:ring-2"
              />
              <span className="ml-2 text-gray-300 text-sm">Remember me</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#2BD17E] text-white font-semibold rounded-lg hover:bg-[#25B86A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Login"}
          </button>

          {error && (
            <div className="text-[#EB5757] text-center text-sm">{error}</div>
          )}
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-300 text-sm">
            Don&apos;t have an account?{" "}
            <button
              onClick={() => router.push("/register")}
              className="text-[#2BD17E] hover:text-[#25B86A] font-medium"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
