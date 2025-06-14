
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ShoppingCart, 
  Coffee, 
  Users, 
  TrendingUp, 
  Settings, 
  PlusCircle,
  FileText,
  AlertTriangle
} from "lucide-react";

const quickActions = [
  { 
    label: "New Order", 
    icon: ShoppingCart, 
    color: "bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
    description: "Create new order"
  },
  { 
    label: "Add Item", 
    icon: PlusCircle, 
    color: "bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
    description: "Add menu item"
  },
  { 
    label: "Staff Management", 
    icon: Users, 
    color: "bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700",
    description: "Manage staff"
  },
  { 
    label: "Reports", 
    icon: FileText, 
    color: "bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700",
    description: "View analytics"
  },
  { 
    label: "Kitchen Display", 
    icon: Coffee, 
    color: "bg-gradient-to-br from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700",
    description: "Kitchen orders"
  },
  { 
    label: "Settings", 
    icon: Settings, 
    color: "bg-gradient-to-br from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700",
    description: "System settings"
  },
];

export function QuickActions() {
  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-slate-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-slate-700" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action) => (
            <Button
              key={action.label}
              className={`h-20 flex-col text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${action.color}`}
            >
              <action.icon className="w-6 h-6 mb-2" />
              <div className="text-center">
                <span className="font-medium text-sm">{action.label}</span>
                <p className="text-xs opacity-80">{action.description}</p>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
