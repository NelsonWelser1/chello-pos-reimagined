
import { supabase } from "@/integrations/supabase/client";

export interface PaymentConfigSettings {
  autoSettlement: boolean;
  fraudDetection: boolean;
  requireSignature: boolean;
  tipEnabled: boolean;
  defaultTipPercentage: string;
  maxTransactionAmount: string;
  currency: string;
  merchantId: string;
  terminalId: string;
}

class PaymentConfigService {
  private static instance: PaymentConfigService;
  private configCache: PaymentConfigSettings | null = null;
  private cacheExpiry: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  static getInstance(): PaymentConfigService {
    if (!PaymentConfigService.instance) {
      PaymentConfigService.instance = new PaymentConfigService();
    }
    return PaymentConfigService.instance;
  }

  async getConfig(): Promise<PaymentConfigSettings> {
    const now = Date.now();
    
    // Return cached config if still valid
    if (this.configCache && now < this.cacheExpiry) {
      return this.configCache;
    }

    try {
      const { data, error } = await supabase
        .from('payment_configurations')
        .select('*');

      if (error) {
        console.error('Error fetching payment configuration:', error);
        return this.getDefaultConfig();
      }

      // Convert array of config items to object
      const configObject: any = {};
      data?.forEach(item => {
        configObject[item.setting_key] = item.setting_value;
      });

      this.configCache = {
        autoSettlement: configObject.autoSettlement ?? true,
        fraudDetection: configObject.fraudDetection ?? true,
        requireSignature: configObject.requireSignature ?? false,
        tipEnabled: configObject.tipEnabled ?? true,
        defaultTipPercentage: configObject.defaultTipPercentage ?? "18",
        maxTransactionAmount: configObject.maxTransactionAmount ?? "500000",
        currency: configObject.currency ?? "UGX",
        merchantId: configObject.merchantId ?? "MERCH_12345",
        terminalId: configObject.terminalId ?? "TERM_001"
      };

      this.cacheExpiry = now + this.CACHE_DURATION;
      return this.configCache;
    } catch (error) {
      console.error('Error in getConfig:', error);
      return this.getDefaultConfig();
    }
  }

  async saveConfig(config: PaymentConfigSettings): Promise<boolean> {
    try {
      const configEntries = Object.entries(config).map(([key, value]) => ({
        setting_key: key,
        setting_type: typeof value,
        setting_value: value,
        description: this.getSettingDescription(key)
      }));

      // Upsert each configuration setting
      for (const entry of configEntries) {
        const { error } = await supabase
          .from('payment_configurations')
          .upsert(entry, { 
            onConflict: 'setting_key',
            ignoreDuplicates: false 
          });

        if (error) {
          console.error(`Error saving config ${entry.setting_key}:`, error);
          return false;
        }
      }

      // Clear cache to force refresh
      this.configCache = null;
      this.cacheExpiry = 0;
      
      return true;
    } catch (error) {
      console.error('Error saving payment configuration:', error);
      return false;
    }
  }

  private getDefaultConfig(): PaymentConfigSettings {
    return {
      autoSettlement: true,
      fraudDetection: true,
      requireSignature: false,
      tipEnabled: true,
      defaultTipPercentage: "18",
      maxTransactionAmount: "500000",
      currency: "UGX",
      merchantId: "MERCH_12345",
      terminalId: "TERM_001"
    };
  }

  private getSettingDescription(key: string): string {
    const descriptions: Record<string, string> = {
      autoSettlement: "Automatically settle transactions daily",
      fraudDetection: "Enable advanced fraud protection",
      requireSignature: "Require signature for transactions",
      tipEnabled: "Allow customers to add tips",
      defaultTipPercentage: "Default tip percentage",
      maxTransactionAmount: "Maximum transaction amount in UGX",
      currency: "Primary currency for transactions",
      merchantId: "Merchant identification number",
      terminalId: "Terminal identification number"
    };
    return descriptions[key] || "";
  }

  clearCache(): void {
    this.configCache = null;
    this.cacheExpiry = 0;
  }
}

export const paymentConfigService = PaymentConfigService.getInstance();
