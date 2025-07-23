import { supabase } from "@/integrations/supabase/client";

export interface ExpenseType {
  id: string;
  name: string;
  description?: string;
  category: string;
  color: string;
  budget_limit: number;
  budget_period: 'Monthly' | 'Quarterly' | 'Yearly';
  is_active: boolean;
  tax_deductible: boolean;
  requires_approval: boolean;
  approval_threshold: number;
  auto_recurring: boolean;
  notification_threshold: number;
  allow_over_budget: boolean;
  default_vendors: string[];
  gl_code?: string;
  cost_center?: string;
  priority: 'Low' | 'Medium' | 'High';
  restricted_users: string[];
  tags: string[];
  created_at: string;
  updated_at: string;
}

export type NewExpenseType = Omit<ExpenseType, 'id' | 'created_at' | 'updated_at'>;
export type UpdateExpenseType = Partial<NewExpenseType>;

export interface ExpenseTypeStats {
  totalTypes: number;
  activeTypes: number;
  totalBudget: number;
  usedBudget: number;
  budgetUtilization: number;
  categoryBreakdown: Record<string, number>;
  overBudgetTypes: Array<{
    id: string;
    name: string;
    budget_limit: number;
    spent: number;
    overage: number;
  }>;
  topSpendingTypes: Array<{
    id: string;
    name: string;
    spent: number;
    budget_limit: number;
  }>;
}

export interface BudgetAnalysis {
  expense_type_id: string;
  name: string;
  budget_limit: number;
  spent_amount: number;
  remaining_budget: number;
  utilization_percentage: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  projected_spend: number;
  is_over_budget: boolean;
  days_remaining: number;
}

export class ExpenseTypeService {
  // Get all expense types
  static async getExpenseTypes(): Promise<ExpenseType[]> {
    try {
      const { data, error } = await supabase
        .from('expense_types')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching expense types:', error);
        throw error;
      }

      return (data || []) as ExpenseType[];
    } catch (error) {
      console.error('Error in getExpenseTypes:', error);
      throw error;
    }
  }

  // Get active expense types
  static async getActiveExpenseTypes(): Promise<ExpenseType[]> {
    try {
      const { data, error } = await supabase
        .from('expense_types')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching active expense types:', error);
        throw error;
      }

      return (data || []) as ExpenseType[];
    } catch (error) {
      console.error('Error in getActiveExpenseTypes:', error);
      throw error;
    }
  }

  // Get expense type by ID
  static async getExpenseTypeById(id: string): Promise<ExpenseType | null> {
    try {
      const { data, error } = await supabase
        .from('expense_types')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching expense type by ID:', error);
        return null;
      }

      return data as ExpenseType;
    } catch (error) {
      console.error('Error in getExpenseTypeById:', error);
      return null;
    }
  }

  // Create new expense type
  static async createExpenseType(expenseTypeData: NewExpenseType): Promise<ExpenseType | null> {
    try {
      const { data, error } = await supabase
        .from('expense_types')
        .insert(expenseTypeData)
        .select()
        .single();

      if (error) {
        console.error('Error creating expense type:', error);
        throw error;
      }

      return data as ExpenseType;
    } catch (error) {
      console.error('Error in createExpenseType:', error);
      throw error;
    }
  }

  // Update expense type
  static async updateExpenseType(id: string, expenseTypeData: UpdateExpenseType): Promise<ExpenseType | null> {
    try {
      const { data, error } = await supabase
        .from('expense_types')
        .update({ ...expenseTypeData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating expense type:', error);
        throw error;
      }

      return data as ExpenseType;
    } catch (error) {
      console.error('Error in updateExpenseType:', error);
      throw error;
    }
  }

  // Delete expense type
  static async deleteExpenseType(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('expense_types')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting expense type:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteExpenseType:', error);
      throw error;
    }
  }

  // Get expense type statistics
  static async getExpenseTypeStats(): Promise<ExpenseTypeStats> {
    try {
      const expenseTypes = await this.getExpenseTypes();
      
      const totalTypes = expenseTypes.length;
      const activeTypes = expenseTypes.filter(et => et.is_active).length;
      const totalBudget = expenseTypes.reduce((sum, et) => sum + et.budget_limit, 0);
      
      // Would need to join with expenses table to get actual spending
      const usedBudget = 0; // Placeholder
      const budgetUtilization = totalBudget > 0 ? (usedBudget / totalBudget) * 100 : 0;

      const categoryBreakdown = expenseTypes.reduce((acc, et) => {
        acc[et.category] = (acc[et.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Placeholder arrays - would need expense data
      const overBudgetTypes: any[] = [];
      const topSpendingTypes: any[] = [];

      return {
        totalTypes,
        activeTypes,
        totalBudget,
        usedBudget,
        budgetUtilization,
        categoryBreakdown,
        overBudgetTypes,
        topSpendingTypes
      };
    } catch (error) {
      console.error('Error getting expense type stats:', error);
      throw error;
    }
  }

  // Search expense types
  static async searchExpenseTypes(query: string): Promise<ExpenseType[]> {
    try {
      const { data, error } = await supabase
        .from('expense_types')
        .select('*')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
        .order('name', { ascending: true });

      if (error) {
        console.error('Error searching expense types:', error);
        throw error;
      }

      return (data || []) as ExpenseType[];
    } catch (error) {
      console.error('Error in searchExpenseTypes:', error);
      throw error;
    }
  }

  // Toggle expense type active status
  static async toggleExpenseTypeStatus(id: string, currentStatus: boolean): Promise<ExpenseType | null> {
    try {
      return await this.updateExpenseType(id, { is_active: !currentStatus });
    } catch (error) {
      console.error('Error toggling expense type status:', error);
      throw error;
    }
  }

  // Get expense types by category
  static async getExpenseTypesByCategory(category: string): Promise<ExpenseType[]> {
    try {
      const { data, error } = await supabase
        .from('expense_types')
        .select('*')
        .eq('category', category)
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching expense types by category:', error);
        throw error;
      }

      return (data || []) as ExpenseType[];
    } catch (error) {
      console.error('Error in getExpenseTypesByCategory:', error);
      throw error;
    }
  }

  // Get expense type categories
  static async getExpenseTypeCategories(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('expense_types')
        .select('category')
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching expense type categories:', error);
        throw error;
      }

      const categories = [...new Set(data?.map(et => et.category) || [])];
      return categories.sort();
    } catch (error) {
      console.error('Error in getExpenseTypeCategories:', error);
      throw error;
    }
  }

  // Get budget analysis
  static async getBudgetAnalysis(): Promise<BudgetAnalysis[]> {
    try {
      const expenseTypes = await this.getExpenseTypes();
      
      // This would require joining with expenses table to get actual spending
      return expenseTypes.map(et => ({
        expense_type_id: et.id,
        name: et.name,
        budget_limit: et.budget_limit,
        spent_amount: 0, // Would calculate from expenses
        remaining_budget: et.budget_limit,
        utilization_percentage: 0,
        trend: 'stable' as const,
        projected_spend: 0,
        is_over_budget: false,
        days_remaining: 30 // Would calculate based on budget period
      }));
    } catch (error) {
      console.error('Error getting budget analysis:', error);
      throw error;
    }
  }

  // Update budget limit
  static async updateBudgetLimit(id: string, newLimit: number): Promise<ExpenseType | null> {
    try {
      return await this.updateExpenseType(id, { budget_limit: newLimit });
    } catch (error) {
      console.error('Error updating budget limit:', error);
      throw error;
    }
  }

  // Check if expense needs approval
  static async checkApprovalRequired(expenseTypeId: string, amount: number): Promise<boolean> {
    try {
      const expenseType = await this.getExpenseTypeById(expenseTypeId);
      
      if (!expenseType) return false;
      
      return expenseType.requires_approval && amount >= expenseType.approval_threshold;
    } catch (error) {
      console.error('Error checking approval requirement:', error);
      return false;
    }
  }
}