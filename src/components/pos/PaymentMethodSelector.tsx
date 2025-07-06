
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Banknote } from "lucide-react";

interface PaymentMethodSelectorProps {
  selectedMethod: 'cash' | 'card';
  onMethodChange: (method: 'cash' | 'card') => void;
}

export default function PaymentMethodSelector({ selectedMethod, onMethodChange }: PaymentMethodSelectorProps) {
  return (
    <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-green-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-bold">
          <CreditCard className="w-5 h-5 text-green-600" />
          Payment Method
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant={selectedMethod === 'card' ? 'default' : 'outline'}
            onClick={() => onMethodChange('card')}
            className="h-12 flex items-center gap-2"
          >
            <CreditCard className="w-5 h-5" />
            Card
          </Button>
          <Button
            variant={selectedMethod === 'cash' ? 'default' : 'outline'}
            onClick={() => onMethodChange('cash')}
            className="h-12 flex items-center gap-2"
          >
            <Banknote className="w-5 h-5" />
            Cash
          </Button>
        </div>
        
        <div className="mt-3 p-2 bg-green-50 rounded-lg">
          <div className="text-sm text-green-800 capitalize">
            Selected: {selectedMethod} Payment
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
