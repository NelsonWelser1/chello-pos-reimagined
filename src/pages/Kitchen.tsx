
import { useState, useEffect } from "react";
import { ChefHat, Clock, CheckCircle, AlertCircle, Timer, Users, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  specialInstructions?: string;
  prepTime: number;
}

interface KitchenOrder {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  status: 'pending' | 'preparing' | 'ready' | 'served';
  orderTime: Date;
  estimatedTime: number;
  priority: 'low' | 'medium' | 'high';
  customerName?: string;
  table?: string;
}

// Mock data for demonstration
const mockOrders: KitchenOrder[] = [
  {
    id: '1',
    orderNumber: 'ORD-001',
    items: [
      { id: '1', name: 'Classic Burger', quantity: 2, prepTime: 8, specialInstructions: 'No onions' },
      { id: '2', name: 'French Fries', quantity: 2, prepTime: 5 }
    ],
    status: 'pending',
    orderTime: new Date(Date.now() - 5 * 60000),
    estimatedTime: 12,
    priority: 'high',
    customerName: 'John Doe',
    table: 'Table 5'
  },
  {
    id: '2',
    orderNumber: 'ORD-002',
    items: [
      { id: '3', name: 'Margherita Pizza', quantity: 1, prepTime: 15 },
      { id: '4', name: 'Caesar Salad', quantity: 1, prepTime: 8 }
    ],
    status: 'preparing',
    orderTime: new Date(Date.now() - 15 * 60000),
    estimatedTime: 18,
    priority: 'medium',
    customerName: 'Jane Smith',
    table: 'Table 2'
  },
  {
    id: '3',
    orderNumber: 'ORD-003',
    items: [
      { id: '5', name: 'Fish & Chips', quantity: 1, prepTime: 12 },
      { id: '6', name: 'Chocolate Cake', quantity: 1, prepTime: 3 }
    ],
    status: 'ready',
    orderTime: new Date(Date.now() - 25 * 60000),
    estimatedTime: 15,
    priority: 'low',
    customerName: 'Mike Johnson',
    table: 'Table 8'
  }
];

export default function Kitchen() {
  const [orders, setOrders] = useState<KitchenOrder[]>(mockOrders);
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();

  const updateOrderStatus = (orderId: string, newStatus: KitchenOrder['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    
    const order = orders.find(o => o.id === orderId);
    if (order) {
      toast({
        title: "Order Updated",
        description: `Order ${order.orderNumber} marked as ${newStatus}`,
      });
    }
  };

  const getStatusColor = (status: KitchenOrder['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'preparing': return 'bg-blue-500';
      case 'ready': return 'bg-green-500';
      case 'served': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: KitchenOrder['priority']) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-green-500 bg-green-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const getElapsedTime = (orderTime: Date) => {
    const now = new Date();
    const elapsed = Math.floor((now.getTime() - orderTime.getTime()) / 60000);
    return elapsed;
  };

  const filteredOrders = orders.filter(order => {
    switch (activeTab) {
      case 'pending': return order.status === 'pending';
      case 'preparing': return order.status === 'preparing';
      case 'ready': return order.status === 'ready';
      default: return order.status !== 'served';
    }
  });

  const orderCounts = {
    pending: orders.filter(o => o.status === 'pending').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    ready: orders.filter(o => o.status === 'ready').length,
    total: orders.filter(o => o.status !== 'served').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent flex items-center justify-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-xl">
              <ChefHat className="w-10 h-10 text-white" />
            </div>
            Kitchen Management System
          </h1>
          <p className="text-xl text-slate-600 mt-4 font-medium">Real-time order preparation and workflow management</p>
        </div>

        {/* Kitchen Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-xl border-0 bg-gradient-to-br from-yellow-50 to-orange-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Pending Orders</p>
                  <p className="text-3xl font-black text-orange-800">{orderCounts.pending}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">In Preparation</p>
                  <p className="text-3xl font-black text-blue-800">{orderCounts.preparing}</p>
                </div>
                <Flame className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Ready to Serve</p>
                  <p className="text-3xl font-black text-green-800">{orderCounts.ready}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 bg-gradient-to-br from-purple-50 to-pink-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Total Active</p>
                  <p className="text-3xl font-black text-purple-800">{orderCounts.total}</p>
                </div>
                <Users className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Management Tabs */}
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-black text-slate-800">Order Queue Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="all" className="font-bold">
                  All Orders ({orderCounts.total})
                </TabsTrigger>
                <TabsTrigger value="pending" className="font-bold">
                  Pending ({orderCounts.pending})
                </TabsTrigger>
                <TabsTrigger value="preparing" className="font-bold">
                  Preparing ({orderCounts.preparing})
                </TabsTrigger>
                <TabsTrigger value="ready" className="font-bold">
                  Ready ({orderCounts.ready})
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab}>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredOrders.map(order => (
                    <Card key={order.id} className={`shadow-lg border-2 ${getPriorityColor(order.priority)} hover:shadow-xl transition-all duration-300`}>
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg font-black text-slate-800">
                              {order.orderNumber}
                            </CardTitle>
                            <p className="text-sm text-slate-600 font-medium">
                              {order.customerName} • {order.table}
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
                            <div key={item.id} className="bg-slate-50 p-3 rounded-lg">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <p className="font-bold text-slate-800">
                                    {item.quantity}x {item.name}
                                  </p>
                                  {item.specialInstructions && (
                                    <p className="text-sm text-red-600 font-medium mt-1">
                                      Note: {item.specialInstructions}
                                    </p>
                                  )}
                                </div>
                                <Badge variant="secondary" className="font-bold">
                                  {item.prepTime}m
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Timing Info */}
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-slate-500" />
                            <span className="font-medium">
                              Elapsed: {getElapsedTime(order.orderTime)}m
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Timer className="w-4 h-4 text-slate-500" />
                            <span className="font-medium">
                              Est: {order.estimatedTime}m
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-2">
                          {order.status === 'pending' && (
                            <Button
                              onClick={() => updateOrderStatus(order.id, 'preparing')}
                              className="flex-1 bg-blue-500 hover:bg-blue-600 font-bold"
                            >
                              Start Preparing
                            </Button>
                          )}
                          {order.status === 'preparing' && (
                            <Button
                              onClick={() => updateOrderStatus(order.id, 'ready')}
                              className="flex-1 bg-green-500 hover:bg-green-600 font-bold"
                            >
                              Mark Ready
                            </Button>
                          )}
                          {order.status === 'ready' && (
                            <Button
                              onClick={() => updateOrderStatus(order.id, 'served')}
                              className="flex-1 bg-gray-500 hover:bg-gray-600 font-bold"
                            >
                              Mark Served
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredOrders.length === 0 && (
                  <div className="text-center py-12">
                    <ChefHat className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                    <p className="text-slate-500 font-medium text-lg">
                      No orders in this category
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
