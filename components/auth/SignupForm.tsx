/* eslint-disable react-hooks/immutability */
/* eslint-disable @typescript-eslint/no-explicit-any */
// components/SignupForm.tsx - Updated with international support
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Input } from "../ui/Input";
import { Button } from "../ui/button";
// import PhoneInput from "../tools/PhoneInput";

interface Country {
  code: string;
  name: string;
  callingCode: string;
  flag: string;
}

export function SignupForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneValid, setPhoneValid] = useState<boolean | null>(null);
  const [phoneMessage, setPhoneMessage] = useState("");
  const [isValidatingPhone, setIsValidatingPhone] = useState(false);
  const [isLoadingCountries, setIsLoadingCountries] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  // Fetch countries on mount
  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    setIsLoadingCountries(true);
    try {
      const response = await fetch("/api/tools/phone-validator/countries");
      if (!response.ok) throw new Error("Failed to fetch countries");

      const data = await response.json();
      if (data.success) {
        setCountries(data.data);
        // Set default country to Pakistan
        const pkCountry = data.data.find((c: Country) => c.code === "PK");
        if (pkCountry) setSelectedCountry(pkCountry);
      }
    } catch (error) {
      // console.error("Failed to fetch countries:", error);
      // Fallback: Set Pakistan as default
      setCountries([
        { code: "PK", name: "Pakistan", callingCode: "92", flag: "🇵🇰" },
      ]);
      setSelectedCountry({
        code: "PK",
        name: "Pakistan",
        callingCode: "92",
        flag: "🇵🇰",
      });
    } finally {
      setIsLoadingCountries(false);
    }
  };

  // Validate phone number
  const validatePhone = async (phone: string, countryCode: string) => {
    if (!phone || phone.length < 3) {
      setPhoneValid(null);
      setPhoneMessage("");
      return;
    }

    setIsValidatingPhone(true);
    try {
      const response = await fetch("/api/tools/internal/phone-validator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Request-Source": "frontend",
          "X-Client-Version": "1.0.0",
        },
        body: JSON.stringify({
          phoneNumber: phone,
          countryCode: countryCode,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setPhoneValid(data.data.isValid);
        setPhoneMessage(data.data.message || "");

        // If phone is valid and has detected country, update selected country
        if (
          data.data.isValid &&
          data.data.detectedCountry &&
          data.data.detectedCountry !== selectedCountry?.code
        ) {
          const detected = countries.find(
            (c) => c.code === data.data.detectedCountry,
          );
          if (detected) {
            setSelectedCountry(detected);
          }
        }
      } else {
        setErrors(data || "Phone validation error");
      }
    } catch (error) {
      // console.error("Phone validation error:", error);
    } finally {
      setIsValidatingPhone(false);
    }
  };

  // Debounce phone validation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (phoneNumber && selectedCountry) {
        validatePhone(phoneNumber, selectedCountry.code);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [phoneNumber, selectedCountry]);

  const signupMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          phone: phoneNumber,
          countryCode: selectedCountry?.code,
        }),
      });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
        router.push("/dashboard");
        router.refresh();
      } else {
        setErrors({ general: data.message || "Signup failed" });
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

    if (!formData.name || formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!phoneNumber) {
      newErrors.phone = "Phone number is required";
    } else if (phoneValid !== true) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Must contain uppercase, lowercase, and number";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const { confirmPassword, ...submitData } = formData;
    signupMutation.mutate(submitData);
  };

  if (isLoadingCountries) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center mb-2">
        <h2 className="text-xl font-bold text-gray-900">Create account</h2>
        <p className="text-gray-500 text-sm mt-1">
          Join the global fraud prevention network
        </p>
      </div>

      {errors.general && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {errors.general}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Full name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Ahmed Raza"
          error={errors.name}
          autoComplete="name"
        />

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
      </div>

      <div>
        {/* <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Phone number <span className="text-red-500">*</span>
        </label> */}
        {/* <PhoneInput
          countries={countries}
          selectedCountry={selectedCountry}
          onCountryChange={setSelectedCountry}
          phoneNumber={phoneNumber}
          onPhoneChange={setPhoneNumber}
        /> */}
        {errors.phone && (
          <p className="text-xs text-red-600 mt-1">{errors.phone}</p>
        )}
      </div>

      <Input
        label="Store address (optional)"
        type="text"
        name="address"
        value={formData.address}
        onChange={handleChange}
        placeholder="Shop #123, Main Boulevard, Karachi"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Min 8 characters"
          error={errors.password}
          autoComplete="new-password"
          showPasswordToggle
        />

        <Input
          label="Confirm password"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Re-enter password"
          error={errors.confirmPassword}
          autoComplete="new-password"
          showPasswordToggle
        />
      </div>

      <Button
        type="submit"
        disabled={signupMutation.isPending}
        className="mt-2 w-full"
      >
        Create account
      </Button>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-pink-600 hover:text-pink-700 font-semibold"
        >
          Sign in
        </Link>
      </p>

      <p className="text-xs text-center text-gray-500 leading-relaxed">
        By signing up, you agree to our{" "}
        <Link href="/terms" className="text-pink-600">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="text-pink-600">
          Privacy Policy
        </Link>
      </p>
    </form>
  );
}
