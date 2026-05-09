"use client";

import { useQuery } from "@tanstack/react-query";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

// ======================================================
// GET VEHICLES
// ======================================================

const getVehicles = async () => {
  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const res = await fetch(
    `/api/customer/vehicles?ownerId=${user.id}`
  );

  if (!res.ok) {
    throw new Error(
      "Failed to fetch vehicles"
    );
  }

  return res.json();
};

export default function CustomerVehiclesPage() {
  const vehiclesQuery = useQuery({
    queryKey: ["customerVehicles"],

    queryFn: getVehicles,
  });

  // ======================================================
  // LOADING
  // ======================================================

  if (vehiclesQuery.isLoading) {
    return <div>Loading...</div>;
  }

  // ======================================================
  // ERROR
  // ======================================================

  if (
    vehiclesQuery.error instanceof Error
  ) {
    return (
      <div>
        {vehiclesQuery.error.message}
      </div>
    );
  }

  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          My Vehicles
        </h1>

        <p className="text-sm text-gray-500">
          View your registered vehicles
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {vehiclesQuery.data?.map(
          (vehicle: any) => (
            <Card key={vehicle.id}>
              <CardContent className="space-y-2 p-6">
                <div>
                  <h2 className="text-lg font-semibold">
                    {vehicle.brand}{" "}
                    {vehicle.model}
                  </h2>

                  <p className="text-sm text-gray-500">
                    {
                      vehicle.registrationNumber
                    }
                  </p>
                </div>

                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-medium">
                      Year:
                    </span>{" "}
                    {vehicle.year}
                  </p>

                  <p>
                    <span className="font-medium">
                      Color:
                    </span>{" "}
                    {vehicle.color ||
                      "N/A"}
                  </p>

                  <p>
                    <span className="font-medium">
                      Mileage:
                    </span>{" "}
                    {vehicle.mileage ||
                      "N/A"}
                  </p>
                </div>
              </CardContent>
            </Card>
          )
        )}
      </div>

      {!vehiclesQuery.data?.length && (
        <div className="text-sm text-gray-500">
          No vehicles found.
        </div>
      )}
    </div>
  );
}