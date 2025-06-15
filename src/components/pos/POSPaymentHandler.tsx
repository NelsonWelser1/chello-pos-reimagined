
import { useState } from "react";
import { CreditCard, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useOrders } from "@/hooks/useOrders";
import { supabase } from "@/integrations/supabase/client";

interface CartItem {
  id: string;
  name: string;
  price: number;
  category: string;
  quantity: number;
  image?: string;
}

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  image?: string;
  is_available: boolean;
  stock_count: number;
  preparation_time: number;
}

interface POSPaymentHandlerProps {
  cart: CartItem[];
  menuItems: MenuItem[];
  totalAmount: number;
  paymentMethod: 'cash' | 'card';
  selectedStaffId: string | null;
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
  onPaymentMethodChange,
  onClearCart,
  onCartClear
}: POSPaymentHandlerProps) {
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();
  const { createOrder, createOrderItems } = useOrders();

  const TAX_RATE = 0.1; // 10% tax
  const subtotal = totalAmount;
  const taxAmount = subtotal * TAX_RATE;
  const finalTotal = subtotal + taxAmount;

  const handlePayment = async () => {
    if (cart.length === 0) {
      toast({
        title: "Error",
        description: "Cart is empty",
        variant: "destructive"
      });
      return;
    }

    setProcessing(true);

    try {
      // Create the order
      const orderData = {
        total_amount: finalTotal,
        subtotal: subtotal,
        tax_amount: taxAmount,
        payment_method: paymentMethod,
        status: 'completed',
        staff_id: selectedStaffId,
        table_number: null
      };

      const newOrder = await createOrder(orderData);
      
      if (!newOrder) {
        throw new Error('Failed to create order');
      }

      // Create order items
      const orderItems = cart.map(item => {
        const menuItem = menuItems.find(m => m.id === item.id);
        return {
          order_id: newOrder.id,
          menu_item_id: item.id,
          quantity: item.quantity,
          unit_price: item.price,
          total_price: item.price * item.quantity,
          special_instructions: null
        };
      });

      const itemsCreated = await createOrderItems(orderItems);
      
      if (!itemsCreated) {
        throw new Error('Failed to create order items');
      }

      // Create kitchen order automatically
      await createKitchenOrder(newOrder.id);

      // Update stock counts
      await updateStockCounts();

      toast({
        title: "Payment Successful!",
        description: `Order completed with ${paymentMethod} payment. Kitchen has been notified.`,
      });

      onCartClear();
    } catch (error) {
      console.error('Payment processing error:', error);
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  const createKitchenOrder = async (orderId: string) => {
    try {
      // Calculate estimated time based on menu items
      const maxPrepTime = Math.max(...cart.map(item => {
        const menuItem = menuItems.find(m => m.id === item.id);
        return menuItem?.preparation_time || 5;
      }));

      // Determine priority based on order size and complexity
      let priority: 'low' | 'medium' | 'high' = 'medium';
      if (cart.length > 5) priority = 'high';
      else if (cart.length <= 2) priority = 'low';

      const { error } = await supabase
        .from('kitchen_orders')
        .insert([{
          order_id: orderId,
          priority,
          estimated_time: maxPrepTime + 5, // Add 5 minutes buffer
          status: 'pending'
        }]);

      if (error) {
        console.error('Error creating kitchen order:', error);
      }
    } catch (error) {
      console.error('Error creating kitchen order:', error);
    }
  };

  const updateStockCounts = async () => {
    try {
      for (const item of cart) {
        const { error } = await supabase
          .from('menu_items')
          .update({ 
            stock_count: supabase.rpc('decrement_stock', { 
              item_id: item.id, 
              quantity: item.quantity 
            })
          })
          .eq('id', item.id);

        if (error) {
          console.error('Error updating stock:', error);
        }
      }
    } catch (error) {
      console.error('Error updating stock counts:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Payment Method Selection */}
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

      {/* Order Summary */}
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
              onClick={handlePayment}
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
    </div>
  );
}
