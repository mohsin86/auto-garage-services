// File: app/page.tsx

"use client";

import RegisterForm from "@/components/RegisterForm";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <RegisterForm />
    </div>
  );
}