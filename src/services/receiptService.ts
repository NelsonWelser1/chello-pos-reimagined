
import { supabase } from "@/integrations/supabase/client";

export interface ReceiptData {
  orderId: string;
  orderNumber: string;
  transactionId?: string;
  items: Array<{
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    specialInstructions?: string;
  }>;
  subtotal: number;
  taxAmount: number;
  tipAmount?: number;
  total: number;
  paymentMethod: string;
  cashReceived?: number;
  change?: number;
  staffName?: string;
  tableName?: string;
  customerName?: string;
  timestamp: string;
  businessInfo: {
    name: string;
    address: string;
    phone: string;
    email: string;
  };
}

export interface Receipt {
  id: string;
  order_id: string;
  receipt_number: string;
  receipt_data: ReceiptData;
  printed_at?: string;
  created_at: string;
}

class ReceiptService {
  private businessInfo = {
    name: "Chello POS Restaurant",
    address: "123 Restaurant Street, City, State 12345",
    phone: "(555) 123-4567",
    email: "info@chellopos.com"
  };

  async generateReceipt(receiptData: Omit<ReceiptData, 'businessInfo' | 'timestamp'>): Promise<Receipt | null> {
    try {
      const fullReceiptData: ReceiptData = {
        ...receiptData,
        businessInfo: this.businessInfo,
        timestamp: new Date().toISOString()
      };

      const receiptNumber = `RCP-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      const { data, error } = await supabase
        .from('receipts' as any)
        .insert([{
          order_id: receiptData.orderId,
          receipt_number: receiptNumber,
          receipt_data: fullReceiptData
        }])
        .select()
        .single();

      if (error) {
        console.error('Error generating receipt:', error);
        return null;
      }

      return data as Receipt;
    } catch (error) {
      console.error('Error in generateReceipt:', error);
      return null;
    }
  }

  async printReceipt(receipt: Receipt): Promise<boolean> {
    try {
      // Mark receipt as printed
      const { error } = await supabase
        .from('receipts' as any)
        .update({ printed_at: new Date().toISOString() })
        .eq('id', receipt.id);

      if (error) {
        console.error('Error updating receipt print status:', error);
      }

      // Generate print content
      const printContent = this.generatePrintContent(receipt.receipt_data);
      
      // Try to print using different methods
      const printed = await this.attemptPrint(printContent);
      
      return printed;
    } catch (error) {
      console.error('Error printing receipt:', error);
      return false;
    }
  }

  private generatePrintContent(data: ReceiptData): string {
    const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
    const formatDateTime = (timestamp: string) => {
      const date = new Date(timestamp);
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    };

    let content = `
========================================
${data.businessInfo.name.toUpperCase()}
${data.businessInfo.address}
${data.businessInfo.phone}
${data.businessInfo.email}
========================================

Receipt #: ${data.orderNumber}
Order ID: ${data.orderId.slice(0, 8).toUpperCase()}
${data.transactionId ? `Transaction: ${data.transactionId}` : ''}
Date: ${formatDateTime(data.timestamp)}
${data.staffName ? `Staff: ${data.staffName}` : ''}
${data.tableName ? `Table: ${data.tableName}` : ''}
${data.customerName ? `Customer: ${data.customerName}` : ''}

----------------------------------------
ITEMS
----------------------------------------
`;

    data.items.forEach(item => {
      content += `${item.name}\n`;
      if (item.specialInstructions) {
        content += `  * ${item.specialInstructions}\n`;
      }
      content += `  ${item.quantity} x ${formatCurrency(item.unitPrice)} = ${formatCurrency(item.totalPrice)}\n\n`;
    });

    content += `----------------------------------------
TOTALS
----------------------------------------
Subtotal:        ${formatCurrency(data.subtotal)}
Tax:            ${formatCurrency(data.taxAmount)}`;

    if (data.tipAmount && data.tipAmount > 0) {
      content += `\nTip:            ${formatCurrency(data.tipAmount)}`;
    }

    content += `\nTOTAL:          ${formatCurrency(data.total)}

Payment Method: ${data.paymentMethod.toUpperCase()}`;

    if (data.paymentMethod === 'cash' && data.cashReceived && data.change) {
      content += `\nCash Received:  ${formatCurrency(data.cashReceived)}`;
      content += `\nChange:         ${formatCurrency(data.change)}`;
    }

    content += `\n\n========================================
Thank you for your business!
Please come again!
========================================

`;

    return content;
  }

  private async attemptPrint(content: string): Promise<boolean> {
    try {
      // Method 1: Try Web API printing
      if ('print' in window) {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(`
            <html>
              <head>
                <title>Receipt</title>
                <style>
                  body { 
                    font-family: 'Courier New', monospace; 
                    font-size: 12px; 
                    margin: 0; 
                    padding: 10px;
                    white-space: pre-wrap;
                  }
                  @media print {
                    body { margin: 0; }
                  }
                </style>
              </head>
              <body>${content}</body>
            </html>
          `);
          printWindow.document.close();
          printWindow.print();
          setTimeout(() => printWindow.close(), 1000);
          return true;
        }
      }

      // Method 2: Try direct printer API (if available)
      if ('navigator' in window && 'usb' in navigator) {
        // This would be for direct USB printer communication
        // Implementation would depend on specific printer protocols
        console.log('USB printer API available but not implemented');
      }

      // Method 3: Log to console as fallback for development
      console.log('RECEIPT PRINT:\n', content);
      return true;

    } catch (error) {
      console.error('Error in attemptPrint:', error);
      return false;
    }
  }

  formatReceiptForDisplay(data: ReceiptData): string {
    return this.generatePrintContent(data);
  }
}

export const receiptService = new ReceiptService();
