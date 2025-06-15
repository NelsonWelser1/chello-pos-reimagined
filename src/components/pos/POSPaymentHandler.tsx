
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useOrders } from "@/hooks/useOrders";
import { type MenuItem } from "@/hooks/useMenuItems";
import { type CartItem } from "@/hooks/useCart";
import PaymentSection from "./PaymentSection";

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
  const { createOrder, createOrderItems } = useOrders();
  const { toast } = useToast();

  const processPayment = async () => {
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to cart before processing payment.",
        variant: "destructive"
      });
      return;
    }

    try {
      const orderData = {
        total_amount: totalAmount * 1.085,
        subtotal: totalAmount,
        tax_amount: totalAmount * 0.085,
        payment_method: paymentMethod,
        status: 'completed',
        staff_id: selectedStaffId
      };

      const order = await createOrder(orderData);

      if (!order) {
        toast({
          title: "Order Failed",
          description: "Failed to create order. Please try again.",
          variant: "destructive"
        });
        return;
      }

      const orderItems = cart.map(item => ({
        order_id: order.id,
        menu_item_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity
      }));

      const itemsSuccess = await createOrderItems(orderItems);

      if (!itemsSuccess) {
        toast({
          title: "Order Items Failed",
          description: "Failed to save order items.",
          variant: "destructive"
        });
        return;
      }

      // Update stock counts
      for (const cartItem of cart) {
        const menuItem = menuItems.find(item => item.id === cartItem.id);
        if (menuItem) {
          const newStockCount = menuItem.stock_count - cartItem.quantity;
          await supabase
            .from('menu_items' as any)
            .update({ stock_count: newStockCount })
            .eq('id', cartItem.id);
        }
      }

      toast({
        title: "Payment Processed",
        description: `Order #${order.id.slice(-8)} processed successfully via ${paymentMethod}`,
      });
      
      onCartClear();
    } catch (error) {
      console.error('Payment processing error:', error);
      toast({
        title: "Payment Failed",
        description: "An error occurred while processing payment.",
        variant: "destructive"
      });
    }
  };

  return (
    <PaymentSection
      totalAmount={totalAmount}
      paymentMethod={paymentMethod}
      onPaymentMethodChange={onPaymentMethodChange}
      onClearCart={onClearCart}
      onProcessPayment={processPayment}
    />
  );
}
