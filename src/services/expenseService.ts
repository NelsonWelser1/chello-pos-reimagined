import { supabase } from "@/integrations/supabase/client";

export interface Expense {
  id: string;
  amount: number;
  description: string;
  expense_type_id: string;
  vendor?: string;
  receipt_number?: string;
  receipt_url?: string;
  expense_date: string;
  paid_date?: string;
  approval_status: 'pending' | 'approved' | 'rejected';
  approved_by?: string;
  approved_at?: string;
  payment_method: string;
  payment_status: 'pending' | 'paid' | 'overdue';
  tags: string[];
  notes?: string;
  attachments: string[];
  tax_amount: number;
  is_recurring: boolean;
  recurring_frequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  gl_code?: string;
  cost_center?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export type NewExpense = Omit<Expense, 'id' | 'created_at' | 'updated_at'>;
export type UpdateExpense = Partial<NewExpense>;

export interface ExpenseStats {
  totalExpenses: number;
  totalAmount: number;
  averageAmount: number;
  pendingApproval: number;
  overdueBills: number;
  monthlyTotal: number;
  categoryBreakdown: Record<string, { count: number; amount: number }>;
  vendorBreakdown: Record<string, { count: number; amount: number }>;
  paymentMethodBreakdown: Record<string, number>;
  approvalStatusBreakdown: Record<string, number>;
}

export interface ExpenseReport {
  period: string;
  totalExpenses: number;
  totalAmount: number;
  categoryBreakdown: Record<string, number>;
  monthlyTrend: Array<{ month: string; amount: number }>;
  topVendors: Array<{ vendor: string; amount: number }>;
  taxSummary: {
    totalTax: number;
    deductibleAmount: number;
  };
}

export class ExpenseService {
  // Get all expenses
  static async getExpenses(filters?: {
    startDate?: string;
    endDate?: string;
    expense_type_id?: string;
    approval_status?: string;
    payment_status?: string;
  }): Promise<Expense[]> {
    try {
      let query = supabase
        .from('expenses')
        .select('*')
        .order('expense_date', { ascending: false });

      if (filters?.startDate) {
        query = query.gte('expense_date', filters.startDate);
      }
      if (filters?.endDate) {
        query = query.lte('expense_date', filters.endDate);
      }
      if (filters?.expense_type_id) {
        query = query.eq('expense_type_id', filters.expense_type_id);
      }
      if (filters?.approval_status) {
        query = query.eq('approval_status', filters.approval_status);
      }
      if (filters?.payment_status) {
        query = query.eq('payment_status', filters.payment_status);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching expenses:', error);
        throw error;
      }

      return data || [];
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
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching expense by ID:', error);
        return null;
      }

      return data;
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

      return data;
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

      return data;
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

  // Get expense statistics
  static async getExpenseStats(period = '30'): Promise<ExpenseStats> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(period));

      const expenses = await this.getExpenses({
        startDate: startDate.toISOString().split('T')[0]
      });

      const totalExpenses = expenses.length;
      const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);
      const averageAmount = totalExpenses > 0 ? totalAmount / totalExpenses : 0;
      const pendingApproval = expenses.filter(exp => exp.approval_status === 'pending').length;
      const overdueBills = expenses.filter(exp => 
        exp.payment_status === 'pending' && new Date(exp.expense_date) < new Date()
      ).length;

      const thisMonth = new Date().getMonth();
      const thisYear = new Date().getFullYear();
      const monthlyTotal = expenses
        .filter(exp => {
          const expDate = new Date(exp.expense_date);
          return expDate.getMonth() === thisMonth && expDate.getFullYear() === thisYear;
        })
        .reduce((sum, exp) => sum + exp.amount, 0);

      // Category breakdown would require joining with expense_types
      const categoryBreakdown: Record<string, { count: number; amount: number }> = {};
      
      const vendorBreakdown = expenses.reduce((acc, exp) => {
        if (exp.vendor) {
          if (!acc[exp.vendor]) acc[exp.vendor] = { count: 0, amount: 0 };
          acc[exp.vendor].count++;
          acc[exp.vendor].amount += exp.amount;
        }
        return acc;
      }, {} as Record<string, { count: number; amount: number }>);

      const paymentMethodBreakdown = expenses.reduce((acc, exp) => {
        acc[exp.payment_method] = (acc[exp.payment_method] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const approvalStatusBreakdown = expenses.reduce((acc, exp) => {
        acc[exp.approval_status] = (acc[exp.approval_status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        totalExpenses,
        totalAmount,
        averageAmount,
        pendingApproval,
        overdueBills,
        monthlyTotal,
        categoryBreakdown,
        vendorBreakdown,
        paymentMethodBreakdown,
        approvalStatusBreakdown
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
        .select('*')
        .or(`description.ilike.%${query}%,vendor.ilike.%${query}%,receipt_number.ilike.%${query}%`)
        .order('expense_date', { ascending: false });

      if (error) {
        console.error('Error searching expenses:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in searchExpenses:', error);
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

  // Mark expense as paid
  static async markAsPaid(id: string): Promise<Expense | null> {
    try {
      return await this.updateExpense(id, {
        payment_status: 'paid',
        paid_date: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error marking expense as paid:', error);
      throw error;
    }
  }

  // Generate expense report
  static async generateExpenseReport(
    startDate: string,
    endDate: string
  ): Promise<ExpenseReport> {
    try {
      const expenses = await this.getExpenses({ startDate, endDate });

      const totalExpenses = expenses.length;
      const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);
      
      // Category breakdown would require joining with expense_types
      const categoryBreakdown: Record<string, number> = {};

      // Monthly trend calculation
      const monthlyTrend: Array<{ month: string; amount: number }> = [];

      // Top vendors
      const vendorTotals = expenses.reduce((acc, exp) => {
        if (exp.vendor) {
          acc[exp.vendor] = (acc[exp.vendor] || 0) + exp.amount;
        }
        return acc;
      }, {} as Record<string, number>);

      const topVendors = Object.entries(vendorTotals)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([vendor, amount]) => ({ vendor, amount }));

      const totalTax = expenses.reduce((sum, exp) => sum + exp.tax_amount, 0);

      return {
        period: `${startDate} to ${endDate}`,
        totalExpenses,
        totalAmount,
        categoryBreakdown,
        monthlyTrend,
        topVendors,
        taxSummary: {
          totalTax,
          deductibleAmount: totalTax // Would need to calculate based on expense types
        }
      };
    } catch (error) {
      console.error('Error generating expense report:', error);
      throw error;
    }
  }

  // Get recurring expenses
  static async getRecurringExpenses(): Promise<Expense[]> {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('is_recurring', true)
        .order('expense_date', { ascending: false });

      if (error) {
        console.error('Error fetching recurring expenses:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getRecurringExpenses:', error);
      throw error;
    }
  }
}