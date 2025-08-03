import { CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type KitchenOrder } from "@/types/kitchen";

interface BillingHandlerProps {
  order: KitchenOrder;
  onBillGenerated: () => void;
}

export default function BillingHandler({ order }: BillingHandlerProps) {
  return (
    <Card className="bg-green-50 border-green-200 p-2">
      <CardContent className="p-2 space-y-1">
        <div className="flex items-center gap-1">
          <CheckCircle className="w-3 h-3 text-green-600" />
          <span className="text-xs font-medium text-green-800">
            {order.order_number} - Ready
          </span>
        </div>
        <div className="text-xs text-green-700">
          {order.customer_name} • {order.items.length} items
          {order.table_number && ` • Table ${order.table_number}`}
        </div>
      </CardContent>
    </Card>
  );
}