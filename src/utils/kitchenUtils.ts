
import { KitchenOrder } from "@/types/kitchen";

export const getStatusColor = (status: KitchenOrder['status']) => {
  switch (status) {
    case 'pending': return 'bg-yellow-500';
    case 'preparing': return 'bg-blue-500';
    case 'ready': return 'bg-green-500';
    case 'served': return 'bg-gray-500';
    default: return 'bg-gray-500';
  }
};

export const getPriorityColor = (priority: KitchenOrder['priority']) => {
  switch (priority) {
    case 'high': return 'border-red-500 bg-red-50';
    case 'medium': return 'border-yellow-500 bg-yellow-50';
    case 'low': return 'border-green-500 bg-green-50';
    default: return 'border-gray-500 bg-gray-50';
  }
};

export const getElapsedTime = (createdAt: string) => {
  const now = new Date();
  const created = new Date(createdAt);
  const elapsed = Math.floor((now.getTime() - created.getTime()) / 60000);
  return elapsed;
};

export const getOrderCounts = (orders: KitchenOrder[]) => {
  return {
    pending: orders.filter(o => o.status === 'pending').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    ready: orders.filter(o => o.status === 'ready').length,
    total: orders.filter(o => o.status !== 'served').length
  };
};

export const filterOrders = (orders: KitchenOrder[], activeTab: string) => {
  switch (activeTab) {
    case 'pending': return orders.filter(order => order.status === 'pending');
    case 'preparing': return orders.filter(order => order.status === 'preparing');
    case 'ready': return orders.filter(order => order.status === 'ready');
    default: return orders.filter(order => order.status !== 'served');
  }
};
