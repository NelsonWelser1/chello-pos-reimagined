
import { CreditCard, DollarSign, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface PaymentSectionProps {
  totalAmount: number;
  paymentMethod: 'cash' | 'card';
  onPaymentMethodChange: (method: 'cash' | 'card') => void;
  onClearCart: () => void;
  onProcessPayment: () => void;
}

export default function PaymentSection({ 
  totalAmount, 
  paymentMethod, 
  onPaymentMethodChange, 
  onClearCart, 
  onProcessPayment 
}: PaymentSectionProps) {
  const taxAmount = totalAmount * 0.085;
  const finalTotal = totalAmount * 1.085;

  return (
    <Card className="shadow-xl border-0 bg-gradient-to-br from-green-50 to-emerald-50">
      <CardHeader>
        <CardTitle className="text-2xl font-black text-slate-800">Payment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center text-lg">
          <span className="font-bold">Subtotal:</span>
          <span className="font-black">UGX {Math.round(totalAmount).toLocaleString('en-UG')}</span>
        </div>
        <div className="flex justify-between items-center text-lg">
          <span className="font-bold">Tax (8.5%):</span>
          <span className="font-black">UGX {Math.round(taxAmount).toLocaleString('en-UG')}</span>
        </div>
        <Separator />
        <div className="flex justify-between items-center text-xl">
          <span className="font-black">Total:</span>
          <span className="font-black text-2xl text-green-600">
            UGX {Math.round(finalTotal).toLocaleString('en-UG')}
          </span>
        </div>

        <div className="space-y-3">
          <p className="font-bold text-slate-700">Payment Method:</p>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={paymentMethod === 'card' ? "default" : "outline"}
              onClick={() => onPaymentMethodChange('card')}
              className={paymentMethod === 'card' ? 'bg-blue-500 hover:bg-blue-600' : ''}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Card
            </Button>
            <Button
              variant={paymentMethod === 'cash' ? "default" : "outline"}
              onClick={() => onPaymentMethodChange('cash')}
              className={paymentMethod === 'cash' ? 'bg-green-500 hover:bg-green-600' : ''}
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Cash
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            onClick={onClearCart}
            className="font-bold"
          >
            Clear Cart
          </Button>
          <Button 
            onClick={onProcessPayment}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 font-bold"
          >
            <Receipt className="w-4 h-4 mr-2" />
            Process Payment
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
