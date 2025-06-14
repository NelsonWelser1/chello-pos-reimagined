
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, Settings, Calendar, BarChart3, Users, Clock } from "lucide-react";

interface ServiceTablesHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function ServiceTablesHeader({ activeTab, setActiveTab }: ServiceTablesHeaderProps) {
  const tabs = [
    { id: "layout", label: "Table Layout", icon: Table },
    { id: "management", label: "Management", icon: Settings },
    { id: "reservations", label: "Reservations", icon: Calendar },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Service Tables</h1>
          <p className="text-gray-600 mt-1">Manage restaurant tables, reservations, and seating arrangements</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium">Current Occupancy:</span>
            <Badge className="bg-blue-500">68%</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium">Avg Wait Time:</span>
            <Badge className="bg-green-500">12 min</Badge>
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
