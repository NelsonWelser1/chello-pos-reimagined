import { useCallback } from 'react';
import { useRealTimeSync } from './useRealTimeSync';

interface DataSyncCallbacks {
  onOrderUpdate?: () => void;
  onKitchenUpdate?: () => void;
  onMenuUpdate?: () => void;
  onStockUpdate?: () => void;
  onSalesUpdate?: () => void;
  onStaffUpdate?: () => void;
  onCustomerUpdate?: () => void;
  onTransactionUpdate?: () => void;
}

/**
 * Comprehensive data synchronization hook that coordinates real-time updates
 * across all restaurant management modules
 */
export function useDataSynchronization(callbacks: DataSyncCallbacks) {
  const {
    onOrderUpdate,
    onKitchenUpdate,
    onMenuUpdate,
    onStockUpdate,
    onSalesUpdate,
    onStaffUpdate,
    onCustomerUpdate,
    onTransactionUpdate
  } = callbacks;

  // Enhanced callbacks that handle cross-module dependencies
  const handleOrderUpdate = useCallback(() => {
    console.log('🔄 Cross-module sync: Order update detected');
    if (onOrderUpdate) onOrderUpdate();
    // Orders affect kitchen and sales
    if (onKitchenUpdate) onKitchenUpdate();
    if (onSalesUpdate) onSalesUpdate();
  }, [onOrderUpdate, onKitchenUpdate, onSalesUpdate]);

  const handleKitchenUpdate = useCallback(() => {
    console.log('🔄 Cross-module sync: Kitchen update detected');
    if (onKitchenUpdate) onKitchenUpdate();
    // Kitchen updates may affect order status
    if (onOrderUpdate) onOrderUpdate();
  }, [onKitchenUpdate, onOrderUpdate]);

  const handleMenuUpdate = useCallback(() => {
    console.log('🔄 Cross-module sync: Menu update detected');
    if (onMenuUpdate) onMenuUpdate();
    if (onStockUpdate) onStockUpdate();
    // Menu changes may affect kitchen operations
    if (onKitchenUpdate) onKitchenUpdate();
  }, [onMenuUpdate, onStockUpdate, onKitchenUpdate]);

  const handleStockUpdate = useCallback(() => {
    console.log('🔄 Cross-module sync: Stock update detected');
    if (onStockUpdate) onStockUpdate();
    if (onMenuUpdate) onMenuUpdate();
  }, [onStockUpdate, onMenuUpdate]);

  const handleSalesUpdate = useCallback(() => {
    console.log('🔄 Cross-module sync: Sales update detected');
    if (onSalesUpdate) onSalesUpdate();
    if (onTransactionUpdate) onTransactionUpdate();
  }, [onSalesUpdate, onTransactionUpdate]);

  const handleStaffUpdate = useCallback(() => {
    console.log('🔄 Cross-module sync: Staff update detected');
    if (onStaffUpdate) onStaffUpdate();
    // Staff changes may affect order processing
    if (onOrderUpdate) onOrderUpdate();
  }, [onStaffUpdate, onOrderUpdate]);

  const handleCustomerUpdate = useCallback(() => {
    console.log('🔄 Cross-module sync: Customer update detected');
    if (onCustomerUpdate) onCustomerUpdate();
    if (onOrderUpdate) onOrderUpdate();
  }, [onCustomerUpdate, onOrderUpdate]);

  const handleTransactionUpdate = useCallback(() => {
    console.log('🔄 Cross-module sync: Transaction update detected');
    if (onTransactionUpdate) onTransactionUpdate();
    if (onSalesUpdate) onSalesUpdate();
  }, [onTransactionUpdate, onSalesUpdate]);

  // Setup real-time synchronization with enhanced callbacks
  const { isConnected } = useRealTimeSync({
    onOrderUpdate: handleOrderUpdate,
    onKitchenUpdate: handleKitchenUpdate,
    onMenuUpdate: handleMenuUpdate,
    onStockUpdate: handleStockUpdate,
    onSalesUpdate: handleSalesUpdate,
    onStaffUpdate: handleStaffUpdate,
    onCustomerUpdate: handleCustomerUpdate,
    onTransactionUpdate: handleTransactionUpdate,
  });

  return {
    isConnected,
    syncStatus: isConnected ? 'connected' : 'disconnected'
  };
}