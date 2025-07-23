import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    country?: string;
    postal_code?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface CustomerStats {
  totalCustomers: number;
  newThisMonth: number;
  withEmail: number;
  withPhone: number;
  averageOrderValue: number;
  topCustomers: Array<{
    id: string;
    name: string;
    totalSpent: number;
    orderCount: number;
  }>;
}

export class CustomerService {
  // Get all customers
  static async getCustomers(): Promise<Customer[]> {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(customer => ({
        ...customer,
        address: customer.address as any // Type assertion for JSON field
      }));
    } catch (error) {
      console.error('Error fetching customers:', error);
      return [];
    }
  }

  // Get customer by ID
  static async getCustomer(id: string): Promise<Customer | null> {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data ? { ...data, address: data.address as any } : null;
    } catch (error) {
      console.error('Error fetching customer:', error);
      return null;
    }
  }

  // Create customer
  static async createCustomer(customer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>): Promise<Customer | null> {
    try {
      const { data, error } = await supabase
        .from('customers')
        .insert([customer])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Customer created successfully!",
      });
      return data ? { ...data, address: data.address as any } : null;
    } catch (error) {
      console.error('Error creating customer:', error);
      toast({
        title: "Error",
        description: "Failed to create customer.",
        variant: "destructive",
      });
      return null;
    }
  }

  // Update customer
  static async updateCustomer(id: string, updates: Partial<Customer>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('customers')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Customer updated successfully!",
      });
      return true;
    } catch (error) {
      console.error('Error updating customer:', error);
      toast({
        title: "Error",
        description: "Failed to update customer.",
        variant: "destructive",
      });
      return false;
    }
  }

  // Delete customer
  static async deleteCustomer(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Customer deleted successfully!",
      });
      return true;
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast({
        title: "Error",
        description: "Failed to delete customer.",
        variant: "destructive",
      });
      return false;
    }
  }

  // Get customer statistics
  static async getCustomerStats(): Promise<CustomerStats> {
    try {
      // Get all customers
      const { data: customers, error: customersError } = await supabase
        .from('customers')
        .select('*');

      if (customersError) throw customersError;

      // Get customer orders and transactions for analytics
      const { data: transactions, error: transactionsError } = await supabase
        .from('sales_transactions')
        .select(`
          customer_id,
          total_amount,
          transaction_date
        `)
        .not('customer_id', 'is', null);

      if (transactionsError) throw transactionsError;

      const totalCustomers = customers?.length || 0;
      
      // Calculate new customers this month
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const newThisMonth = customers?.filter(customer => {
        const createdDate = new Date(customer.created_at);
        return createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear;
      }).length || 0;

      const withEmail = customers?.filter(customer => customer.email).length || 0;
      const withPhone = customers?.filter(customer => customer.phone).length || 0;

      // Calculate customer spending
      const customerSpending = new Map<string, { totalSpent: number; orderCount: number; name: string }>();
      
      transactions?.forEach(transaction => {
        if (transaction.customer_id) {
          const customer = customers?.find(c => c.id === transaction.customer_id);
          if (customer) {
            const existing = customerSpending.get(transaction.customer_id) || { 
              totalSpent: 0, 
              orderCount: 0, 
              name: customer.name 
            };
            customerSpending.set(transaction.customer_id, {
              totalSpent: existing.totalSpent + transaction.total_amount,
              orderCount: existing.orderCount + 1,
              name: customer.name
            });
          }
        }
      });

      const topCustomers = Array.from(customerSpending.entries())
        .map(([id, data]) => ({ id, ...data }))
        .sort((a, b) => b.totalSpent - a.totalSpent)
        .slice(0, 10);

      const totalSpent = Array.from(customerSpending.values()).reduce((sum, customer) => sum + customer.totalSpent, 0);
      const averageOrderValue = topCustomers.length > 0 ? totalSpent / topCustomers.reduce((sum, customer) => sum + customer.orderCount, 0) : 0;

      return {
        totalCustomers,
        newThisMonth,
        withEmail,
        withPhone,
        averageOrderValue,
        topCustomers
      };
    } catch (error) {
      console.error('Error fetching customer stats:', error);
      return {
        totalCustomers: 0,
        newThisMonth: 0,
        withEmail: 0,
        withPhone: 0,
        averageOrderValue: 0,
        topCustomers: []
      };
    }
  }

  // Search customers
  static async searchCustomers(query: string): Promise<Customer[]> {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .or(`name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return (data || []).map(customer => ({
        ...customer,
        address: customer.address as any
      }));
    } catch (error) {
      console.error('Error searching customers:', error);
      return [];
    }
  }

  // Get customer order history
  static async getCustomerOrderHistory(customerId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            menu_items (name, price)
          ),
          sales_transactions (
            transaction_id,
            payment_status,
            transaction_date
          )
        `)
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching customer order history:', error);
      return [];
    }
  }

  // Export customer data
  static async exportCustomers(format: 'csv' | 'json' = 'csv'): Promise<string> {
    try {
      const customers = await this.getCustomers();
      const stats = await this.getCustomerStats();

      if (format === 'json') {
        return JSON.stringify({ customers, stats }, null, 2);
      }

      // CSV format
      const headers = [
        'ID',
        'Name',
        'Email',
        'Phone',
        'Address',
        'Created Date',
        'Last Updated'
      ];

      const rows = customers.map(customer => [
        customer.id,
        customer.name,
        customer.email || '',
        customer.phone || '',
        customer.address ? JSON.stringify(customer.address) : '',
        new Date(customer.created_at).toLocaleDateString(),
        new Date(customer.updated_at).toLocaleDateString()
      ]);

      const csvContent = [headers, ...rows]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');

      return csvContent;
    } catch (error) {
      console.error('Error exporting customers:', error);
      throw error;
    }
  }
}