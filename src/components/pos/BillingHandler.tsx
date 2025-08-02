import { useState } from "react";
import { Receipt, CreditCard, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useOrders } from "@/hooks/useOrders";
import { receiptService } from "@/services/receiptService";
import { supabase } from "@/integrations/supabase/client";
import { type KitchenOrder } from "@/types/kitchen";

interface BillingHandlerProps {
  order: KitchenOrder;
  onBillGenerated: () => void;
}

export default function BillingHandler({ order, onBillGenerated }: BillingHandlerProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isBillGenerated, setIsBillGenerated] = useState(false);
  const { toast } = useToast();

  const handleGenerateBill = async () => {
    setIsProcessing(true);
    
    try {
      // First, fetch the complete order details including financial information
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(
            *,
            menu_items(name, price)
          ),
          staff(name),
          customers(name)
        `)
        .eq('id', order.order_id)
        .single();

      if (orderError || !orderData) {
        throw new Error('Failed to fetch order details');
      }

      // Update order status to completed now that it's being billed
      const { error: updateError } = await supabase
        .from('orders')
        .update({ status: 'completed' })
        .eq('id', order.order_id);

      if (updateError) {
        console.error('Error updating order status:', updateError);
      }

      // Generate receipt with actual order data
      const receiptData = {
        orderId: orderData.id,
        orderNumber: order.order_number,
        items: orderData.order_items.map((item: any) => ({
          name: item.menu_items.name,
          quantity: item.quantity,
          unitPrice: item.unit_price,
          totalPrice: item.total_price,
        })),
        subtotal: orderData.subtotal,
        taxAmount: orderData.tax_amount,
        total: orderData.total_amount,
        paymentMethod: orderData.payment_method,
        staffName: orderData.staff?.name || 'Staff',
        tableName: order.table_number ? 
          `Table ${order.table_number}` : 
          undefined,
      };

      const receipt = await receiptService.generateReceipt(receiptData);
      
      if (receipt) {
        const printed = await receiptService.printReceipt(receipt);
        
        toast({
          title: "Bill Generated Successfully!",
          description: `Final bill for ${order.order_number} has been generated${printed ? ' and printed' : ''}.`,
        });

        setIsBillGenerated(true);
        onBillGenerated();
      } else {
        throw new Error('Failed to generate receipt');
      }

    } catch (error) {
      console.error('Error generating bill:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate bill. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isBillGenerated) {
    return null;
  }

  return (
    <Card className="bg-green-50 border-green-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold text-green-800 flex items-center gap-2">
          <Receipt className="w-5 h-5" />
          {order.order_number} - Ready for Billing
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="text-sm text-green-700">
            <strong>Customer:</strong> {order.customer_name}
          </div>
          {order.table_number && (
            <div className="text-sm text-green-700">
              <strong>Table:</strong> {order.table_number}
            </div>
          )}
          <div className="text-sm text-green-700">
            <strong>Items:</strong> {order.items.length} items
          </div>
          <div className="flex flex-wrap gap-1">
            {order.items.map((item, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {item.quantity}x {item.name}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleGenerateBill}
            disabled={isProcessing}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold"
          >
            {isProcessing ? (
              "Generating..."
            ) : (
              <>
                <Receipt className="w-4 h-4 mr-2" />
                Generate Final Bill
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}