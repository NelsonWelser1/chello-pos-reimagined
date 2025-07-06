import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Receipt, AlertTriangle, Printer } from "lucide-react";
import { toast } from "sonner";
import { useOrders } from "@/hooks/useOrders";
import { useTableSessions } from "@/hooks/useTableSessions";
import { useConfiguredSalesTransactions } from "@/hooks/useConfiguredSalesTransactions";
import { paymentConfigService, PaymentConfigSettings } from "@/services/paymentConfigService";
import { receiptService } from "@/services/receiptService";
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
  const { createTransaction } = useConfiguredSalesTransactions();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cashReceived, setCashReceived] = useState<string>('');
  const [config, setConfig] = useState<PaymentConfigSettings | null>(null);
  const [tipAmount, setTipAmount] = useState<number>(0);
  const [signatureRequired, setSignatureRequired] = useState<boolean>(false);

  // Load payment configuration
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const paymentConfig = await paymentConfigService.getConfig();
        setConfig(paymentConfig);
        
        // Calculate default tip if enabled
        if (paymentConfig.tipEnabled) {
          const tipPercentage = parseFloat(paymentConfig.defaultTipPercentage) / 100;
          setTipAmount(totalAmount * tipPercentage);
        }
        
        // Set signature requirement for large transactions
        const maxAmount = parseFloat(paymentConfig.maxTransactionAmount);
        if (totalAmount > maxAmount / 2) { // Require signature for transactions over half the max
          setSignatureRequired(paymentConfig.requireSignature);
        }
      } catch (error) {
        console.error('Error loading payment configuration:', error);
      }
    };

    loadConfig();
  }, [totalAmount]);

  if (!config) {
    return (
      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-green-50">
        <CardContent className="p-6">
          <div className="text-center">Loading payment configuration...</div>
        </CardContent>
      </Card>
    );
  }

  const subtotal = totalAmount;
  const taxRate = 0.08; // 8% tax
  const taxAmount = subtotal * taxRate;
  const finalTipAmount = config.tipEnabled ? tipAmount : 0;
  const total = subtotal + taxAmount + finalTipAmount;
  const change = paymentMethod === 'cash' && cashReceived ? Math.max(0, parseFloat(cashReceived) - total) : 0;

  // Check transaction limits
  const maxTransactionAmount = parseFloat(config.maxTransactionAmount);
  const isOverLimit = total > maxTransactionAmount;

  const handleTipChange = (percentage: number) => {
    if (config.tipEnabled) {
      const newTipAmount = totalAmount * (percentage / 100);
      setTipAmount(newTipAmount);
    }
  };

  const handleProcessPayment = async () => {
    if (!selectedStaffId) {
      toast.error("Please select a staff member");
      return;
    }

    if (isOverLimit) {
      toast.error(`Transaction amount exceeds the maximum limit of ${maxTransactionAmount.toLocaleString()} ${config.currency}`);
      return;
    }

    if (paymentMethod === 'cash' && (!cashReceived || parseFloat(cashReceived) < total)) {
      toast.error("Cash received must be greater than or equal to total");
      return;
    }

    if (signatureRequired && paymentMethod === 'card') {
      const confirmed = confirm("Signature required for this transaction. Proceed?");
      if (!confirmed) return;
    }

    setIsProcessing(true);

    try {
      // Get table session info if selected  
      const tableSession = selectedTableSession ? 
        sessions.find(s => s.id === selectedTableSession) : null;

      // Create the order with configuration-aware data
      const orderData = {
        subtotal: subtotal,
        tax_amount: taxAmount,
        total_amount: total,
        payment_method: paymentMethod,
        status: config.fraudDetection ? 'pending_verification' : 'completed',
        staff_id: selectedStaffId,
        table_session_id: selectedTableSession || null,
        table_number: tableSession?.table?.number || null,
        notes: `${tableSession ? `Table ${tableSession.table?.number} - ${tableSession.customer_name}` : 'Takeout order'}${finalTipAmount > 0 ? ` | Tip: ${finalTipAmount.toFixed(2)} ${config.currency}` : ''}${signatureRequired ? ' | Signature Required' : ''}`
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

      // Create sales transaction using the configured transaction service
      const transactionData = {
        transaction_id: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        order_id: newOrder.id,
        staff_id: selectedStaffId,
        total_amount: total,
        subtotal: subtotal,
        tax_amount: taxAmount,
        payment_method: paymentMethod,
        payment_status: config.autoSettlement ? 'completed' : 'pending_settlement',
        transaction_date: new Date().toISOString(),
        notes: orderData.notes
      };

      const salesTransaction = await createTransaction(transactionData);
      if (!salesTransaction) {
        console.warn('Failed to create sales transaction record');
      }

      // Generate and print receipt automatically
      const receiptData = {
        orderId: newOrder.id,
        orderNumber: `#${newOrder.id.slice(0, 8).toUpperCase()}`,
        transactionId: salesTransaction?.transaction_id,
        items: cart.map(item => {
          const menuItem = menuItems.find(mi => mi.id === item.id);
          return {
            name: menuItem?.name || 'Unknown Item',
            quantity: item.quantity,
            unitPrice: menuItem?.price || 0,
            totalPrice: (menuItem?.price || 0) * item.quantity,
            specialInstructions: item.notes
          };
        }),
        subtotal: subtotal,
        taxAmount: taxAmount,
        tipAmount: finalTipAmount,
        total: total,
        paymentMethod: paymentMethod,
        cashReceived: paymentMethod === 'cash' ? parseFloat(cashReceived) : undefined,
        change: change > 0 ? change : undefined,
        staffName: 'Staff Member', // You might want to get actual staff name
        tableName: tableSession ? `Table ${tableSession.table?.number}` : undefined,
        customerName: tableSession?.customer_name
      };

      const receipt = await receiptService.generateReceipt(receiptData);
      if (receipt) {
        const printed = await receiptService.printReceipt(receipt);
        if (printed) {
          toast.success("Receipt generated and sent to printer!");
        } else {
          toast.warning("Receipt generated but printing failed");
        }
      } else {
        toast.warning("Order processed but receipt generation failed");
      }

      // Show success message with configuration-aware details
      const orderNumber = `#${newOrder.id.slice(0, 8).toUpperCase()}`;
      const statusMessage = config.fraudDetection && paymentMethod === 'card' ? 
        ' (Pending fraud verification)' : '';
      
      toast.success(
        `Order ${orderNumber} processed successfully!${statusMessage} ${
          paymentMethod === 'cash' && change > 0 ? `Change: ${change.toFixed(2)} ${config.currency}` : ''
        }`
      );

      // Clear cart and reset form
      onCartClear();
      setCashReceived('');
      setTipAmount(config.tipEnabled ? totalAmount * (parseFloat(config.defaultTipPercentage) / 100) : 0);

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
        {/* Transaction Limit Warning */}
        {isOverLimit && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-800">Transaction Limit Exceeded</h4>
                <p className="text-sm text-red-700">
                  Amount exceeds maximum limit of {maxTransactionAmount.toLocaleString()} {config.currency}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Order Summary */}
        <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span>{subtotal.toFixed(2)} {config.currency}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax (8%):</span>
            <span>{taxAmount.toFixed(2)} {config.currency}</span>
          </div>
          {config.tipEnabled && (
            <div className="flex justify-between text-sm">
              <span>Tip:</span>
              <span>{finalTipAmount.toFixed(2)} {config.currency}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total:</span>
            <span className="text-green-600">{total.toFixed(2)} {config.currency}</span>
          </div>
        </div>

        {/* Tip Selection */}
        {config.tipEnabled && (
          <div className="space-y-3">
            <Label className="text-sm font-medium">Tip Amount</Label>
            <div className="grid grid-cols-4 gap-2">
              {[15, 18, 20, 25].map((percentage) => (
                <Button
                  key={percentage}
                  variant={Math.abs(tipAmount - (totalAmount * percentage / 100)) < 0.01 ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleTipChange(percentage)}
                >
                  {percentage}%
                </Button>
              ))}
            </div>
            <Input
              type="number"
              step="0.01"
              placeholder="Custom tip amount"
              value={finalTipAmount.toFixed(2)}
              onChange={(e) => setTipAmount(parseFloat(e.target.value) || 0)}
              className="text-sm"
            />
          </div>
        )}

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

        {/* Signature Requirement Notice */}
        {signatureRequired && paymentMethod === 'card' && (
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-800">
                Signature required for this transaction
              </span>
            </div>
          </div>
        )}

        {/* Cash Payment Details */}
        {paymentMethod === 'cash' && (
          <div className="space-y-3">
            <div>
              <Label htmlFor="cashReceived" className="text-sm font-medium">
                Cash Received ({config.currency})
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
                    {change.toFixed(2)} {config.currency}
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
            disabled={isProcessing || isOverLimit || (paymentMethod === 'cash' && (!cashReceived || parseFloat(cashReceived) < total))}
            className="w-full h-12 text-lg font-bold bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <Printer className="w-4 h-4 animate-spin" />
                Processing & Printing...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4" />
                Process {paymentMethod === 'cash' ? 'Cash' : 'Card'} Payment & Print Receipt
              </div>
            )}
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
