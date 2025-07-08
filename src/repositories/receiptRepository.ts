
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
        .insert({
          order_id: receiptData.order_id,
          receipt_number: receiptData.receipt_number,
          receipt_data: receiptData.receipt_data as any
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating receipt:', error);
        return null;
      }

      if (!data) {
        console.error('No data returned from receipt creation');
        return null;
      }

      return {
        id: data.id,
        order_id: data.order_id,
        receipt_number: data.receipt_number,
        receipt_data: data.receipt_data as ReceiptData,
        printed_at: data.printed_at,
        created_at: data.created_at,
        updated_at: data.updated_at
      };
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
