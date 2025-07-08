
import { Receipt, ReceiptData, BusinessInfo } from "@/types/receipt";
import { ReceiptRepository } from "@/repositories/receiptRepository";
import { ReceiptFormatter } from "@/utils/receiptFormatter";
import { ReceiptPrinter } from "@/utils/receiptPrinter";

class ReceiptService {
  private businessInfo: BusinessInfo = {
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

      const receipt = await ReceiptRepository.create({
        order_id: receiptData.orderId,
        receipt_number: receiptNumber,
        receipt_data: fullReceiptData
      });

      return receipt;
    } catch (error) {
      console.error('Error in generateReceipt:', error);
      return null;
    }
  }

  async printReceipt(receipt: Receipt): Promise<boolean> {
    try {
      // Mark receipt as printed
      await ReceiptRepository.markAsPrinted(receipt.id);

      // Generate print content
      const printContent = ReceiptFormatter.generatePrintContent(receipt.receipt_data);
      
      // Try to print using different methods
      const printed = await ReceiptPrinter.attemptPrint(printContent);
      
      return printed;
    } catch (error) {
      console.error('Error printing receipt:', error);
      return false;
    }
  }

  formatReceiptForDisplay(data: ReceiptData): string {
    return ReceiptFormatter.generatePrintContent(data);
  }
}

export const receiptService = new ReceiptService();
