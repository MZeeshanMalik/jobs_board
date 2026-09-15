import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FFFBF9] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-3xl bg-white border border-pink-100 rounded-2xl p-8 md:p-10">
        {children}
      </div>
    </div>
  );
}
