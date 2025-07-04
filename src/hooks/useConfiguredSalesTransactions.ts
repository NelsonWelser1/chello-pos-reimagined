
import { useSalesTransactions } from './useSalesTransactions';
import { paymentConfigService } from '@/services/paymentConfigService';
import { toast } from 'sonner';

export function useConfiguredSalesTransactions() {
  const { transactions, loading, createTransaction, updateTransaction, refetch } = useSalesTransactions();

  const createConfiguredTransaction = async (transactionData: any) => {
    try {
      const config = await paymentConfigService.getConfig();
      
      // Apply configuration-based rules
      const enhancedTransactionData = {
        ...transactionData,
        // Apply auto-settlement flag
        payment_status: config.autoSettlement ? 'completed' : 'pending_settlement',
        // Add fraud detection notes if enabled
        notes: config.fraudDetection ? 
          `${transactionData.notes || ''} | Fraud detection: ${config.fraudDetection ? 'enabled' : 'disabled'}`.trim() :
          transactionData.notes,
        // Ensure currency matches configuration
        total_amount: transactionData.total_amount,
        // Add configuration metadata
        transaction_date: new Date().toISOString()
      };

      // Check transaction limits
      const maxAmount = parseFloat(config.maxTransactionAmount);
      if (enhancedTransactionData.total_amount > maxAmount) {
        toast.error(`Transaction amount exceeds maximum limit of ${maxAmount.toLocaleString()} ${config.currency}`);
        return null;
      }

      const result = await createTransaction(enhancedTransactionData);
      
      if (result && config.fraudDetection && transactionData.payment_method === 'card') {
        toast.info('Transaction created with fraud detection review');
      }
      
      return result;
    } catch (error) {
      console.error('Error creating configured transaction:', error);
      toast.error('Failed to create transaction');
      return null;
    }
  };

  return {
    transactions,
    loading,
    createTransaction: createConfiguredTransaction,
    updateTransaction,
    refetch
  };
}
