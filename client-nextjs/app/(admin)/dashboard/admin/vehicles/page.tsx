"use client";

import { useState } from "react";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import VehicleForm from "./VehicleForm";

import { Button } from "@/components/ui/button";

const getVehicles = async () => {
  const res = await fetch("/api/vehicles");

  if (!res.ok) {
    throw new Error(
      "Failed to fetch vehicles"
    );
  }

  return res.json();
};

const deleteVehicle = async (
  id: string
) => {
  const res = await fetch(
    `/api/vehicles/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!res.ok) {
    throw new Error(
      "Failed to delete vehicle"
    );
  }

  return res.json();
};

export default function VehiclesPage() {
  const queryClient = useQueryClient();

  const [editingVehicle, setEditingVehicle] =
    useState<any>(null);

  const vehiclesQuery = useQuery({
    queryKey: ["vehicles"],
    queryFn: getVehicles,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteVehicle,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["vehicles"],
      });
    },
  });

  if (vehiclesQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (
    vehiclesQuery.error instanceof Error
  ) {
    return (
      <div>
        {vehiclesQuery.error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <VehicleForm
        editingVehicle={editingVehicle}
        onSuccess={() => {
          setEditingVehicle(null);

          queryClient.invalidateQueries({
            queryKey: ["vehicles"],
          });
        }}
      />

      <div className="rounded-xl border bg-white p-6">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">
                Registration
              </th>

              <th className="text-left p-2">
                Brand
              </th>

              <th className="text-left p-2">
                Model
              </th>

              <th className="text-left p-2">
                Owner
              </th>

              <th className="text-left p-2">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {vehiclesQuery?.data?.data?.map(
              (vehicle: any) => (
                <tr
                  key={vehicle.id}
                  className="border-b"
                >
                  <td className="p-2">
                    {
                      vehicle.registrationNumber
                    }
                  </td>

                  <td className="p-2">
                    {vehicle.brand}
                  </td>

                  <td className="p-2">
                    {vehicle.model}
                  </td>

                  <td className="p-2">
                    {vehicle.owner?.name}
                  </td>

                  <td className="p-2 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setEditingVehicle(
                          vehicle
                        )
                      }
                    >
                      Edit
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() =>
                        deleteMutation.mutate(
                          vehicle.id
                        )
                      }
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}