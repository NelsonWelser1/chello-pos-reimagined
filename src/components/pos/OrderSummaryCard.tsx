
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface OrderSummaryCardProps {
  subtotal: number;
  taxAmount: number;
  finalTotal: number;
  paymentMethod: 'cash' | 'card';
  processing: boolean;
  onProcessPayment: () => void;
  onClearCart: () => void;
}

export default function OrderSummaryCard({
  subtotal,
  taxAmount,
  finalTotal,
  paymentMethod,
  processing,
  onProcessPayment,
  onClearCart
}: OrderSummaryCardProps) {
  return (
    <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl font-black text-slate-800">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="font-medium">Subtotal:</span>
          <span className="font-bold">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium">Tax (10%):</span>
          <span className="font-bold">${taxAmount.toFixed(2)}</span>
        </div>
        <div className="border-t pt-4">
          <div className="flex justify-between items-center text-lg">
            <span className="font-black">Total:</span>
            <Badge className="bg-blue-500 text-white font-black text-lg px-4 py-2">
              ${finalTotal.toFixed(2)}
            </Badge>
          </div>
        </div>
        
        <div className="pt-4 space-y-3">
          <Button
            onClick={onProcessPayment}
            disabled={processing}
            className="w-full bg-green-500 hover:bg-green-600 font-black text-lg py-6"
          >
            {processing ? 'Processing...' : `Process ${paymentMethod === 'card' ? 'Card' : 'Cash'} Payment`}
          </Button>
          
          <Button
            onClick={onClearCart}
            variant="outline"
            className="w-full font-bold"
            disabled={processing}
          >
            Clear Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
