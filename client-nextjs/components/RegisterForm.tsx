// RegisterForm
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import LoginModal from "./LoginModal";

// ---------------- ZOD ----------------
const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    
    username: z
      .string()
      .min(3, "Username must be at least 3 characters"),

    mobile: z
      .string()
      .min(10, "Mobile must be at least 10 digits"),

    email: z
      .string()
      .email("Please enter a valid email address"),

    address: z
      .string()
      .min(5, "Address must be at least 5 characters"),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters"),

    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

// ---------------- API CALL ----------------
const registerUser = async (data: RegisterFormData) => {
  const res = await fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Registration failed");
  }

  return result;
};

export default function RegisterForm() {
  const router = useRouter();

  const [showLogin, setShowLogin] = useState(false);
  const [showRegistForm, setShowRegistForm] = useState(true);
  const [form, setForm] = useState<RegisterFormData>({
    name: "",
    username: "",
    mobile: "",
    email: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [serverError, setServerError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<string | null>(null);

  // ---------------- REACT QUERY ----------------
  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      setSuccess("Registration successful!");
      setServerError(null);

      setTimeout(() => {
        //router.push("/frontend/user");
        setForm({
          name: "",
          username: "",
          mobile: "",
          email: "",
          address: "",
          password: "",
          confirmPassword: "",
        })
      }, 1000);
      setShowLogin(true);
      setShowRegistForm(false);

    },
    onError: (err: Error) => {
      setServerError(err.message);
      setSuccess(null);
    },
  });

  // ---------------- HANDLERS ----------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    // Clearing error for each field if full fill
    setErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError(null);
    setSuccess(null);

    const result = registerSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        fieldErrors[field] = issue.message;
      });

      setErrors(fieldErrors);
      return;
    }

    mutation.mutate(form);
  };

  return (
    <div className="w-full max-w-xl bg-white p-6 rounded-2xl shadow">
      {/* HEADER */}
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Register</h1>

        <button
          onClick={() => setShowLogin(true)}
          className="bg-blue-600 text-white px-4 py-1 rounded"
        >
          Login
        </button>
      </div>

      {/* FORM */}
      {showRegistForm && (  
      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="name" placeholder="Name" onChange={handleChange} className="border p-2 w-full" />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

        <input name="username" placeholder="Username" onChange={handleChange} className="border p-2 w-full" />
        {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
        <input name="mobile" placeholder="Mobile" onChange={handleChange} className="border p-2 w-full" />
        {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile}</p>}
        <input name="email" placeholder="Email" onChange={handleChange} className="border p-2 w-full" />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        <input name="address" placeholder="Address" onChange={handleChange} className="border p-2 w-full" />
        {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
        <input name="password" type="password" placeholder="Password" onChange={handleChange} className="border p-2 w-full" />
        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
        <input name="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleChange} className="border p-2 w-full" />
        {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}


        {/* ERROR */}
        {serverError && <p className="text-sm text-red-500">{serverError}</p>}

        {/* SUCCESS */}
        {success && <p className="text-sm text-green-600">{success}</p>}

        {/* BUTTON */}
        <button
          disabled={mutation.isPending}
          className="w-full bg-green-600 text-white py-2 rounded"
        >
          {mutation.isPending ? "Registering..." : "Register"}
        </button>
      </form>
      )}

      {/* LOGIN MODAL */}

      {showLogin && (
        <LoginModal
          onClose={() => {
            setShowLogin(false);
            setShowRegistForm(true); // restore register form
          }}
        />
      )}  
    </div>
  );
}