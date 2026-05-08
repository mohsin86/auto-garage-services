// File: app/dashboard/users/UserForm.tsx

"use client";

import { useEffect } from "react";

import { useForm } from "react-hook-form";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ---------------- ZOD ----------------
const schema = z.object({
  name: z.string().min(2, "Name required"),

  username: z.string().min(3, "Username required"),

  email: z.string().email("Valid email required"),

  mobile: z.string().min(11, "Valid mobile required"),

  address: z.string().min(3, "Address required"),

  role: z.enum(["admin", "mechanic", "user"]),
});

type FormData = z.infer<typeof schema>;

type Props = {
  editingUser?: any;
  onSuccess: () => void;
};

export default function UserForm({
  editingUser,
  onSuccess,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),

    defaultValues: {
      role: "user",
    },
  });

  // ---------------- EDIT MODE ----------------
  useEffect(() => {
    if (editingUser) {
      reset({
        name: editingUser.name,
        username: editingUser.username,
        email: editingUser.email,
        mobile: editingUser.mobile,
        address: editingUser.address,
        role: editingUser.role || "user",
      });
    }
  }, [editingUser, reset]);

  // ---------------- SUBMIT ----------------
  async function onSubmit(data: FormData) {
    let updateUser : any;
    if (editingUser) {
       updateUser = await fetch(`/api/users/${editingUser.id}`, {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(data),
      });
    } else {
       updateUser = await fetch("/api/users", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          ...data,
          password: "123456",
        }),
      });
    }

    if(updateUser.ok){
        reset();
    }else{
        console.log('error',updateUser);
    }
    

    onSuccess();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-3 gap-4 bg-white p-6 rounded-xl border"
    >
      {/* NAME */}
      <div>
        <Input placeholder="Name" {...register("name")} />

        {errors.name && (
          <p className="text-red-500 text-sm mt-1">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* USERNAME */}
      <div>
        <Input
          placeholder="Username"
          {...register("username")}
        />

        {errors.username && (
          <p className="text-red-500 text-sm mt-1">
            {errors.username.message}
          </p>
        )}
      </div>

      {/* EMAIL */}
      <div>
        <Input
          placeholder="Email"
          {...register("email")}
        />

        {errors.email && (
          <p className="text-red-500 text-sm mt-1">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* MOBILE */}
      <div>
        <Input
          placeholder="Mobile"
          {...register("mobile")}
        />

        {errors.mobile && (
          <p className="text-red-500 text-sm mt-1">
            {errors.mobile.message}
          </p>
        )}
      </div>

      {/* ADDRESS */}
      <div>
        <Input
          placeholder="Address"
          {...register("address")}
        />

        {errors.address && (
          <p className="text-red-500 text-sm mt-1">
            {errors.address.message}
          </p>
        )}
      </div>

      {/* ROLE */}
      <div>
        <Select
          value={watch("role")}
          onValueChange={(value) =>
            setValue("role", value as FormData["role"])
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Role" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="admin">
              Admin
            </SelectItem>

            <SelectItem value="mechanic">
              Mechanic
            </SelectItem>

            <SelectItem value="user">
              User
            </SelectItem>
          </SelectContent>
        </Select>

        {errors.role && (
          <p className="text-red-500 text-sm mt-1">
            {errors.role.message}
          </p>
        )}
      </div>

      {/* BUTTON */}
      <Button type="submit" className="col-span-3">
        {editingUser
          ? "Update User"
          : "Create User"}
      </Button>
    </form>
  );
}