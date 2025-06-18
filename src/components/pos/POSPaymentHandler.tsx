
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Banknote, Receipt, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { useOrders } from "@/hooks/useOrders";
import { useTableSessions } from "@/hooks/useTableSessions";
import PaymentMethodSelector from "./PaymentMethodSelector";

interface POSPaymentHandlerProps {
  cart: any[];
  menuItems: any[];
  totalAmount: number;
  paymentMethod: 'cash' | 'card';
  selectedStaffId: string | null;
  selectedTableSession?: string | null;
  onPaymentMethodChange: (method: 'cash' | 'card') => void;
  onClearCart: () => void;
  onCartClear: () => void;
}

export default function POSPaymentHandler({
  cart,
  menuItems,
  totalAmount,
  paymentMethod,
  selectedStaffId,
  selectedTableSession,
  onPaymentMethodChange,
  onClearCart,
  onCartClear
}: POSPaymentHandlerProps) {
  const { createOrder, createOrderItems } = useOrders();
  const { sessions } = useTableSessions();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cashReceived, setCashReceived] = useState<string>('');

  const subtotal = totalAmount;
  const taxRate = 0.08; // 8% tax
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount;
  const change = paymentMethod === 'cash' && cashReceived ? Math.max(0, parseFloat(cashReceived) - total) : 0;

  const handleProcessPayment = async () => {
    if (!selectedStaffId) {
      toast.error("Please select a staff member");
      return;
    }

    if (paymentMethod === 'cash' && (!cashReceived || parseFloat(cashReceived) < total)) {
      toast.error("Cash received must be greater than or equal to total");
      return;
    }

    setIsProcessing(true);

    try {
      // Get table session info if selected
      const tableSession = selectedTableSession ? 
        sessions.find(s => s.id === selectedTableSession) : null;

      // Create the order
      const orderData = {
        subtotal: subtotal,
        tax_amount: taxAmount,
        total_amount: total,
        payment_method: paymentMethod,
        status: 'pending',
        staff_id: selectedStaffId,
        table_session_id: selectedTableSession || null,
        table_number: tableSession?.table?.number || null,
        notes: tableSession ? `Table ${tableSession.table?.number} - ${tableSession.customer_name}` : 'Takeout order'
      };

      const newOrder = await createOrder(orderData);
      if (!newOrder) {
        throw new Error('Failed to create order');
      }

      // Create order items
      const orderItems = cart.map(item => {
        const menuItem = menuItems.find(mi => mi.id === item.id);
        return {
          order_id: newOrder.id,
          menu_item_id: item.id,
          quantity: item.quantity,
          unit_price: menuItem?.price || 0,
          total_price: (menuItem?.price || 0) * item.quantity,
          special_instructions: item.notes || null
        };
      });

      const itemsCreated = await createOrderItems(orderItems);
      if (!itemsCreated) {
        throw new Error('Failed to create order items');
      }

      // Show success message
      const orderNumber = `#${newOrder.id.slice(0, 8).toUpperCase()}`;
      toast.success(
        `Order ${orderNumber} processed successfully! ${
          paymentMethod === 'cash' && change > 0 ? `Change: $${change.toFixed(2)}` : ''
        }`
      );

      // Clear cart and reset form
      onCartClear();
      setCashReceived('');

    } catch (error) {
      console.error('Payment processing failed:', error);
      toast.error("Payment processing failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-green-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-bold">
          <Receipt className="w-6 h-6 text-green-600" />
          Payment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Order Summary */}
        <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax (8%):</span>
            <span>${taxAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total:</span>
            <span className="text-green-600">${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Table Info */}
        {selectedTableSession && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="text-sm font-medium text-blue-800">
              {(() => {
                const session = sessions.find(s => s.id === selectedTableSession);
                return session?.table ? 
                  `Table ${session.table.number} - ${session.customer_name || 'Customer'}` :
                  'Takeout Order';
              })()}
            </div>
          </div>
        )}

        {/* Payment Method Selection */}
        <PaymentMethodSelector
          selectedMethod={paymentMethod}
          onMethodChange={onPaymentMethodChange}
        />

        {/* Cash Payment Details */}
        {paymentMethod === 'cash' && (
          <div className="space-y-3">
            <div>
              <Label htmlFor="cashReceived" className="text-sm font-medium">
                Cash Received
              </Label>
              <Input
                id="cashReceived"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={cashReceived}
                onChange={(e) => setCashReceived(e.target.value)}
                className="text-lg font-bold"
              />
            </div>
            
            {cashReceived && parseFloat(cashReceived) >= total && (
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-green-800 font-medium">Change Due:</span>
                  <span className="text-2xl font-bold text-green-600">
                    ${change.toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button
            onClick={handleProcessPayment}
            disabled={isProcessing || (paymentMethod === 'cash' && (!cashReceived || parseFloat(cashReceived) < total))}
            className="w-full h-12 text-lg font-bold bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
          >
            {isProcessing ? 'Processing...' : `Process ${paymentMethod === 'cash' ? 'Cash' : 'Card'} Payment`}
          </Button>
          
          <Button
            variant="outline"
            onClick={onClearCart}
            className="w-full"
            disabled={isProcessing}
          >
            Clear Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
