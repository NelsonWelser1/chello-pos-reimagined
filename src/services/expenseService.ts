import { supabase } from "@/integrations/supabase/client";

export interface Expense {
  id: string;
  expense_type_id: string;
  amount: number;
  expense_date: string;
  vendor?: string;
  receipt_number?: string;
  description?: string;
  approval_status: 'pending' | 'approved' | 'rejected';
  approved_by?: string;
  approved_at?: string;
  payment_method: string;
  payment_reference?: string;
  recurring_expense_id?: string;
  tags?: string[];
  attachments?: any[];
  notes?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export type NewExpense = Omit<Expense, 'id' | 'created_at' | 'updated_at'>;
export type UpdateExpense = Partial<NewExpense>;

export interface ExpenseStats {
  totalExpenses: number;
  totalAmount: number;
  pendingApprovals: number;
  approvedThisMonth: number;
  categoryBreakdown: Record<string, number>;
  monthlyTrend: Array<{
    month: string;
    amount: number;
    count: number;
  }>;
  topVendors: Array<{
    vendor: string;
    amount: number;
    count: number;
  }>;
}

export class ExpenseService {
  // Get all expenses
  static async getExpenses(): Promise<Expense[]> {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select(`
          *,
          expense_types(name, category),
          staff:created_by(name),
          approver:approved_by(name)
        `)
        .order('expense_date', { ascending: false });

      if (error) {
        console.error('Error fetching expenses:', error);
        throw error;
      }

      return (data || []) as Expense[];
    } catch (error) {
      console.error('Error in getExpenses:', error);
      throw error;
    }
  }

  // Get expense by ID
  static async getExpenseById(id: string): Promise<Expense | null> {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select(`
          *,
          expense_types(name, category),
          staff:created_by(name),
          approver:approved_by(name)
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching expense by ID:', error);
        return null;
      }

      return data as Expense;
    } catch (error) {
      console.error('Error in getExpenseById:', error);
      return null;
    }
  }

  // Create new expense
  static async createExpense(expenseData: NewExpense): Promise<Expense | null> {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .insert(expenseData)
        .select()
        .single();

      if (error) {
        console.error('Error creating expense:', error);
        throw error;
      }

      return data as Expense;
    } catch (error) {
      console.error('Error in createExpense:', error);
      throw error;
    }
  }

  // Update expense
  static async updateExpense(id: string, expenseData: UpdateExpense): Promise<Expense | null> {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .update({ ...expenseData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating expense:', error);
        throw error;
      }

      return data as Expense;
    } catch (error) {
      console.error('Error in updateExpense:', error);
      throw error;
    }
  }

  // Delete expense
  static async deleteExpense(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting expense:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteExpense:', error);
      throw error;
    }
  }

  // Get expenses by date range
  static async getExpensesByDateRange(startDate: string, endDate: string): Promise<Expense[]> {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select(`
          *,
          expense_types(name, category)
        `)
        .gte('expense_date', startDate)
        .lte('expense_date', endDate)
        .order('expense_date', { ascending: false });

      if (error) {
        console.error('Error fetching expenses by date range:', error);
        throw error;
      }

      return (data || []) as Expense[];
    } catch (error) {
      console.error('Error in getExpensesByDateRange:', error);
      throw error;
    }
  }

  // Get expenses by approval status
  static async getExpensesByStatus(status: string): Promise<Expense[]> {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select(`
          *,
          expense_types(name, category),
          staff:created_by(name)
        `)
        .eq('approval_status', status)
        .order('expense_date', { ascending: false });

      if (error) {
        console.error('Error fetching expenses by status:', error);
        throw error;
      }

      return (data || []) as Expense[];
    } catch (error) {
      console.error('Error in getExpensesByStatus:', error);
      throw error;
    }
  }

  // Approve expense
  static async approveExpense(id: string, approvedBy: string): Promise<Expense | null> {
    try {
      return await this.updateExpense(id, {
        approval_status: 'approved',
        approved_by: approvedBy,
        approved_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error approving expense:', error);
      throw error;
    }
  }

  // Reject expense
  static async rejectExpense(id: string, approvedBy: string): Promise<Expense | null> {
    try {
      return await this.updateExpense(id, {
        approval_status: 'rejected',
        approved_by: approvedBy,
        approved_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error rejecting expense:', error);
      throw error;
    }
  }

  // Get expense statistics
  static async getExpenseStats(): Promise<ExpenseStats> {
    try {
      const expenses = await this.getExpenses();
      
      const totalExpenses = expenses.length;
      const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
      const pendingApprovals = expenses.filter(e => e.approval_status === 'pending').length;
      
      // Get current month data
      const currentMonth = new Date().toISOString().slice(0, 7);
      const approvedThisMonth = expenses.filter(e => 
        e.approval_status === 'approved' && 
        e.expense_date.startsWith(currentMonth)
      ).length;

      // Category breakdown would need expense_types join
      const categoryBreakdown: Record<string, number> = {};
      
      // Monthly trend (mock data - would need proper aggregation)
      const monthlyTrend = [
        { month: 'Jan', amount: 0, count: 0 },
        { month: 'Feb', amount: 0, count: 0 },
        { month: 'Mar', amount: 0, count: 0 }
      ];

      // Top vendors
      const vendorMap: Record<string, { amount: number; count: number }> = {};
      expenses.forEach(expense => {
        if (expense.vendor) {
          if (!vendorMap[expense.vendor]) {
            vendorMap[expense.vendor] = { amount: 0, count: 0 };
          }
          vendorMap[expense.vendor].amount += expense.amount;
          vendorMap[expense.vendor].count += 1;
        }
      });

      const topVendors = Object.entries(vendorMap)
        .map(([vendor, data]) => ({ vendor, ...data }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5);

      return {
        totalExpenses,
        totalAmount,
        pendingApprovals,
        approvedThisMonth,
        categoryBreakdown,
        monthlyTrend,
        topVendors
      };
    } catch (error) {
      console.error('Error getting expense stats:', error);
      throw error;
    }
  }

  // Search expenses
  static async searchExpenses(query: string): Promise<Expense[]> {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select(`
          *,
          expense_types(name, category)
        `)
        .or(`description.ilike.%${query}%,vendor.ilike.%${query}%,receipt_number.ilike.%${query}%`)
        .order('expense_date', { ascending: false });

      if (error) {
        console.error('Error searching expenses:', error);
        throw error;
      }

      return (data || []) as Expense[];
    } catch (error) {
      console.error('Error in searchExpenses:', error);
      throw error;
    }
  }

  // Export expenses to CSV
  static async exportExpenses(startDate?: string, endDate?: string): Promise<string> {
    try {
      let expenses: Expense[];
      
      if (startDate && endDate) {
        expenses = await this.getExpensesByDateRange(startDate, endDate);
      } else {
        expenses = await this.getExpenses();
      }

      const headers = [
        'Date', 'Amount', 'Vendor', 'Description', 'Status', 'Payment Method'
      ];

      const csvData = expenses.map(expense => [
        expense.expense_date,
        expense.amount.toString(),
        expense.vendor || '',
        expense.description || '',
        expense.approval_status,
        expense.payment_method
      ]);

      const csvContent = [headers, ...csvData]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');

      return csvContent;
    } catch (error) {
      console.error('Error exporting expenses:', error);
      throw error;
    }
  }
}