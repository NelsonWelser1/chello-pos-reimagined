
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useOrders } from "@/hooks/useOrders";
import { useStaff } from "@/hooks/useStaff";
import { useTableSessions } from "@/hooks/useTableSessions";
import { receiptService } from "@/services/receiptService";
import { useKitchenOrders } from "@/hooks/useKitchenOrders";
import PaymentMethodSelector from "./PaymentMethodSelector";
import { type CartItem } from "@/hooks/useCart";
import { type MenuItem } from "@/hooks/useMenuItems";

interface POSPaymentHandlerProps {
  cart: CartItem[];
  menuItems: MenuItem[];
  totalAmount: number;
  paymentMethod: 'cash' | 'card';
  selectedStaffId: string | null;
  selectedTableSession: string | null;
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
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { createOrder, createOrderItems } = useOrders();
  const { staff } = useStaff();
  const { sessions } = useTableSessions();
  const { createKitchenOrderFromOrder } = useKitchenOrders();

  const subtotal = totalAmount;
  const taxRate = 0.10; // 10% tax
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount;

  const handleCompleteOrder = async () => {
    if (!selectedStaffId) {
      toast({
        title: "Staff Required",
        description: "Please select a staff member to process the order.",
        variant: "destructive",
      });
      return;
    }

    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to the cart before processing payment.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    console.log("Starting order processing...");

    try {
      // Create the order
      const orderData = {
        subtotal,
        tax_amount: taxAmount,
        total_amount: total,
        payment_method: paymentMethod,
        status: 'pending', // Orders start as pending, kitchen will update status
        staff_id: selectedStaffId,
        table_session_id: selectedTableSession,
      };

      console.log("Creating order with data:", orderData);
      const order = await createOrder(orderData);

      if (!order) {
        throw new Error("Failed to create order");
      }

      console.log("Order created successfully:", order);

      // Create order items
      const orderItemsData = cart.map(item => ({
        order_id: order.id,
        menu_item_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity,
      }));

      console.log("Creating order items:", orderItemsData);
      const itemsCreated = await createOrderItems(orderItemsData);

      if (!itemsCreated) {
        throw new Error("Failed to create order items");
      }

      console.log("Order items created successfully");

      // Create kitchen order for preparation tracking
      try {
        const kitchenOrder = await createKitchenOrderFromOrder(order.id);
        console.log("Kitchen order created:", kitchenOrder);
      } catch (kitchenError) {
        console.error("Failed to create kitchen order:", kitchenError);
        // Don't fail the whole order if kitchen order creation fails
      }

      // Get staff and table information
      const selectedStaff = staff.find(s => s.id === selectedStaffId);
      const selectedTable = selectedTableSession ? 
        sessions.find(ts => ts.id === selectedTableSession) : null;

      // Generate receipt
      const receiptData = {
        orderId: order.id,
        orderNumber: `ORD-${Date.now()}`,
        items: cart.map(item => ({
          name: item.name,
          quantity: item.quantity,
          unitPrice: item.price,
          totalPrice: item.price * item.quantity,
        })),
        subtotal,
        taxAmount,
        total,
        paymentMethod,
        staffName: selectedStaff?.name,
        tableName: selectedTable?.table ? `Table ${selectedTable.table.number}` : undefined,
      };

      console.log("Generating receipt with data:", receiptData);
      const receipt = await receiptService.generateReceipt(receiptData);

      if (receipt) {
        console.log("Receipt generated successfully:", receipt);
        // Try to print the receipt
        const printed = await receiptService.printReceipt(receipt);
        
        if (printed) {
          console.log("Receipt printed successfully");
        } else {
          console.warn("Receipt generation succeeded but printing failed");
        }
      } else {
        console.warn("Receipt generation failed");
      }

      // Clear the cart
      onClearCart();
      onCartClear();

      toast({
        title: "Order Sent to Kitchen!",
        description: `Order #${order.id.slice(0, 8)} has been sent to kitchen for preparation.`,
      });

      console.log("Order processing completed successfully");

    } catch (error) {
      console.error("Error processing order:", error);
      toast({
        title: "Order Failed",
        description: error instanceof Error ? error.message : "Failed to process the order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-black text-slate-800">Payment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <PaymentMethodSelector
          selectedMethod={paymentMethod}
          onMethodChange={onPaymentMethodChange}
        />

        <div className="space-y-3 p-4 bg-slate-50 rounded-lg">
          <div className="flex justify-between text-lg">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg">
            <span>Tax (10%):</span>
            <span>${taxAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-2xl font-bold border-t pt-2">
            <span>Total:</span>
            <Badge className="bg-green-500 text-white font-bold text-xl px-4 py-2">
              ${total.toFixed(2)}
            </Badge>
          </div>
        </div>

        <Button
          onClick={handleCompleteOrder}
          disabled={isProcessing || cart.length === 0 || !selectedStaffId}
          className="w-full h-16 text-xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
        >
          {isProcessing ? "Processing..." : `Send to Kitchen - ${paymentMethod.toUpperCase()}`}
        </Button>
      </CardContent>
    </Card>
  );
}
