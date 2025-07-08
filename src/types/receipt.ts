
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

export interface BusinessInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
}
