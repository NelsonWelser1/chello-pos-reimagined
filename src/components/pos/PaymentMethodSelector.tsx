
import { CreditCard, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PaymentMethodSelectorProps {
  paymentMethod: 'cash' | 'card';
  onPaymentMethodChange: (method: 'cash' | 'card') => void;
}

export default function PaymentMethodSelector({
  paymentMethod,
  onPaymentMethodChange
}: PaymentMethodSelectorProps) {
  return (
    <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl font-black text-slate-800">Payment Method</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant={paymentMethod === 'card' ? 'default' : 'outline'}
            onClick={() => onPaymentMethodChange('card')}
            className="flex flex-col items-center p-6 h-auto"
          >
            <CreditCard className="w-8 h-8 mb-2" />
            <span className="font-bold">Card</span>
          </Button>
          <Button
            variant={paymentMethod === 'cash' ? 'default' : 'outline'}
            onClick={() => onPaymentMethodChange('cash')}
            className="flex flex-col items-center p-6 h-auto"
          >
            <DollarSign className="w-8 h-8 mb-2" />
            <span className="font-bold">Cash</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
