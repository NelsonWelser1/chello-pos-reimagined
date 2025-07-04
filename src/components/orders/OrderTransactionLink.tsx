
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Receipt } from "lucide-react";
import { useSalesTransactions } from "@/hooks/useSalesTransactions";
import { usePaymentConfiguration } from "@/hooks/usePaymentConfiguration";
import { format } from "date-fns";

interface OrderTransactionLinkProps {
  orderId: string;
  onViewTransaction?: (transactionId: string) => void;
}

export function OrderTransactionLink({ orderId, onViewTransaction }: OrderTransactionLinkProps) {
  const { transactions } = useSalesTransactions();
  const { config } = usePaymentConfiguration();

  // Find the transaction associated with this order
  const orderTransaction = transactions.find(t => t.order_id === orderId);

  if (!orderTransaction) {
    return (
      <Badge variant="outline" className="text-gray-500">
        No Transaction
      </Badge>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "pending_settlement": return "bg-blue-100 text-blue-800";
      case "pending_verification": return "bg-orange-100 text-orange-800";
      case "failed": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Badge className={getStatusColor(orderTransaction.payment_status)}>
        {orderTransaction.payment_status.replace('_', ' ')}
      </Badge>
      <div className="text-xs text-gray-500">
        {orderTransaction.total_amount.toFixed(2)} {config?.currency || 'UGX'}
      </div>
      {onViewTransaction && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewTransaction(orderTransaction.id)}
          className="h-6 w-6 p-0"
        >
          <ExternalLink className="w-3 h-3" />
        </Button>
      )}
    </div>
  );
}
