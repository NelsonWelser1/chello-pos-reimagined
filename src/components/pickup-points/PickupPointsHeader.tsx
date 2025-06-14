
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Package, Settings, BarChart3, Clock, CheckCircle } from "lucide-react";

interface PickupPointsHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function PickupPointsHeader({ activeTab, setActiveTab }: PickupPointsHeaderProps) {
  const tabs = [
    { id: "locations", label: "Pickup Locations", icon: MapPin },
    { id: "orders", label: "Order Tracking", icon: Package },
    { id: "manager", label: "Location Manager", icon: Settings },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pickup Points</h1>
          <p className="text-gray-600 mt-1">Manage pickup locations, track orders, and optimize delivery operations</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-medium">Pending Orders:</span>
            <Badge className="bg-orange-500">12</Badge>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium">Ready for Pickup:</span>
            <Badge className="bg-green-500">8</Badge>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2"
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
