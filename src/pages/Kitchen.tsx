
import { useState } from "react";
import { ChefHat, Clock, CheckCircle, AlertCircle, Timer, Users, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useKitchenOrders, type KitchenOrder } from "@/hooks/useKitchenOrders";

export default function Kitchen() {
  const { orders, loading, updateOrderStatus } = useKitchenOrders();
  const [activeTab, setActiveTab] = useState('all');

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

  const getElapsedTime = (createdAt: string) => {
    const now = new Date();
    const created = new Date(createdAt);
    const elapsed = Math.floor((now.getTime() - created.getTime()) / 60000);
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

  if (loading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <main className="flex-1">
            <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b px-4 py-3 shadow-sm">
              <SidebarTrigger className="hover:bg-orange-50 transition-colors" />
            </div>
            
            <div className="p-6">
              <div className="text-center py-12">
                <div className="text-xl text-slate-600">Loading kitchen orders...</div>
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1">
          <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b px-4 py-3 shadow-sm">
            <SidebarTrigger className="hover:bg-orange-50 transition-colors" />
          </div>
          
          <div className="bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 p-6">
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
                                  <div key={item.id} className="bg-slate-50 p-3 rounded-lg">
                                    <div className="flex justify-between items-start">
                                      <div className="flex-1">
                                        <p className="font-bold text-slate-800">
                                          {item.quantity}x {item.name}
                                        </p>
                                        {item.special_instructions && (
                                          <p className="text-sm text-red-600 font-medium mt-1">
                                            Note: {item.special_instructions}
                                          </p>
                                        )}
                                      </div>
                                      <Badge variant="secondary" className="font-bold">
                                        {item.prep_time}m
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
                          <p className="text-slate-400 text-sm mt-2">
                            New orders from the POS system will appear here automatically
                          </p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
