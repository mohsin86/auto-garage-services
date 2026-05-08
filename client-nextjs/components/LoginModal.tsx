"use client";

import { useState } from "react";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

type Props = {
  onClose: () => void;
};

const loginSchema = z.object({
  identifier: z.string().min(3, "Enter email / username / mobile"),
  password: z.string().min(6, "Password required"),
});

const loginUser = async (data: { identifier: string; password: string }) => {
  const res = await fetch("/api/login", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    
    body: JSON.stringify(data),
  });

  const result = await res.json();
  console.log(JSON.stringify( result.user));
  localStorage.setItem("user", JSON.stringify( result.user));
  localStorage.setItem("token", result.access_token);

  if (!res.ok) {
    throw new Error(result.message || "Login failed");
  }

  return result;
};

export default function LoginModal({ onClose }: Props) {
  const router = useRouter();

  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });

  const [message, setMessage] = useState<string | null>(null);

  // mutation MUST be inside component
  const mutation = useMutation({
    mutationFn: loginUser,

    onSuccess: (data) => {
      localStorage.setItem("token", data.access_token);

      setMessage("Login successful");

      console.log("Login success:");

       // small delay
     // setTimeout(() => {
        // correct client-side redirect
          router.push("/dashboard");
     // }, 100);

      

      onClose();
    },

    onError: (error: Error) => {
      console.log(error)
      setMessage(error.message);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = loginSchema.safeParse(form);

    if (!result.success) {
      setMessage(result.error.issues[0].message);
      return;
    }

    mutation.mutate(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-96">
        <h2 className="text-xl font-bold mb-4">Login</h2>

        <form onSubmit={handleLogin} className="space-y-3">
          <input
            name="identifier"
            placeholder="Email | Mobile | Username"
            className="border p-2 w-full"
            onChange={handleChange}
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            className="border p-2 w-full"
            onChange={handleChange}
          />

          {message && (
            <p className="text-sm text-red-500">{message}</p>
          )}

          <button
            disabled={mutation.isPending}
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            {mutation.isPending ? "Logging in..." : "Login"}
          </button>
        </form>

        <button
          onClick={onClose}
          className="w-full mt-2 text-sm text-gray-500"
        >
          Close
        </button>
      </div>
    </div>
  );
}