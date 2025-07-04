
import { useState } from "react";
import { 
  CreditCard, 
  Smartphone, 
  Banknote, 
  Gift,
  Building2,
  Coins
} from "lucide-react";
import { PaymentMethodForm } from "./PaymentMethodForm";
import { PaymentGatewayForm } from "./PaymentGatewayForm";
import { PaymentRulesForm } from "./PaymentRulesForm";
import { PaymentMethodsActions } from "./PaymentMethodsActions";
import { PaymentMethodsGrid } from "./PaymentMethodsGrid";
import { usePaymentMethods } from "@/hooks/usePaymentMethods";
import { PaymentMethodFormData } from "./forms/PaymentMethodFormSchema";

const getIconForType = (type: string) => {
  switch (type) {
    case 'card':
      return CreditCard;
    case 'mobile':
      return Smartphone;
    case 'cash':
      return Banknote;
    case 'gift':
      return Gift;
    case 'bank_transfer':
      return Building2;
    case 'crypto':
      return Coins;
    default:
      return CreditCard;
  }
};

const getStatusFromEnabled = (enabled: boolean) => enabled ? 'active' : 'inactive';

export function PaymentMethodsList() {
  const { paymentMethods, loading, addPaymentMethod, updatePaymentMethod, togglePaymentMethod } = usePaymentMethods();
  const [showMethodForm, setShowMethodForm] = useState(false);
  const [showGatewayForm, setShowGatewayForm] = useState(false);
  const [showRulesForm, setShowRulesForm] = useState(false);
  const [editingMethod, setEditingMethod] = useState(null);

  // Transform database payment methods to match the grid component interface
  const transformedPaymentMethods = paymentMethods.map((method) => ({
    id: method.id,
    name: method.name,
    type: method.type,
    icon: getIconForType(method.type),
    enabled: method.enabled,
    processingFee: `${method.processing_fee_percentage}%${method.processing_fee_fixed > 0 ? ` + $${method.processing_fee_fixed}` : ''}`,
    dailyLimit: method.daily_limit ? `$${method.daily_limit.toLocaleString()}` : 'No limit',
    status: getStatusFromEnabled(method.enabled),
    transactions: 0, // This would come from actual transaction data
    revenue: "$0", // This would come from actual transaction data
    // Include original data for editing
    originalData: method
  }));

  const handleToggleMethod = async (id: string) => {
    await togglePaymentMethod(id);
  };

  const handleEditMethod = (method: any) => {
    setEditingMethod(method.originalData);
    setShowMethodForm(true);
  };

  const handleAddMethod = async (data: PaymentMethodFormData) => {
    const success = await addPaymentMethod(data);
    if (success) {
      setShowMethodForm(false);
      setEditingMethod(null);
    }
  };

  const handleUpdateMethod = async (data: PaymentMethodFormData) => {
    if (editingMethod) {
      const success = await updatePaymentMethod(editingMethod.id, data);
      if (success) {
        setShowMethodForm(false);
        setEditingMethod(null);
      }
    }
  };

  const handleAddGateway = (data: any) => {
    console.log("Adding payment gateway:", data);
  };

  const handleAddRule = (data: any) => {
    console.log("Adding payment rule:", data);
  };

  if (loading) {
    return <div>Loading payment methods...</div>;
  }

  return (
    <div className="space-y-6">
      <PaymentMethodsActions
        onShowRulesForm={() => setShowRulesForm(true)}
        onShowGatewayForm={() => setShowGatewayForm(true)}
        onShowMethodForm={() => setShowMethodForm(true)}
      />

      <PaymentMethodsGrid
        paymentMethods={transformedPaymentMethods}
        onToggleMethod={handleToggleMethod}
        onEditMethod={handleEditMethod}
      />

      <PaymentMethodForm
        isOpen={showMethodForm}
        onClose={() => {
          setShowMethodForm(false);
          setEditingMethod(null);
        }}
        onSubmit={editingMethod ? handleUpdateMethod : handleAddMethod}
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
