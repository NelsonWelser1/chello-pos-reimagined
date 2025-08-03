import { useState, useEffect } from "react";
import { Plus, Receipt, ShoppingCart, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useOrders, type Order, type OrderItem, type CreateOrderItem } from "@/hooks/useOrders";
import { useKitchenOrders } from "@/hooks/useKitchenOrders";
import { useMenuItems } from "@/hooks/useMenuItems";
import { receiptService } from "@/services/receiptService";
import { type MenuItem } from "@/types/menuItem";

interface OrderManagementProps {
  order: Order;
  kitchenStatus: string;
  onOrderUpdated: () => void;
}

export default function OrderManagement({ order, kitchenStatus, onOrderUpdated }: OrderManagementProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: number }>({});
  const [billGenerated, setBillGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { toast } = useToast();
  const { fetchOrderItems, createOrderItems, updateOrder } = useOrders();
  const { createKitchenOrderFromOrder } = useKitchenOrders();
  const { items: menuItems } = useMenuItems();

  // Load order items when dialog opens
  useEffect(() => {
    if (isOpen) {
      loadOrderItems();
    }
  }, [isOpen]);

  const loadOrderItems = async () => {
    const items = await fetchOrderItems(order.id);
    setOrderItems(items);
  };

  const handleAddItem = (menuItemId: string) => {
    setSelectedItems(prev => ({
      ...prev,
      [menuItemId]: (prev[menuItemId] || 0) + 1
    }));
  };

  const handleRemoveItem = (menuItemId: string) => {
    setSelectedItems(prev => {
      const newCount = (prev[menuItemId] || 0) - 1;
      if (newCount <= 0) {
        const { [menuItemId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [menuItemId]: newCount };
    });
  };

  const handleUpdateOrder = async () => {
    if (Object.keys(selectedItems).length === 0) {
      toast({
        title: "No Items Selected",
        description: "Please select items to add to the order.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Create new order items
      const newItems: CreateOrderItem[] = Object.entries(selectedItems).map(([menuItemId, quantity]) => {
        const menuItem = menuItems.find(item => item.id === menuItemId);
        if (!menuItem) throw new Error(`Menu item ${menuItemId} not found`);
        
        return {
          order_id: order.id,
          menu_item_id: menuItemId,
          quantity,
          unit_price: menuItem.price,
          total_price: menuItem.price * quantity,
        };
      });

      // Add items to order
      const itemsCreated = await createOrderItems(newItems);
      if (!itemsCreated) {
        throw new Error("Failed to add items to order");
      }

      // Calculate new totals
      const additionalAmount = newItems.reduce((sum, item) => sum + item.total_price, 0);
      const newSubtotal = order.subtotal + additionalAmount;
      const newTaxAmount = newSubtotal * 0.18; // 18% tax
      const newTotal = newSubtotal + newTaxAmount;

      // Update order totals
      const orderUpdated = await updateOrder(order.id, {
        subtotal: newSubtotal,
        tax_amount: newTaxAmount,
        total_amount: newTotal,
      });

      if (!orderUpdated) {
        throw new Error("Failed to update order totals");
      }

      // Send new items to kitchen (only the new items, not the whole order)
      await createKitchenOrderFromOrder(order.id);

      toast({
        title: "Order Updated",
        description: `Added ${Object.values(selectedItems).reduce((a, b) => a + b, 0)} items to the order.`,
      });

      // Reset selections and close dialog
      setSelectedItems({});
      setIsOpen(false);
      onOrderUpdated();
      
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: "Error",
        description: "Failed to update order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePrintBill = async () => {
    if (billGenerated) {
      toast({
        title: "Bill Already Generated",
        description: "The bill has already been printed for this order.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      // Reload order items to get the latest data
      const currentItems = await fetchOrderItems(order.id);
      
      // Prepare receipt data
      const receiptData = {
        orderId: order.id,
        orderNumber: `ORD-${order.id.slice(0, 8)}`,
        items: currentItems.map(item => {
          const menuItem = menuItems.find(mi => mi.id === item.menu_item_id);
          return {
            name: menuItem?.name || 'Unknown Item',
            quantity: item.quantity,
            unitPrice: item.unit_price,
            totalPrice: item.total_price,
            specialInstructions: item.special_instructions,
          };
        }),
        subtotal: order.subtotal,
        taxAmount: order.tax_amount,
        total: order.total_amount,
        paymentMethod: order.payment_method,
        tableName: order.table_number ? `Table ${order.table_number}` : undefined,
      };

      // Generate and print receipt
      const receipt = await receiptService.generateReceipt(receiptData);
      if (receipt) {
        const printed = await receiptService.printReceipt(receipt);
        if (printed) {
          setBillGenerated(true);
          toast({
            title: "Bill Printed",
            description: "The bill has been successfully printed.",
          });
        } else {
          toast({
            title: "Print Failed",
            description: "Failed to print the bill. Please try again.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error('Error printing bill:', error);
      toast({
        title: "Error",
        description: "Failed to generate bill. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const availableMenuItems = menuItems.filter(item => item.is_available && item.stock_count > 0);
  const totalSelectedItems = Object.values(selectedItems).reduce((sum, count) => sum + count, 0);
  const canModifyOrder = kitchenStatus !== 'served' && order.status !== 'completed';

  return (
    <div className="flex gap-2">
      {canModifyOrder && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="flex-1">
              <Plus className="w-3 h-3 mr-1" />
              Add Items
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>Add Items to Order #{order.id.slice(0, 8)}</DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh]">
              {/* Menu Items Selection */}
              <div>
                <h3 className="font-medium mb-3">Available Menu Items</h3>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-2">
                    {availableMenuItems.map(item => (
                      <div key={item.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium text-sm">{item.name}</h4>
                            <p className="text-xs text-slate-600">{item.description}</p>
                          </div>
                          <span className="text-sm font-medium">
                            UGX {item.price.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => handleRemoveItem(item.id)}
                            size="sm"
                            variant="outline"
                            disabled={!selectedItems[item.id]}
                          >
                            -
                          </Button>
                          <span className="w-8 text-center text-sm">
                            {selectedItems[item.id] || 0}
                          </span>
                          <Button
                            onClick={() => handleAddItem(item.id)}
                            size="sm"
                            variant="outline"
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Current Order & Selected Items */}
              <div>
                <h3 className="font-medium mb-3">Order Summary</h3>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {/* Current order items */}
                    <div>
                      <h4 className="text-sm font-medium text-slate-600 mb-2">Current Items</h4>
                      {orderItems.map(item => {
                        const menuItem = menuItems.find(mi => mi.id === item.menu_item_id);
                        return (
                          <div key={item.id} className="text-sm p-2 bg-slate-50 rounded">
                            <div className="flex justify-between">
                              <span>{menuItem?.name || 'Unknown'}</span>
                              <span>{item.quantity}x</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {totalSelectedItems > 0 && (
                      <>
                        <Separator />
                        <div>
                          <h4 className="text-sm font-medium text-green-600 mb-2">Adding Now</h4>
                          {Object.entries(selectedItems).map(([menuItemId, quantity]) => {
                            const menuItem = menuItems.find(item => item.id === menuItemId);
                            return (
                              <div key={menuItemId} className="text-sm p-2 bg-green-50 rounded">
                                <div className="flex justify-between">
                                  <span>{menuItem?.name}</span>
                                  <span>{quantity}x</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                </ScrollArea>
                
                <div className="mt-4 pt-3 border-t">
                  <Button
                    onClick={handleUpdateOrder}
                    disabled={totalSelectedItems === 0 || loading}
                    className="w-full"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {loading ? "Updating..." : `Add ${totalSelectedItems} Items`}
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <Button
        onClick={handlePrintBill}
        size="sm"
        variant={billGenerated ? "secondary" : "default"}
        disabled={loading || billGenerated}
        className="flex-1"
      >
        <Receipt className="w-3 h-3 mr-1" />
        {billGenerated ? "Bill Printed" : loading ? "Printing..." : "Print Bill"}
      </Button>
    </div>
  );
}