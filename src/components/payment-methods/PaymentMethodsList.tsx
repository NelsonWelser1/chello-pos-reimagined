
import { useState } from "react";
import { 
  CreditCard, 
  Smartphone, 
  Banknote, 
  Gift
} from "lucide-react";
import { PaymentMethodForm } from "./PaymentMethodForm";
import { PaymentGatewayForm } from "./PaymentGatewayForm";
import { PaymentRulesForm } from "./PaymentRulesForm";
import { PaymentMethodsActions } from "./PaymentMethodsActions";
import { PaymentMethodsGrid } from "./PaymentMethodsGrid";

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

  const handleEditMethod = (method: any) => {
    setEditingMethod(method);
    setShowMethodForm(true);
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
      <PaymentMethodsActions
        onShowRulesForm={() => setShowRulesForm(true)}
        onShowGatewayForm={() => setShowGatewayForm(true)}
        onShowMethodForm={() => setShowMethodForm(true)}
      />

      <PaymentMethodsGrid
        paymentMethods={paymentMethods}
        onToggleMethod={toggleMethod}
        onEditMethod={handleEditMethod}
      />

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
