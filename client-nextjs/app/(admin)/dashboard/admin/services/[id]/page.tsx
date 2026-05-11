"use client";

import { useParams } from "next/navigation";

import { useQuery } from "@tanstack/react-query";

import { Card } from "@/components/ui/card";

const getService = async (
  id: string
) => {
  const res = await fetch(
    `/api/services/${id}`
  );

  return res.json();
};

export default function ServiceViewPage() {
  const params = useParams();

  const serviceQuery = useQuery({
    queryKey: ["service", params.id],

    queryFn: () =>
      getService(params.id as string),
  });

  const service =
    serviceQuery.data?.data;

  return (
    <Card className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">
        Service Details
      </h1>

      <p>
        Status: {service?.status}
      </p>

      <p>
        Vehicle:
        {
          service?.vehicle
            ?.registrationNumber
        }
      </p>

      <p>
        Customer:
        {service?.customer?.name}
      </p>

      <p>
        Problem:
        {
          service?.problemDescription
        }
      </p>

      <div>
        <h2 className="font-semibold">
          Items
        </h2>

        {service?.items?.map(
          (item: any) => (
            <div key={item.id}>
              {item.title} - $
              {item.cost}
            </div>
          )
        )}
      </div>
    </Card>
  );
}