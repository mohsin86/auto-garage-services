"use client";

import { useEffect, useState } from "react";

type Invoice = {
  id: string;
  totalAmount: number;
  paymentStatus: "paid" | "unpaid" | "partial";
  createdAt: string;
  service: {
    id: string;
  };
  generatedBy: {
    id: string;
    name: string;
  };
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const res = await fetch("http://localhost:3000/invoices", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      setInvoices(data);
    } catch (error) {
      console.error("Failed to load invoices", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    await fetch(`http://localhost:3000/invoices/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ paymentStatus: status }),
    });

    fetchInvoices();
  };

  if (loading) {
    return <p className="p-6">Loading invoices...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Invoices</h1>

      <div className="grid gap-4">
        {invoices.map((inv) => (
          <div
            key={inv.id}
            className="border rounded-xl p-4 shadow-sm flex justify-between items-center"
          >
            {/* LEFT SIDE */}
            <div>
              <p className="font-semibold">
                Invoice #{inv.id.slice(0, 6)}
              </p>

              <p className="text-sm text-gray-500">
                Service ID: {inv.service?.id}
              </p>

              <p className="text-sm text-gray-500">
                Created By: {inv.generatedBy?.name}
              </p>

              <p className="text-sm text-gray-500">
                Date: {new Date(inv.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* RIGHT SIDE */}
            <div className="text-right">
              <p className="text-lg font-bold">
                ৳ {inv.totalAmount}
              </p>

              <span
                className={`text-sm px-2 py-1 rounded ${
                  inv.paymentStatus === "paid"
                    ? "bg-green-100 text-green-700"
                    : inv.paymentStatus === "unpaid"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {inv.paymentStatus}
              </span>

              {/* ACTIONS */}
              <div className="mt-2 space-x-2">
                <button
                  onClick={() => updateStatus(inv.id, "paid")}
                  className="px-2 py-1 text-xs bg-green-500 text-white rounded"
                >
                  Mark Paid
                </button>

                <button
                  onClick={() => updateStatus(inv.id, "unpaid")}
                  className="px-2 py-1 text-xs bg-red-500 text-white rounded"
                >
                  Unpaid
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}