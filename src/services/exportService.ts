
import { SalesTransaction } from "@/hooks/useSalesTransactions";

export interface ExportOptions {
  format: 'csv' | 'json' | 'xlsx';
  dateRange?: {
    from: string;
    to: string;
  };
  includeHeaders?: boolean;
  selectedFields?: string[];
}

export class ExportService {
  static async exportTransactions(
    transactions: SalesTransaction[],
    options: ExportOptions
  ): Promise<void> {
    let filteredTransactions = transactions;

    // Apply date range filter if provided
    if (options.dateRange) {
      filteredTransactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.transaction_date);
        const fromDate = new Date(options.dateRange!.from);
        const toDate = new Date(options.dateRange!.to);
        return transactionDate >= fromDate && transactionDate <= toDate;
      });
    }

    switch (options.format) {
      case 'csv':
        await this.exportAsCSV(filteredTransactions, options);
        break;
      case 'json':
        await this.exportAsJSON(filteredTransactions, options);
        break;
      case 'xlsx':
        await this.exportAsExcel(filteredTransactions, options);
        break;
    }
  }

  private static async exportAsCSV(
    transactions: SalesTransaction[],
    options: ExportOptions
  ): Promise<void> {
    const headers = [
      'Transaction ID',
      'Date',
      'Time',
      'Total Amount',
      'Payment Method',
      'Payment Status',
      'Customer ID',
      'Staff ID',
      'Subtotal',
      'Tax Amount',
      'Discount Amount',
      'Notes'
    ];

    let csvContent = '';
    
    if (options.includeHeaders) {
      csvContent += headers.join(',') + '\n';
    }

    transactions.forEach(transaction => {
      const row = [
        transaction.transaction_id,
        new Date(transaction.transaction_date).toLocaleDateString(),
        new Date(transaction.transaction_date).toLocaleTimeString(),
        transaction.total_amount.toFixed(2),
        transaction.payment_method,
        transaction.payment_status,
        transaction.customer_id || '',
        transaction.staff_id || '',
        transaction.subtotal.toFixed(2),
        transaction.tax_amount.toFixed(2),
        transaction.discount_amount?.toFixed(2) || '0.00',
        transaction.notes || ''
      ];

      csvContent += row.map(field => `"${field}"`).join(',') + '\n';
    });

    this.downloadFile(csvContent, 'sales_transactions.csv', 'text/csv');
  }

  private static async exportAsJSON(
    transactions: SalesTransaction[],
    options: ExportOptions
  ): Promise<void> {
    const exportData = {
      exportDate: new Date().toISOString(),
      totalRecords: transactions.length,
      dateRange: options.dateRange,
      transactions: transactions.map(transaction => ({
        transactionId: transaction.transaction_id,
        date: transaction.transaction_date,
        totalAmount: transaction.total_amount,
        paymentMethod: transaction.payment_method,
        paymentStatus: transaction.payment_status,
        customerId: transaction.customer_id,
        staffId: transaction.staff_id,
        subtotal: transaction.subtotal,
        taxAmount: transaction.tax_amount,
        discountAmount: transaction.discount_amount,
        notes: transaction.notes
      }))
    };

    const jsonContent = JSON.stringify(exportData, null, 2);
    this.downloadFile(jsonContent, 'sales_transactions.json', 'application/json');
  }

  private static async exportAsExcel(
    transactions: SalesTransaction[],
    options: ExportOptions
  ): Promise<void> {
    // For Excel export, we'll create a CSV with Excel-compatible formatting
    // In a real application, you would use a library like xlsx or exceljs
    const headers = [
      'Transaction ID',
      'Date',
      'Time',
      'Total Amount',
      'Payment Method',
      'Payment Status',
      'Customer ID',
      'Staff ID',
      'Subtotal',
      'Tax Amount',
      'Discount Amount',
      'Notes'
    ];

    let csvContent = '';
    
    if (options.includeHeaders) {
      csvContent += headers.join('\t') + '\n';
    }

    transactions.forEach(transaction => {
      const row = [
        transaction.transaction_id,
        new Date(transaction.transaction_date).toLocaleDateString(),
        new Date(transaction.transaction_date).toLocaleTimeString(),
        transaction.total_amount.toFixed(2),
        transaction.payment_method,
        transaction.payment_status,
        transaction.customer_id || '',
        transaction.staff_id || '',
        transaction.subtotal.toFixed(2),
        transaction.tax_amount.toFixed(2),
        transaction.discount_amount?.toFixed(2) || '0.00',
        transaction.notes || ''
      ];

      csvContent += row.join('\t') + '\n';
    });

    this.downloadFile(csvContent, 'sales_transactions.xlsx', 'application/vnd.ms-excel');
  }

  private static downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  static getExportSummary(transactions: SalesTransaction[]): {
    totalTransactions: number;
    totalAmount: number;
    dateRange: { from: string; to: string } | null;
  } {
    if (transactions.length === 0) {
      return {
        totalTransactions: 0,
        totalAmount: 0,
        dateRange: null
      };
    }

    const dates = transactions.map(t => new Date(t.transaction_date));
    const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));

    return {
      totalTransactions: transactions.length,
      totalAmount: transactions.reduce((sum, t) => sum + t.total_amount, 0),
      dateRange: {
        from: minDate.toLocaleDateString(),
        to: maxDate.toLocaleDateString()
      }
    };
  }
}
