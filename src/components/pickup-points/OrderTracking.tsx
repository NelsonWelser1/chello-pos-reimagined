
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Package, Clock, CheckCircle, MapPin, Phone, User } from "lucide-react";
import { useState } from "react";

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  pickupLocation: string;
  status: "preparing" | "ready" | "picked_up" | "expired";
  orderTime: string;
  readyTime?: string;
  items: string[];
  total: number;
}

export function OrderTracking() {
  const [searchTerm, setSearchTerm] = useState("");
  const [orders] = useState<Order[]>([
    {
      id: "ORD-001",
      customerName: "Alice Johnson",
      customerPhone: "(555) 111-2222",
      pickupLocation: "Downtown Hub",
      status: "ready",
      orderTime: "2:30 PM",
      readyTime: "3:15 PM",
      items: ["Burger Combo", "Chicken Wings", "Soda"],
      total: 24.99
    },
    {
      id: "ORD-002",
      customerName: "Bob Smith",
      customerPhone: "(555) 333-4444",
      pickupLocation: "Mall Location",
      status: "preparing",
      orderTime: "2:45 PM",
      items: ["Pizza Margherita", "Caesar Salad"],
      total: 18.50
    },
    {
      id: "ORD-003",
      customerName: "Carol Davis",
      customerPhone: "(555) 555-6666",
      pickupLocation: "Downtown Hub",
      status: "picked_up",
      orderTime: "1:15 PM",
      readyTime: "2:00 PM",
      items: ["Fish & Chips", "Iced Tea"],
      total: 15.75
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "preparing": return "bg-orange-500";
      case "ready": return "bg-green-500";
      case "picked_up": return "bg-blue-500";
      case "expired": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "preparing": return Clock;
      case "ready": return CheckCircle;
      case "picked_up": return Package;
      default: return Clock;
    }
  };

  const handleMarkReady = (orderId: string) => {
    console.log("Marking order as ready:", orderId);
  };

  const handleMarkPickedUp = (orderId: string) => {
    console.log("Marking order as picked up:", orderId);
  };

  const handleCallCustomer = (phone: string) => {
    console.log("Calling customer:", phone);
  };

  const filteredOrders = orders.filter(order =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.pickupLocation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Order Tracking</h2>
        <div className="relative w-80">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search orders, customers, or locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredOrders.map((order) => {
          const StatusIcon = getStatusIcon(order.status);
          return (
            <Card key={order.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-lg">{order.id}</CardTitle>
                    <Badge className={getStatusColor(order.status)}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {order.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">${order.total}</p>
                    <p className="text-sm text-gray-500">Order: {order.orderTime}</p>
                    {order.readyTime && (
                      <p className="text-sm text-green-600">Ready: {order.readyTime}</p>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-500" />
                      <span className="font-medium">{order.customerName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-green-500" />
                      <span className="text-sm">{order.customerPhone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-red-500" />
                      <span className="text-sm">{order.pickupLocation}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Order Items:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {order.items.map((item, index) => (
                        <li key={index}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t">
                  {order.status === "preparing" && (
                    <Button
                      onClick={() => handleMarkReady(order.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Mark Ready
                    </Button>
                  )}
                  {order.status === "ready" && (
                    <Button
                      onClick={() => handleMarkPickedUp(order.id)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Package className="w-4 h-4 mr-1" />
                      Mark Picked Up
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => handleCallCustomer(order.customerPhone)}
                  >
                    <Phone className="w-4 h-4 mr-1" />
                    Call Customer
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
