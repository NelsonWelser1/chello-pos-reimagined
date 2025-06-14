
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { 
  CreditCard, 
  Smartphone, 
  Banknote, 
  Gift, 
  Plus, 
  Settings,
  Trash2,
  CheckCircle,
  XCircle
} from "lucide-react";

export function PaymentMethodsList() {
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      name: "Credit/Debit Cards",
      type: "card",
      icon: CreditCard,
      enabled: true,
      processingFee: "2.9%",
      dailyLimit: "$10,000",
      status: "active",
      transactions: 145,
      revenue: "$3,250"
    },
    {
      id: 2,
      name: "Mobile Payments",
      type: "mobile",
      icon: Smartphone,
      enabled: true,
      processingFee: "2.5%",
      dailyLimit: "$5,000",
      status: "active",
      transactions: 87,
      revenue: "$1,890"
    },
    {
      id: 3,
      name: "Cash",
      type: "cash",
      icon: Banknote,
      enabled: true,
      processingFee: "0%",
      dailyLimit: "Unlimited",
      status: "active",
      transactions: 92,
      revenue: "$2,100"
    },
    {
      id: 4,
      name: "Gift Cards",
      type: "gift",
      icon: Gift,
      enabled: false,
      processingFee: "1%",
      dailyLimit: "$2,000",
      status: "inactive",
      transactions: 0,
      revenue: "$0"
    }
  ]);

  const toggleMethod = (id: number) => {
    setPaymentMethods(methods =>
      methods.map(method =>
        method.id === id
          ? { ...method, enabled: !method.enabled, status: !method.enabled ? "active" : "inactive" }
          : method
      )
    );
  };

  const addNewMethod = () => {
    console.log("Adding new payment method...");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Available Payment Methods</h2>
        <Button onClick={addNewMethod} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Payment Method
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paymentMethods.map((method) => (
          <Card key={method.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${method.enabled ? 'bg-blue-100' : 'bg-gray-100'}`}>
                    <method.icon className={`w-6 h-6 ${method.enabled ? 'text-blue-600' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{method.name}</CardTitle>
                    <Badge 
                      variant={method.status === "active" ? "default" : "secondary"}
                      className={method.status === "active" ? "bg-green-500" : "bg-gray-500"}
                    >
                      {method.status === "active" ? (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      ) : (
                        <XCircle className="w-3 h-3 mr-1" />
                      )}
                      {method.status}
                    </Badge>
                  </div>
                </div>
                <Switch
                  checked={method.enabled}
                  onCheckedChange={() => toggleMethod(method.id)}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Processing Fee</span>
                  <p className="font-semibold">{method.processingFee}</p>
                </div>
                <div>
                  <span className="text-gray-500">Daily Limit</span>
                  <p className="font-semibold">{method.dailyLimit}</p>
                </div>
                <div>
                  <span className="text-gray-500">Transactions</span>
                  <p className="font-semibold">{method.transactions}</p>
                </div>
                <div>
                  <span className="text-gray-500">Revenue</span>
                  <p className="font-semibold text-green-600">{method.revenue}</p>
                </div>
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Settings className="w-4 h-4 mr-1" />
                  Configure
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
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
