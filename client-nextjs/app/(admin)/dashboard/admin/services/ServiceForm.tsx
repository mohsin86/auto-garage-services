"use client";

import { useEffect } from "react";

import { useFieldArray,  useForm, Controller  } from "react-hook-form";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { useRouter } from "next/navigation";

import { Card, } from "@/components/ui/card";

import { Input, } from "@/components/ui/input";

import { Button, } from "@/components/ui/button";

import { Textarea, } from "@/components/ui/textarea";

import { Label, } from "@/components/ui/label";

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

const itemSchema = z.object({
  title: z.string().min(1),

  cost: z.coerce.number(),

  status: z.string(),
});

const schema = z.object({
  status: z.enum([
    "pending",
    "confirmed",
    "in_progress",
    "completed",
    "cancelled",
  ]),

  problemDescription:
    z.string().optional(),

    notes: z.string().optional(),

    serviceDate: z.string(),

    deliveryDate: z.string(),

    vehicleId: z.string().min(1),

    customerId: z.string().min(1),

    items: z.array(itemSchema),
});

type FormData = z.infer<typeof schema>;

type Props = {
  editingService?: any;
  onSuccess?: () => void;
};

// ======================================================
// API
// ======================================================

const getVehicles = async () => {
  const res = await fetch(
    "/api/vehicles"
  );

  if (!res.ok) {
    throw new Error(
      "Failed to fetch vehicles"
    );
  }

  const data = await res.json();

  return data.data;
};

const saveService = async ({
  data,
  editingService,
}: {
  data: FormData;
  editingService?: any;
}) => {
  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const payload = {
    ...data,
    serviceDate: data.serviceDate,
    deliveryDate: data.deliveryDate,
    createdById: user.id,
  };

  let res;

  if (editingService) {
    res = await fetch(
      `/api/services/${editingService.id}`,
      {
        method: "PATCH",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify(payload),
      }
    );
  } else {
    res = await fetch(
      "/api/services",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify(payload),
      }
    );
  }

  if (!res.ok) {
    throw new Error(
      "Failed to save service"
    );
  }

  return res.json();
};

const formatDate = (date: string) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export default function ServiceForm({ editingService,}: Props) {
  const router = useRouter();

  const queryClient =
    useQueryClient();

  // ======================================================
  // FORM
  // ======================================================

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<FormData>({
    resolver:
      zodResolver(schema),

    defaultValues: {
      status: "pending",

      items: [
        {
          title: "",
          cost: 0,
          status: "pending",
        },
      ],
    },
  });

  // ======================================================
  // FIELD ARRAY
  // ======================================================

  const {
    fields,
    append,
    remove,
  } = useFieldArray({
    control,

    name: "items",
  });

  // ======================================================
  // FETCH VEHICLES
  // ======================================================

  const vehiclesQuery = useQuery({
    queryKey: ["vehicles"],

    queryFn: getVehicles,
  });

  // ======================================================
  // EDIT MODE
  // ======================================================

  useEffect(() => {
    if (
        editingService &&
        vehiclesQuery.data
    ) {
        reset({
        status:
            editingService.status,

        problemDescription:
            editingService.problemDescription,

        notes:
            editingService.notes,

        serviceDate: editingService.serviceDate ? formatDate(editingService.serviceDate)  : "",

       deliveryDate: editingService.deliveryDate  ? formatDate(editingService.deliveryDate)  : "",

        vehicleId: String(
            editingService.vehicle?.id || ""
        ),

        customerId: String(
            editingService.customer?.id || ""
        ),

        items:
            editingService.items || [],
        });
    }
    }, [
        editingService,
        vehiclesQuery.data,
        reset,
    ]);
  // ======================================================
  // MUTATION
  // ======================================================

  const mutation = useMutation({
    mutationFn: saveService,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["services"],
      });

    //   router.push(
    //     "/dashboard/admin/services"
    //   );
    },
  });

  // ======================================================
  // SUBMIT
  // ======================================================

  const onSubmit = (
    data: FormData
  ) => {
    mutation.mutate({
      data,
      editingService,
    });
  };

  // ======================================================
  // UI
  // ======================================================

  return (
    <Card className="p-6">
      <form
        onSubmit={handleSubmit( onSubmit )}
        className="space-y-6"
      >
        {/* STATUS */}
        <div>
          <Label>Status</Label>
            <Controller
            control={control}
            name="status"
            render={({ field }) => (
                <Select
                value={field.value}
                onValueChange={field.onChange}
                >
                <SelectTrigger>
                    <SelectValue />
                </SelectTrigger>

                <SelectContent className="bg-white z-50">
                    <SelectItem value="pending">
                    Pending
                    </SelectItem>

                    <SelectItem value="confirmed">
                    Confirmed
                    </SelectItem>

                    <SelectItem value="in_progress">
                    In Progress
                    </SelectItem>

                    <SelectItem value="completed">
                    Completed
                    </SelectItem>

                    <SelectItem value="cancelled">
                    Cancelled
                    </SelectItem>
                </SelectContent>
                </Select>
            )}
            />      
        </div>

        {/* VEHICLE */}
        <div>
          <Label>Vehicle</Label>
            <Controller
                    control={control}
                    name="vehicleId"
                    render={({ field }) => (
                        <Select
                        value={field.value || ""}
                        onValueChange={(v) => {
                            const vehicle =
                            vehiclesQuery.data?.find(
                                (x: any) =>
                                String(x.id) === v
                            );

                            field.onChange(v);

                            setValue(
                            "customerId",
                            String(
                                vehicle?.owner?.id || ""
                            )
                            );
                        }}
                        >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Vehicle" />
                        </SelectTrigger>

                        <SelectContent className="bg-white z-50">
                            {vehiclesQuery.data?.map(
                            (vehicle: any) => (
                                <SelectItem
                                key={vehicle.id}
                                value={String(vehicle.id)}
                                >
                                {vehicle.registrationNumber}
                                {" - "}
                                {vehicle.brand}
                                {" "}
                                {vehicle.model}
                                </SelectItem>
                            )
                            )}
                        </SelectContent>
                        </Select>
                    )}
                    />
        </div>

        {/* DATES */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>
              Service Date
            </Label>

            <Input
              type="date"
              {...register("serviceDate")}
            />
          </div>

          <div>
            <Label>
              Delivery Date
            </Label>

            <Input
              type="date"
              {...register("deliveryDate")}
            />
          </div>
        </div>

        {/* DESCRIPTION */}
        <div>
          <Label>
            Problem Description
          </Label>

          <Textarea
            {...register("problemDescription" )}
          />
        </div>

        <div>
          <Label>Notes</Label>

          <Textarea
            {...register("notes")}
          />
        </div>

        {/* ITEMS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">
              Service Items
            </h2>

            <Button
              type="button"
              onClick={() =>
                append({
                  title: "",
                  cost: 0,
                  status:
                    "pending",
                })
              }
            >
              + Add Item
            </Button>
          </div>

          {fields.map(
            (field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-4 gap-3"
              >
                <Input
                  placeholder="Title"
                  {...register(
                    `items.${index}.title`
                  )}
                />

                <Input
                  type="number"
                  {...register(
                    `items.${index}.cost`,
                    {
                      valueAsNumber: true,
                    }
                  )}
                />

                <Select
                  value={watch(
                    `items.${index}.status`
                  )}
                  onValueChange={(
                    v
                  ) =>
                    setValue(
                      `items.${index}.status`,
                      v
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent className="bg-white z-50">
                    <SelectItem value="pending">
                      Pending
                    </SelectItem>

                    <SelectItem value="completed">
                      Completed
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  type="button"
                  variant="destructive"
                  onClick={() =>
                    remove(index)
                  }
                >
                  Remove
                </Button>
              </div>
            )
          )}
        </div>

        {/* SUBMIT */}
        <Button
          type="submit"
          className="w-full"
          disabled={
            isSubmitting ||
            mutation.isPending
          }
        >
          {editingService
            ? "Update Service"
            : "Create Service"}
        </Button>
      </form>
    </Card>
  );
}