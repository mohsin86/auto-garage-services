"use client";

import { useEffect } from "react";

import { useForm } from "react-hook-form";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import {  useQuery, } from "@tanstack/react-query";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ======================================================
// ZOD
// ======================================================

const schema = z.object({
  registrationNumber: z
    .string()
    .min(2, "Registration required"),

  vinNumber: z.string().optional(),

  brand: z
    .string()
    .min(2, "Brand required"),

  model: z
    .string()
    .min(1, "Model required"),

  year: z
    .string()
    .min(4, "Year required"),

  color: z.string().optional(),

  engineNumber: z.string().optional(),

  chassisNumber: z.string().optional(),

  mileage: z.string().optional(),

  ownerId: z
    .string()
    .min(1, "Owner required"),
});

type FormData = z.infer<typeof schema>;

type Props = {
     editingVehicle?: any;

      onSuccess: () => void;
};

// ======================================================
// GET USERS
// ======================================================

const getUsers = async () => {
  const res = await fetch("/api/user");

  if (!res.ok) {
    throw new Error(
      "Failed to fetch users"
    );
  }

  return res.json();
};

export default function VehicleForm({
  editingVehicle,
  onSuccess,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<FormData>({
    resolver: zodResolver(schema),

    defaultValues: {
      registrationNumber: "",
      vinNumber: "",
      brand: "",
      model: "",
      year: "",
      color: "",
      engineNumber: "",
      chassisNumber: "",
      mileage: "",
      ownerId: "",
    },
  });

  // ======================================================
  // USERS QUERY
  // ======================================================

  const usersQuery = useQuery({
    queryKey: ["users"],

    queryFn: getUsers,
  });

  // ======================================================
  // EDIT MODE
  // ======================================================

  useEffect(() => {
    if (editingVehicle) {
      reset({
          registrationNumber:
            editingVehicle.registrationNumber || "",

          vinNumber:
            editingVehicle.vinNumber || "",

          brand:
            editingVehicle.brand || "",

          model:
            editingVehicle.model || "",

          year:
            editingVehicle.year || "",

          color:
            editingVehicle.color || "",

          engineNumber:
            editingVehicle.engineNumber || "",

          chassisNumber:
            editingVehicle.chassisNumber || "",

          mileage:
            editingVehicle.mileage || "",

          ownerId:
            editingVehicle.owner?.id || "",
        });
    }
  }, [editingVehicle, reset]);

  // ======================================================
  // SUBMIT
  // ======================================================

  async function onSubmit(data: FormData) {
    let res;

    if (editingVehicle) {
      res = await fetch(
        `/api/vehicles/${editingVehicle.id}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(data),
        }
      );
    } else {
      res = await fetch("/api/vehicles", {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify(data),
      });
    }

    if (!res.ok) {
      console.error(
        "Failed to save vehicle"
      );

      return;
    }

    reset();

    onSuccess();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="
        grid grid-cols-1 md:grid-cols-3
        gap-4 rounded-xl border
        bg-white p-6
      "
    >
      {/* REGISTRATION */}
      <div>
        <Input
          placeholder="Registration Number"
          {...register(
            "registrationNumber"
          )}
        />

        {errors.registrationNumber && (
          <p className="mt-1 text-sm text-red-500">
            {
              errors
                .registrationNumber
                .message
            }
          </p>
        )}
      </div>

      {/* BRAND */}
      <div>
        <Input
          placeholder="Brand"
          {...register("brand")}
        />

        {errors.brand && (
          <p className="mt-1 text-sm text-red-500">
            {errors.brand.message}
          </p>
        )}
      </div>

      {/* MODEL */}
      <div>
        <Input
          placeholder="Model"
          {...register("model")}
        />

        {errors.model && (
          <p className="mt-1 text-sm text-red-500">
            {errors.model.message}
          </p>
        )}
      </div>

      {/* YEAR */}
      <div>
        <Input
          placeholder="Year"
          {...register("year")}
        />

        {errors.year && (
          <p className="mt-1 text-sm text-red-500">
            {errors.year.message}
          </p>
        )}
      </div>
      
      <div>
        <Input
          placeholder="VIN Number"
          {...register("vinNumber")}
        />
      </div>

      <div>
        <Input
          placeholder="Color"
          {...register("color")}
        />
      </div>

      <div>
        <Input
          placeholder="Engine Number"
          {...register("engineNumber")}
        />
      </div>

      <div>
        <Input
          placeholder="Chassis Number"
          {...register("chassisNumber")}
        />
      </div>

      <div>
        <Input
          placeholder="Mileage"
          {...register("mileage")}
        />
      </div>

      {/* OWNER SELECT */}
      <div>
        <Select
          value={watch("ownerId")}
          onValueChange={(value) =>
            setValue("ownerId", value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Owner" />
          </SelectTrigger>

          <SelectContent className="z-50 bg-white">
            {usersQuery.data?.data?.map(
              (user: any) => (
                <SelectItem
                  key={user.id}
                  value={user.id}
                >
                  {user.name}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>

        {errors.ownerId && (
          <p className="mt-1 text-sm text-red-500">
            {errors.ownerId.message}
          </p>
        )}
      </div>

      {/* BUTTON */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="md:col-span-3"
      >
        {isSubmitting
          ? "Saving..."
          : editingVehicle
          ? "Update Vehicle"
          : "Create Vehicle"}
      </Button>
    </form>
  );
}