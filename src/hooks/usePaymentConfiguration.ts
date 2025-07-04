
import { useState, useEffect } from 'react';
import { paymentConfigService, PaymentConfigSettings } from '@/services/paymentConfigService';
import { toast } from 'sonner';

export function usePaymentConfiguration() {
  const [config, setConfig] = useState<PaymentConfigSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadConfig = async () => {
    try {
      setLoading(true);
      const configuration = await paymentConfigService.getConfig();
      setConfig(configuration);
    } catch (error) {
      console.error('Error loading payment configuration:', error);
      toast.error('Failed to load payment configuration');
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async (newConfig: PaymentConfigSettings) => {
    try {
      setSaving(true);
      const success = await paymentConfigService.saveConfig(newConfig);
      
      if (success) {
        setConfig(newConfig);
        toast.success('Payment configuration saved successfully');
        return true;
      } else {
        toast.error('Failed to save payment configuration');
        return false;
      }
    } catch (error) {
      console.error('Error saving payment configuration:', error);
      toast.error('Failed to save payment configuration');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const refreshConfig = () => {
    paymentConfigService.clearCache();
    loadConfig();
  };

  useEffect(() => {
    loadConfig();
  }, []);

  return {
    config,
    loading,
    saving,
    saveConfig,
    refreshConfig
  };
}
