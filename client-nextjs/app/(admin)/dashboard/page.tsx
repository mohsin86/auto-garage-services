import { Card, CardContent } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-bold">Users</h2>
          <p className="text-3xl mt-2">120</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-bold">Vehicles</h2>
          <p className="text-3xl mt-2">58</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-bold">Revenue</h2>
          <p className="text-3xl mt-2">$12,400</p>
        </CardContent>
      </Card>
    </div>
  );
}