
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Settings, History, BarChart3, Shield, DollarSign } from "lucide-react";

interface PaymentMethodsHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function PaymentMethodsHeader({ activeTab, setActiveTab }: PaymentMethodsHeaderProps) {
  const tabs = [
    { id: "methods", label: "Payment Methods", icon: CreditCard },
    { id: "configuration", label: "Configuration", icon: Settings },
    { id: "transactions", label: "Transactions", icon: History },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment Methods</h1>
          <p className="text-gray-600 mt-1">Manage payment options, configurations, and transaction processing</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium">Security:</span>
            <Badge className="bg-green-500">Active</Badge>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium">Today's Revenue:</span>
            <Badge className="bg-blue-500">$2,847</Badge>
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
