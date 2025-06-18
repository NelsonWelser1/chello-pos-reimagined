
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Banknote } from "lucide-react";

interface PaymentMethodSelectorProps {
  selectedMethod: 'cash' | 'card';
  onMethodChange: (method: 'cash' | 'card') => void;
}

export default function PaymentMethodSelector({ 
  selectedMethod, 
  onMethodChange 
}: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="text-sm font-medium">Payment Method</div>
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant={selectedMethod === 'card' ? 'default' : 'outline'}
          onClick={() => onMethodChange('card')}
          className="flex items-center gap-2 h-12"
        >
          <CreditCard className="w-5 h-5" />
          Card
        </Button>
        <Button
          variant={selectedMethod === 'cash' ? 'default' : 'outline'}
          onClick={() => onMethodChange('cash')}
          className="flex items-center gap-2 h-12"
        >
          <Banknote className="w-5 h-5" />
          Cash
        </Button>
      </div>
    </div>
  );
}
