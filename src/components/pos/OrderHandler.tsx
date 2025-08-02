import { useState } from "react";
import { ChefHat, Plus, Minus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useOrders } from "@/hooks/useOrders";
import { useStaff } from "@/hooks/useStaff";
import { useTableSessions } from "@/hooks/useTableSessions";
import { useKitchenOrders } from "@/hooks/useKitchenOrders";
import { type CartItem } from "@/hooks/useCart";
import { type MenuItem } from "@/hooks/useMenuItems";

interface OrderHandlerProps {
  cart: CartItem[];
  menuItems: MenuItem[];
  totalAmount: number;
  selectedStaffId: string | null;
  selectedTableSession: string | null;
  onItemIncrease: (id: string) => void;
  onItemDecrease: (id: string) => void;
  onNewOrder: () => void;
}

export default function OrderHandler({
  cart,
  menuItems,
  totalAmount,
  selectedStaffId,
  selectedTableSession,
  onItemIncrease,
  onItemDecrease,
  onNewOrder
}: OrderHandlerProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const { toast } = useToast();
  const { createOrder, createOrderItems } = useOrders();
  const { staff } = useStaff();
  const { sessions } = useTableSessions();
  const { createKitchenOrderFromOrder } = useKitchenOrders();

  const subtotal = totalAmount;
  const taxRate = 0.10; // 10% tax
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount;

  const handleSendToKitchen = async () => {
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
        description: "Please add items to the cart before sending to kitchen.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    console.log("Sending order to kitchen...");

    try {
      // Create the order (without payment processing)
      const orderData = {
        subtotal,
        tax_amount: taxAmount,
        total_amount: total,
        payment_method: 'pending', // Payment will be processed later
        status: 'preparing', // Order goes directly to preparing
        staff_id: selectedStaffId,
        table_session_id: selectedTableSession,
      };

      console.log("Creating order with data:", orderData);
      const order = await createOrder(orderData);

      if (!order) {
        throw new Error("Failed to create order");
      }

      console.log("Order created successfully:", order);
      setCurrentOrderId(order.id);

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

      toast({
        title: "Order Sent to Kitchen!",
        description: `Order #${order.id.slice(0, 8)} has been sent to kitchen for preparation. You can still modify items.`,
      });

      console.log("Order sent to kitchen successfully");

    } catch (error) {
      console.error("Error sending order to kitchen:", error);
      toast({
        title: "Order Failed",
        description: error instanceof Error ? error.message : "Failed to send order to kitchen. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNewOrder = () => {
    setCurrentOrderId(null);
    onNewOrder();
    toast({
      title: "New Order Started",
      description: "Cart cleared. Ready for new order.",
    });
  };

  return (
    <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-black text-slate-800 flex items-center justify-between">
          Order Summary
          {currentOrderId && (
            <Badge className="bg-orange-500 text-white">
              In Kitchen
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Order Items with Quick Edit */}
        {cart.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-700">Items:</h4>
            {cart.map(item => (
              <div key={item.id} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                <span className="flex-1">{item.name}</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onItemDecrease(item.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onItemIncrease(item.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Order Total */}
        <div className="space-y-3 p-4 bg-slate-50 rounded-lg">
          <div className="flex justify-between text-lg">
            <span>Subtotal:</span>
            <span>UGX {Math.round(subtotal).toLocaleString('en-UG')}</span>
          </div>
          <div className="flex justify-between text-lg">
            <span>Tax (10%):</span>
            <span>UGX {Math.round(taxAmount).toLocaleString('en-UG')}</span>
          </div>
          <div className="flex justify-between text-2xl font-bold border-t pt-2">
            <span>Total:</span>
            <Badge className="bg-green-500 text-white font-bold text-xl px-4 py-2">
              UGX {Math.round(total).toLocaleString('en-UG')}
            </Badge>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {!currentOrderId ? (
            <Button
              onClick={handleSendToKitchen}
              disabled={isProcessing || cart.length === 0 || !selectedStaffId}
              className="w-full h-16 text-xl font-bold bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
            >
              {isProcessing ? (
                "Sending..."
              ) : (
                <>
                  <ChefHat className="w-6 h-6 mr-2" />
                  Send to Kitchen
                </>
              )}
            </Button>
          ) : (
            <div className="space-y-2">
              <div className="text-center text-sm text-slate-600 mb-2">
                Order in kitchen - you can still modify items above
              </div>
              <Button
                onClick={handleNewOrder}
                variant="outline"
                className="w-full h-12 text-lg font-medium"
              >
                <Trash2 className="w-5 h-5 mr-2" />
                Start New Order
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}