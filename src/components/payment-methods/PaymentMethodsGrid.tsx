
import { PaymentMethodCard } from "./PaymentMethodCard";

interface PaymentMethod {
  id: string;
  name: string;
  type: string;
  icon: any;
  enabled: boolean;
  processingFee: string;
  dailyLimit: string;
  status: string;
  transactions: number;
  revenue: string;
}

interface PaymentMethodsGridProps {
  paymentMethods: PaymentMethod[];
  onToggleMethod: (id: string) => void;
  onEditMethod: (method: PaymentMethod) => void;
}

export function PaymentMethodsGrid({ 
  paymentMethods, 
  onToggleMethod, 
  onEditMethod 
}: PaymentMethodsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {paymentMethods.map((method) => (
        <PaymentMethodCard
          key={method.id}
          method={method}
          onToggle={onToggleMethod}
          onEdit={onEditMethod}
        />
      ))}
    </div>
  );
}
