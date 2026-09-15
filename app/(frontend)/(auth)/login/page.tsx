// app/(auth)/login/page.tsx
// "use client";
import { LoginForm } from "@/components/auth/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In - Fraudhawkai",
  description:
    "Sign in to your Fraudhawkai account to protect your store from COD fraud",
};

export default function LoginPage() {
  return <LoginForm />;
}
