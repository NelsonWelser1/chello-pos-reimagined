
import { Clock, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KitchenOrder } from "@/types/kitchen";
import { getStatusColor, getPriorityColor, getElapsedTime } from "@/utils/kitchenUtils";

interface KitchenOrderCardProps {
  order: KitchenOrder;
  onUpdateStatus: (orderId: string, status: KitchenOrder['status']) => void;
  compact?: boolean;
}

export default function KitchenOrderCard({ order, onUpdateStatus, compact = false }: KitchenOrderCardProps) {
  return (
    <Card className={`shadow-lg border-2 ${getPriorityColor(order.priority)} hover:shadow-xl transition-all duration-300`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-black text-slate-800">
              {order.order_number}
            </CardTitle>
            <p className="text-sm text-slate-600 font-medium">
              {order.customer_name} {order.table_number ? `• Table ${order.table_number}` : ''}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge className={`${getStatusColor(order.status)} text-white font-bold`}>
              {order.status.toUpperCase()}
            </Badge>
            <Badge variant="outline" className="font-bold">
              {order.priority.toUpperCase()}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Order Items */}
        <div className="space-y-2">
          {order.items.map(item => (
            <div key={item.id} className={`bg-slate-50 rounded-lg ${compact ? 'p-2' : 'p-3'}`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className={`font-bold text-slate-800 ${compact ? 'text-sm' : ''}`}>
                    {item.quantity}x {compact ? item.name.slice(0, 20) + (item.name.length > 20 ? '...' : '') : item.name}
                  </p>
                  {!compact && item.special_instructions && (
                    <p className="text-sm text-red-600 font-medium mt-1">
                      Note: {item.special_instructions}
                    </p>
                  )}
                </div>
                {!compact && (
                  <Badge variant="secondary" className="font-bold">
                    {item.prep_time}m
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Timing Info */}
        {!compact && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" />
              <span className="font-medium">
                Elapsed: {getElapsedTime(order.created_at)}m
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 text-slate-500" />
              <span className="font-medium">
                Est: {order.estimated_time}m
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className={`flex gap-2 pt-2 ${compact ? 'flex-col' : ''}`}>
          {order.status === 'pending' && (
            <Button
              onClick={() => onUpdateStatus(order.id, 'preparing')}
              className={`${compact ? 'w-full text-xs py-1' : 'flex-1'} bg-blue-500 hover:bg-blue-600 font-bold`}
            >
              {compact ? 'Start' : 'Start Preparing'}
            </Button>
          )}
          {order.status === 'preparing' && (
            <Button
              onClick={() => onUpdateStatus(order.id, 'ready')}
              className={`${compact ? 'w-full text-xs py-1' : 'flex-1'} bg-green-500 hover:bg-green-600 font-bold`}
            >
              {compact ? 'Ready' : 'Mark Ready'}
            </Button>
          )}
          {order.status === 'ready' && (
            <Button
              onClick={() => onUpdateStatus(order.id, 'served')}
              className={`${compact ? 'w-full text-xs py-1' : 'flex-1'} bg-gray-500 hover:bg-gray-600 font-bold`}
            >
              {compact ? 'Served' : 'Mark Served'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
