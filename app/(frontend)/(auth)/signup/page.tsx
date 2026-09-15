// app/(auth)/signup/page.tsx
import { SignupForm } from "@/app/(frontend_pages)/components/auth/SignupForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account - Fraudhawkai",
  description: "Join Pakistan's leading COD fraud detection network",
};

export default function SignupPage() {
  return <SignupForm />;
}
