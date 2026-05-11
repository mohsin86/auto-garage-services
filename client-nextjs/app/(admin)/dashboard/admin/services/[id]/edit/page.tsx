"use client";

import { useParams } from "next/navigation";

import { useQuery } from "@tanstack/react-query";

import ServiceForm from "../../ServiceForm";

const getService = async (
  id: string
) => {
  const res = await fetch(
    `/api/services/${id}`
  );

  return res.json();
};

export default function EditServicePage() {
  const params = useParams();

  const serviceQuery = useQuery({
    queryKey: ["service", params.id],

    queryFn: () =>
      getService(params.id as string),
  });

  if (serviceQuery.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <ServiceForm
      editingService={
        serviceQuery.data?.data
      }
      onSuccess = {() => {}}
    />
  );
}