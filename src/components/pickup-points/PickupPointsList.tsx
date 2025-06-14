
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Users, Package, Edit, Trash2, Plus } from "lucide-react";
import { useState } from "react";

interface PickupPoint {
  id: string;
  name: string;
  address: string;
  status: "active" | "inactive" | "maintenance";
  orders: number;
  capacity: number;
  openHours: string;
  manager: string;
  phone: string;
}

export function PickupPointsList() {
  const [pickupPoints] = useState<PickupPoint[]>([
    {
      id: "1",
      name: "Downtown Hub",
      address: "123 Main St, Downtown",
      status: "active",
      orders: 15,
      capacity: 50,
      openHours: "8:00 AM - 10:00 PM",
      manager: "John Smith",
      phone: "(555) 123-4567"
    },
    {
      id: "2",
      name: "Mall Location",
      address: "456 Shopping Center Dr",
      status: "active",
      orders: 8,
      capacity: 30,
      openHours: "10:00 AM - 9:00 PM",
      manager: "Sarah Johnson",
      phone: "(555) 987-6543"
    },
    {
      id: "3",
      name: "University Campus",
      address: "789 College Ave",
      status: "maintenance",
      orders: 0,
      capacity: 40,
      openHours: "9:00 AM - 8:00 PM",
      manager: "Mike Wilson",
      phone: "(555) 456-7890"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "inactive": return "bg-red-500";
      case "maintenance": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  const handleEdit = (id: string) => {
    console.log("Editing pickup point:", id);
  };

  const handleDelete = (id: string) => {
    console.log("Deleting pickup point:", id);
  };

  const handleAddNew = () => {
    console.log("Adding new pickup point");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Pickup Locations</h2>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add New Location
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {pickupPoints.map((point) => (
          <Card key={point.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{point.name}</CardTitle>
                <Badge className={getStatusColor(point.status)}>
                  {point.status.charAt(0).toUpperCase() + point.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                <span className="text-sm text-gray-600">{point.address}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-blue-500" />
                  <span>{point.orders} Orders</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-green-500" />
                  <span>{point.capacity} Capacity</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-orange-500" />
                <span>{point.openHours}</span>
              </div>

              <div className="pt-2 border-t">
                <p className="text-sm text-gray-600">Manager: {point.manager}</p>
                <p className="text-sm text-gray-600">{point.phone}</p>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(point.id)}
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(point.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
