"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Input } from "../ui/Input";
import { Button } from "../ui/button";

export function LoginForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({ email: "", password: "" });

  const loginMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
        router.push("/dashboard");
        router.refresh();
      } else {
        setErrors({ general: data.message || "Login failed" });
      }
    },
    onError: () => {
      setErrors({ general: "Something went wrong. Please try again." });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Please enter a valid email";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    loginMutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
        <p className="text-gray-600 mt-2">
          Sign in to your Fraudhawkai account
        </p>
      </div>

      {errors.general && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          {errors.general}
        </div>
      )}

      <div className="space-y-4">
        <Input
          label="Email address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="store@example.com"
          error={errors.email}
          autoComplete="email"
        />
        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          error={errors.password}
          autoComplete="current-password"
          showPasswordToggle
        />
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 text-pink-600 border-gray-300 rounded"
          />
          <span className="text-sm text-gray-700">Remember me</span>
        </label>
        <Link
          href="/forgot-password"
          className="text-sm text-pink-600 hover:text-pink-700 font-medium"
        >
          Forgot password?
        </Link>
      </div>

      <Button type="submit" fullWidth loading={loginMutation.isPending}>
        Sign in
      </Button>

      <p className="text-center text-sm text-gray-600">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="text-pink-600 hover:text-pink-700 font-semibold"
        >
          Create free account
        </Link>
      </p>
    </form>
  );
}
