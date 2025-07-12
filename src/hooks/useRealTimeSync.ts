import { useEffect, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface UseRealTimeSyncProps {
  onOrderUpdate?: () => void;
  onKitchenUpdate?: () => void;
  onMenuUpdate?: () => void;
  onStockUpdate?: () => void;
}

export function useRealTimeSync({
  onOrderUpdate,
  onKitchenUpdate,
  onMenuUpdate,
  onStockUpdate
}: UseRealTimeSyncProps) {
  const channelsRef = useRef<any[]>([]);

  useEffect(() => {
    const channels: any[] = [];

    // Orders realtime updates
    if (onOrderUpdate) {
      const ordersChannel = supabase
        .channel('orders-changes')
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
        .channel('kitchen-orders-changes')
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
        .channel('menu-items-changes')
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

    channelsRef.current = channels;

    return () => {
      channels.forEach(channel => {
        supabase.removeChannel(channel);
      });
      channelsRef.current = [];
    };
  }, [onOrderUpdate, onKitchenUpdate, onMenuUpdate, onStockUpdate]);

  return {
    isConnected: channelsRef.current.length > 0
  };
}