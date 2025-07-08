
import { supabase } from "@/integrations/supabase/client";
import { Receipt, ReceiptData } from "@/types/receipt";

export class ReceiptRepository {
  static async create(receiptData: {
    order_id: string;
    receipt_number: string;
    receipt_data: ReceiptData;
  }): Promise<Receipt | null> {
    try {
      const { data, error } = await supabase
        .from('receipts')
        .insert([receiptData])
        .select()
        .single();

      if (error) {
        console.error('Error creating receipt:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in receipt creation:', error);
      return null;
    }
  }

  static async markAsPrinted(receiptId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('receipts')
        .update({ printed_at: new Date().toISOString() })
        .eq('id', receiptId);

      if (error) {
        console.error('Error updating receipt print status:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error marking receipt as printed:', error);
      return false;
    }
  }
}
