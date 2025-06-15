
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useOrders } from "@/hooks/useOrders";
import PaymentMethodSelector from "./PaymentMethodSelector";
import OrderSummaryCard from "./OrderSummaryCard";
import { createKitchenOrder } from "@/services/kitchenOrderService";
import { updateStockCounts } from "@/services/stockService";

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
      await createKitchenOrder(newOrder.id, cart, menuItems);

      // Update stock counts
      await updateStockCounts(cart, menuItems);

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

  return (
    <div className="space-y-6">
      <PaymentMethodSelector
        paymentMethod={paymentMethod}
        onPaymentMethodChange={onPaymentMethodChange}
      />

      <OrderSummaryCard
        subtotal={subtotal}
        taxAmount={taxAmount}
        finalTotal={finalTotal}
        paymentMethod={paymentMethod}
        processing={processing}
        onProcessPayment={handlePayment}
        onClearCart={onClearCart}
      />
    </div>
  );
}
