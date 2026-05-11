"use client";

import Link from "next/link";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { Button } from "@/components/ui/button";

const getServices = async () => {
  const res = await fetch("/api/services");

  if (!res.ok) {
    throw new Error("Failed");
  }

  return res.json();
};

const deleteService = async (
  id: string
) => {
  const res = await fetch(
    `/api/services/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!res.ok) {
    throw new Error("Delete failed");
  }

  return res.json();
};

export default function ServicesPage() {
  const queryClient = useQueryClient();

  const servicesQuery = useQuery({
    queryKey: ["services"],
    queryFn: getServices,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteService,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["services"],
      });
    },
  });

  if (servicesQuery.isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        Loading services...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">
          Services
        </h1>

        <Link
          href="/dashboard/admin/services/create"
        >
          <Button>
            Add Service
          </Button>
        </Link>
      </div>

      <div className="rounded-xl border bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="p-3 text-left">
                Vehicle
              </th>

              <th className="p-3 text-left">
                Status
              </th>

              <th className="p-3 text-left">
                Customer
              </th>

              <th className="p-3 text-left">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {servicesQuery.data?.data?.map(
              (service: any) => (
                <tr
                  key={service.id}
                  className="border-b"
                >
                  <td className="p-3">
                    {
                      service.vehicle
                        ?.registrationNumber
                    }
                  </td>

                  <td className="p-3 capitalize">
                    {service.status}
                  </td>

                  <td className="p-3">
                    {
                      service.customer
                        ?.name
                    }
                  </td>

                  <td className="p-3 flex gap-2">
                    <Link
                      href={`/dashboard/admin/services/${service.id}`}
                    >
                      <Button
                        size="sm"
                        variant="outline"
                      >
                        View
                      </Button>
                    </Link>

                    <Link
                      href={`/dashboard/admin/services/${service.id}/edit`}
                    >
                      <Button size="sm">
                        Edit
                      </Button>
                    </Link>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() =>
                        deleteMutation.mutate(
                          service.id
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