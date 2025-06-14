
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Truck, Calendar, DollarSign, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { toast } from "sonner";

interface ReorderRule {
  id: string;
  ingredientName: string;
  supplier: string;
  reorderPoint: number;
  reorderQuantity: number;
  autoReorderEnabled: boolean;
  lastReorder: string;
  status: 'pending' | 'ordered' | 'delivered' | 'cancelled';
  estimatedDelivery: string;
  cost: number;
}

export default function AutomatedReorderSystem() {
  const [reorderRules, setReorderRules] = useState<ReorderRule[]>([
    {
      id: "1",
      ingredientName: "Fresh Tomatoes",
      supplier: "Fresh Farm Co",
      reorderPoint: 10,
      reorderQuantity: 50,
      autoReorderEnabled: true,
      lastReorder: "2024-06-15",
      status: "ordered",
      estimatedDelivery: "2024-06-17",
      cost: 175.00
    },
    {
      id: "2",
      ingredientName: "Chicken Breast",
      supplier: "Premium Poultry",
      reorderPoint: 8,
      reorderQuantity: 25,
      autoReorderEnabled: true,
      lastReorder: "2024-06-16",
      status: "pending",
      estimatedDelivery: "2024-06-18",
      cost: 224.75
    },
    {
      id: "3",
      ingredientName: "Olive Oil",
      supplier: "Mediterranean Oils",
      reorderPoint: 5,
      reorderQuantity: 15,
      autoReorderEnabled: false,
      lastReorder: "2024-05-20",
      status: "delivered",
      estimatedDelivery: "2024-05-22",
      cost: 131.25
    }
  ]);

  const toggleAutoReorder = (id: string) => {
    setReorderRules(prev => prev.map(rule => 
      rule.id === id 
        ? { ...rule, autoReorderEnabled: !rule.autoReorderEnabled }
        : rule
    ));
    toast.success("Auto-reorder setting updated");
  };

  const manualReorder = (id: string) => {
    setReorderRules(prev => prev.map(rule => 
      rule.id === id 
        ? { 
            ...rule, 
            status: 'ordered', 
            lastReorder: new Date().toISOString().split('T')[0],
            estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          }
        : rule
    ));
    toast.success("Manual reorder initiated");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'ordered': return 'bg-blue-500';
      case 'delivered': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'ordered': return <Truck className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const totalPendingOrders = reorderRules.filter(rule => rule.status === 'pending' || rule.status === 'ordered').length;
  const totalOrderValue = reorderRules
    .filter(rule => rule.status === 'pending' || rule.status === 'ordered')
    .reduce((sum, rule) => sum + rule.cost, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Active Orders</p>
                <p className="text-2xl font-bold">{totalPendingOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Order Value</p>
                <p className="text-2xl font-bold">${totalOrderValue.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Auto-Enabled</p>
                <p className="text-2xl font-bold">
                  {reorderRules.filter(rule => rule.autoReorderEnabled).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Automated Reorder Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reorderRules.map(rule => (
              <div key={rule.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">{rule.ingredientName}</h3>
                    <Badge className={`${getStatusColor(rule.status)} text-white`}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(rule.status)}
                        {rule.status}
                      </div>
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Auto-reorder</span>
                      <Switch
                        checked={rule.autoReorderEnabled}
                        onCheckedChange={() => toggleAutoReorder(rule.id)}
                      />
                    </div>
                    {!rule.autoReorderEnabled && rule.status !== 'ordered' && (
                      <Button
                        size="sm"
                        onClick={() => manualReorder(rule.id)}
                      >
                        Reorder Now
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Supplier</p>
                    <p className="font-medium">{rule.supplier}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Reorder Point</p>
                    <p className="font-medium">{rule.reorderPoint} units</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Order Quantity</p>
                    <p className="font-medium">{rule.reorderQuantity} units</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Estimated Cost</p>
                    <p className="font-medium">${rule.cost.toFixed(2)}</p>
                  </div>
                </div>
                
                {(rule.status === 'ordered' || rule.status === 'pending') && (
                  <div className="mt-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        Expected delivery: {new Date(rule.estimatedDelivery).toLocaleDateString()}
                      </span>
                    </div>
                    <Progress value={rule.status === 'ordered' ? 60 : 30} className="h-2" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
