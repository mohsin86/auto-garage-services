"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

// ---------------- TYPES ----------------
type ServiceStatus =
  | "pending"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled";

type ServiceItem = {
  title: string;
  cost: number;
  status: string;
};

export default function CreateServicePage() {
  const [form, setForm] = useState({
    status: "pending" as ServiceStatus,
    problemDescription: "",
    notes: "",
    serviceDate: "",
    deliveryDate: "",
    vehicleId: "",
    customerId: "",
    createdById: "",
  });

  const [items, setItems] = useState<ServiceItem[]>([
    { title: "", cost: 0, status: "pending" },
  ]);

  // ---------------- HANDLERS ----------------
  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleItemChange = (
    index: number,
    key: keyof ServiceItem,
    value: string | number
  ) => {
    const updated = [...items];
    (updated[index] as any)[key] = value;
    setItems(updated);
  };

  const addItem = () => {
    setItems([...items, { title: "", cost: 0, status: "pending" }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const payload = {
      ...form,
      items,
    };

    const res = await fetch("/api/services", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    console.log("Created Service:", data);
  };

  // ---------------- UI ----------------
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Create Service</h1>

      <Card className="p-6 space-y-4">
        {/* STATUS */}
        <div>
          <Label>Status</Label>
          <Select
            value={form.status}
            onValueChange={(v) => handleChange("status", v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* VEHICLE / CUSTOMER */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Vehicle ID</Label>
            <Input
              value={form.vehicleId}
              onChange={(e) => handleChange("vehicleId", e.target.value)}
            />
          </div>

          <div>
            <Label>Customer ID</Label>
            <Input
              value={form.customerId}
              onChange={(e) => handleChange("customerId", e.target.value)}
            />
          </div>
        </div>

        {/* DATES */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Service Date</Label>
            <Input
              type="date"
              value={form.serviceDate}
              onChange={(e) => handleChange("serviceDate", e.target.value)}
            />
          </div>

          <div>
            <Label>Delivery Date</Label>
            <Input
              type="date"
              value={form.deliveryDate}
              onChange={(e) => handleChange("deliveryDate", e.target.value)}
            />
          </div>
        </div>

        {/* DESCRIPTION */}
        <div>
          <Label>Problem Description</Label>
          <Textarea
            value={form.problemDescription}
            onChange={(e) =>
              handleChange("problemDescription", e.target.value)
            }
          />
        </div>

        <div>
          <Label>Notes</Label>
          <Textarea
            value={form.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
          />
        </div>

        {/* SERVICE ITEMS */}
        <div className="space-y-3">
          <h2 className="font-semibold">Service Items</h2>

          {items.map((item, index) => (
            <div key={index} className="grid grid-cols-3 gap-2 items-end">
              <Input
                placeholder="Title"
                value={item.title}
                onChange={(e) =>
                  handleItemChange(index, "title", e.target.value)
                }
              />

              <Input
                type="number"
                placeholder="Cost"
                value={item.cost}
                onChange={(e) =>
                  handleItemChange(index, "cost", Number(e.target.value))
                }
              />

              <Button
                type="button"
                variant="destructive"
                onClick={() => removeItem(index)}
              >
                Remove
              </Button>
            </div>
          ))}

          <Button type="button" onClick={addItem}>
            + Add Item
          </Button>
        </div>

        {/* SUBMIT */}
        <Button onClick={handleSubmit} className="w-full">
          Create Service
        </Button>
      </Card>
    </div>
  );
}