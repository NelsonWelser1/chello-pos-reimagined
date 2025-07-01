
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
  XCircle,
  Shield,
  Zap
} from "lucide-react";
import { PaymentMethodForm } from "./PaymentMethodForm";
import { PaymentGatewayForm } from "./PaymentGatewayForm";
import { PaymentRulesForm } from "./PaymentRulesForm";

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

  const [showMethodForm, setShowMethodForm] = useState(false);
  const [showGatewayForm, setShowGatewayForm] = useState(false);
  const [showRulesForm, setShowRulesForm] = useState(false);
  const [editingMethod, setEditingMethod] = useState(null);

  const toggleMethod = (id: number) => {
    setPaymentMethods(methods =>
      methods.map(method =>
        method.id === id
          ? { ...method, enabled: !method.enabled, status: !method.enabled ? "active" : "inactive" }
          : method
      )
    );
  };

  const handleAddMethod = (data: any) => {
    console.log("Adding payment method:", data);
  };

  const handleAddGateway = (data: any) => {
    console.log("Adding payment gateway:", data);
  };

  const handleAddRule = (data: any) => {
    console.log("Adding payment rule:", data);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Payment Methods Management</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowRulesForm(true)}
            className="flex items-center gap-2"
          >
            <Shield className="w-4 h-4" />
            Payment Rules
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowGatewayForm(true)}
            className="flex items-center gap-2"
          >
            <Zap className="w-4 h-4" />
            Add Gateway
          </Button>
          <Button 
            onClick={() => setShowMethodForm(true)} 
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Method
          </Button>
        </div>
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
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => {
                    setEditingMethod(method);
                    setShowMethodForm(true);
                  }}
                >
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

      <PaymentMethodForm
        isOpen={showMethodForm}
        onClose={() => {
          setShowMethodForm(false);
          setEditingMethod(null);
        }}
        onSubmit={handleAddMethod}
        editingMethod={editingMethod}
      />

      <PaymentGatewayForm
        isOpen={showGatewayForm}
        onClose={() => setShowGatewayForm(false)}
        onSubmit={handleAddGateway}
      />

      <PaymentRulesForm
        isOpen={showRulesForm}
        onClose={() => setShowRulesForm(false)}
        onSubmit={handleAddRule}
      />
    </div>
  );
}
