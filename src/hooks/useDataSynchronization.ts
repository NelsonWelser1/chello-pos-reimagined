import { useEffect, useRef, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface CallbackRegistry {
  onOrderUpdate: Set<() => void>;
  onKitchenUpdate: Set<() => void>;
  onMenuUpdate: Set<() => void>;
  onStockUpdate: Set<() => void>;
  onSalesUpdate: Set<() => void>;
  onStaffUpdate: Set<() => void>;
  onCustomerUpdate: Set<() => void>;
  onTransactionUpdate: Set<() => void>;
}

interface UseDataSynchronizationProps {
  onOrderUpdate?: () => void;
  onKitchenUpdate?: () => void;
  onMenuUpdate?: () => void;
  onStockUpdate?: () => void;
  onSalesUpdate?: () => void;
  onStaffUpdate?: () => void;
  onCustomerUpdate?: () => void;
  onTransactionUpdate?: () => void;
}

// Global registry to manage all callbacks
const callbackRegistry: CallbackRegistry = {
  onOrderUpdate: new Set(),
  onKitchenUpdate: new Set(),
  onMenuUpdate: new Set(),
  onStockUpdate: new Set(),
  onSalesUpdate: new Set(),
  onStaffUpdate: new Set(),
  onCustomerUpdate: new Set(),
  onTransactionUpdate: new Set(),
};

// Global channels to prevent duplicate subscriptions
let globalChannels: any[] = [];
let isGloballySubscribed = false;

const setupGlobalSubscriptions = () => {
  if (isGloballySubscribed) return;

  console.log('🌐 Setting up global real-time subscriptions...');
  
  // Orders subscription
  const ordersChannel = supabase
    .channel('global-orders-sync')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'orders'
    }, () => {
      console.log('📦 Global: Orders updated');
      callbackRegistry.onOrderUpdate.forEach(callback => callback());
    })
    .subscribe();

  // Kitchen orders subscription
  const kitchenChannel = supabase
    .channel('global-kitchen-sync')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'kitchen_orders'
    }, () => {
      console.log('👨‍🍳 Global: Kitchen orders updated');
      callbackRegistry.onKitchenUpdate.forEach(callback => callback());
    })
    .subscribe();

   // Menu items subscription
  const menuChannel = supabase
    .channel('global-menu-sync')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'menu_items'
    }, () => {
      console.log('🍽️ Global: Menu items updated');
      callbackRegistry.onMenuUpdate.forEach(callback => callback());
      callbackRegistry.onStockUpdate.forEach(callback => callback());
    })
    .subscribe();

  // Ingredients subscription for stock tracking
  const ingredientsChannel = supabase
    .channel('global-ingredients-sync')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'ingredients'
    }, () => {
      console.log('🥕 Global: Ingredients updated - refreshing stock');
      callbackRegistry.onStockUpdate.forEach(callback => callback());
      callbackRegistry.onMenuUpdate.forEach(callback => callback());
    })
    .subscribe();

  // Sales transactions subscription
  const salesChannel = supabase
    .channel('global-sales-sync')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'sales_transactions'
    }, () => {
      console.log('💰 Global: Sales transactions updated');
      callbackRegistry.onSalesUpdate.forEach(callback => callback());
      callbackRegistry.onTransactionUpdate.forEach(callback => callback());
    })
    .subscribe();

  // Staff subscription
  const staffChannel = supabase
    .channel('global-staff-sync')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'staff'
    }, () => {
      console.log('👥 Global: Staff updated');
      callbackRegistry.onStaffUpdate.forEach(callback => callback());
    })
    .subscribe();

  // Customers subscription
  const customerChannel = supabase
    .channel('global-customers-sync')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'customers'
    }, () => {
      console.log('👤 Global: Customers updated');
      callbackRegistry.onCustomerUpdate.forEach(callback => callback());
    })
    .subscribe();

  globalChannels = [ordersChannel, kitchenChannel, menuChannel, ingredientsChannel, salesChannel, staffChannel, customerChannel];
  isGloballySubscribed = true;
};

const cleanupGlobalSubscriptions = () => {
  if (!isGloballySubscribed) return;
  
  console.log('🧹 Cleaning up global real-time subscriptions...');
  globalChannels.forEach(channel => {
    try {
      supabase.removeChannel(channel);
    } catch (error) {
      console.warn('Error removing global channel:', error);
    }
  });
  globalChannels = [];
  isGloballySubscribed = false;
};

/**
 * Centralized data synchronization hook that manages real-time updates
 * across all restaurant management modules using a global subscription system
 */
export function useDataSynchronization(props: UseDataSynchronizationProps) {
  const {
    onOrderUpdate,
    onKitchenUpdate,
    onMenuUpdate,
    onStockUpdate,
    onSalesUpdate,
    onStaffUpdate,
    onCustomerUpdate,
    onTransactionUpdate
  } = props;

  const callbacksRef = useRef<UseDataSynchronizationProps>({});

  // Register callbacks in global registry
  useEffect(() => {
    // Remove old callbacks
    Object.keys(callbacksRef.current).forEach(key => {
      const oldCallback = callbacksRef.current[key as keyof UseDataSynchronizationProps];
      if (oldCallback) {
        callbackRegistry[key as keyof CallbackRegistry].delete(oldCallback);
      }
    });

    // Add new callbacks
    if (onOrderUpdate) callbackRegistry.onOrderUpdate.add(onOrderUpdate);
    if (onKitchenUpdate) callbackRegistry.onKitchenUpdate.add(onKitchenUpdate);
    if (onMenuUpdate) callbackRegistry.onMenuUpdate.add(onMenuUpdate);
    if (onStockUpdate) callbackRegistry.onStockUpdate.add(onStockUpdate);
    if (onSalesUpdate) callbackRegistry.onSalesUpdate.add(onSalesUpdate);
    if (onStaffUpdate) callbackRegistry.onStaffUpdate.add(onStaffUpdate);
    if (onCustomerUpdate) callbackRegistry.onCustomerUpdate.add(onCustomerUpdate);
    if (onTransactionUpdate) callbackRegistry.onTransactionUpdate.add(onTransactionUpdate);

    // Store current callbacks for cleanup
    callbacksRef.current = props;

    // Setup global subscriptions if not already done
    setupGlobalSubscriptions();

    return () => {
      // Remove callbacks on cleanup
      if (onOrderUpdate) callbackRegistry.onOrderUpdate.delete(onOrderUpdate);
      if (onKitchenUpdate) callbackRegistry.onKitchenUpdate.delete(onKitchenUpdate);
      if (onMenuUpdate) callbackRegistry.onMenuUpdate.delete(onMenuUpdate);
      if (onStockUpdate) callbackRegistry.onStockUpdate.delete(onStockUpdate);
      if (onSalesUpdate) callbackRegistry.onSalesUpdate.delete(onSalesUpdate);
      if (onStaffUpdate) callbackRegistry.onStaffUpdate.delete(onStaffUpdate);
      if (onCustomerUpdate) callbackRegistry.onCustomerUpdate.delete(onCustomerUpdate);
      if (onTransactionUpdate) callbackRegistry.onTransactionUpdate.delete(onTransactionUpdate);

      // Check if we should cleanup global subscriptions
      const hasActiveCallbacks = Object.values(callbackRegistry).some(set => set.size > 0);
      if (!hasActiveCallbacks) {
        cleanupGlobalSubscriptions();
      }
    };
  }, [onOrderUpdate, onKitchenUpdate, onMenuUpdate, onStockUpdate, onSalesUpdate, onStaffUpdate, onCustomerUpdate, onTransactionUpdate]);

  return {
    isConnected: isGloballySubscribed,
    syncStatus: isGloballySubscribed ? 'connected' : 'disconnected'
  };
}