
import { ReceiptData } from "@/types/receipt";

export class ReceiptFormatter {
  static formatCurrency(amount: number): string {
    return `$${amount.toFixed(2)}`;
  }

  static formatDateTime(timestamp: string): string {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  }

  static generatePrintContent(data: ReceiptData): string {
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
Date: ${this.formatDateTime(data.timestamp)}
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
      content += `  ${item.quantity} x ${this.formatCurrency(item.unitPrice)} = ${this.formatCurrency(item.totalPrice)}\n\n`;
    });

    content += `----------------------------------------
TOTALS
----------------------------------------
Subtotal:        ${this.formatCurrency(data.subtotal)}
Tax:            ${this.formatCurrency(data.taxAmount)}`;

    if (data.tipAmount && data.tipAmount > 0) {
      content += `\nTip:            ${this.formatCurrency(data.tipAmount)}`;
    }

    content += `\nTOTAL:          ${this.formatCurrency(data.total)}

Payment Method: ${data.paymentMethod.toUpperCase()}`;

    if (data.paymentMethod === 'cash' && data.cashReceived && data.change) {
      content += `\nCash Received:  ${this.formatCurrency(data.cashReceived)}`;
      content += `\nChange:         ${this.formatCurrency(data.change)}`;
    }

    content += `\n\n========================================
Thank you for your business!
Please come again!
========================================

`;

    return content;
  }
}
