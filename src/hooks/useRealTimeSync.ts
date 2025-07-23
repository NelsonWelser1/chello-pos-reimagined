import { useEffect, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface UseRealTimeSyncProps {
  onOrderUpdate?: () => void;
  onKitchenUpdate?: () => void;
  onMenuUpdate?: () => void;
  onStockUpdate?: () => void;
  onSalesUpdate?: () => void;
  onStaffUpdate?: () => void;
  onCustomerUpdate?: () => void;
  onTransactionUpdate?: () => void;
}

export function useRealTimeSync({
  onOrderUpdate,
  onKitchenUpdate,
  onMenuUpdate,
  onStockUpdate,
  onSalesUpdate,
  onStaffUpdate,
  onCustomerUpdate,
  onTransactionUpdate
}: UseRealTimeSyncProps) {
  const channelsRef = useRef<any[]>([]);

  useEffect(() => {
    const channels: any[] = [];
    const channelId = Math.random().toString(36).substr(2, 9); // Unique ID for this instance

    // Orders realtime updates
    if (onOrderUpdate) {
      const ordersChannel = supabase
        .channel(`orders-changes-${channelId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'orders'
          },
          () => {
            console.log('Orders updated, triggering refresh...');
            onOrderUpdate();
          }
        )
        .subscribe();
      
      channels.push(ordersChannel);
    }

    // Kitchen orders realtime updates
    if (onKitchenUpdate) {
      const kitchenChannel = supabase
        .channel(`kitchen-orders-changes-${channelId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'kitchen_orders'
          },
          () => {
            console.log('Kitchen orders updated, triggering refresh...');
            onKitchenUpdate();
          }
        )
        .subscribe();
      
      channels.push(kitchenChannel);
    }

    // Menu items realtime updates
    if (onMenuUpdate || onStockUpdate) {
      const menuChannel = supabase
        .channel(`menu-items-changes-${channelId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'menu_items'
          },
          () => {
            console.log('Menu items updated, triggering refresh...');
            if (onMenuUpdate) onMenuUpdate();
            if (onStockUpdate) onStockUpdate();
          }
        )
        .subscribe();
      
      channels.push(menuChannel);
    }

    // Sales transactions realtime updates
    if (onSalesUpdate || onTransactionUpdate) {
      const salesChannel = supabase
        .channel(`sales-transactions-changes-${channelId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'sales_transactions'
          },
          () => {
            console.log('Sales transactions updated, triggering refresh...');
            if (onSalesUpdate) onSalesUpdate();
            if (onTransactionUpdate) onTransactionUpdate();
          }
        )
        .subscribe();
      
      channels.push(salesChannel);
    }

    // Staff realtime updates
    if (onStaffUpdate) {
      const staffChannel = supabase
        .channel(`staff-changes-${channelId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'staff'
          },
          () => {
            console.log('Staff updated, triggering refresh...');
            onStaffUpdate();
          }
        )
        .subscribe();
      
      channels.push(staffChannel);
    }

    // Customers realtime updates
    if (onCustomerUpdate) {
      const customerChannel = supabase
        .channel(`customers-changes-${channelId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'customers'
          },
          () => {
            console.log('Customers updated, triggering refresh...');
            onCustomerUpdate();
          }
        )
        .subscribe();
      
      channels.push(customerChannel);
    }

    channelsRef.current = channels;

    return () => {
      console.log(`🧹 Cleaning up ${channels.length} real-time subscriptions for instance ${channelId}`);
      channels.forEach(channel => {
        try {
          supabase.removeChannel(channel);
        } catch (error) {
          console.warn('Error removing channel:', error);
        }
      });
      channelsRef.current = [];
    };
  }, [onOrderUpdate, onKitchenUpdate, onMenuUpdate, onStockUpdate, onSalesUpdate, onStaffUpdate, onCustomerUpdate, onTransactionUpdate]);

  return {
    isConnected: channelsRef.current.length > 0
  };
}