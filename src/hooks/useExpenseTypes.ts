
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type DbExpenseType = Tables<'expense_types'>;

export interface ExpenseType {
  id: string;
  name: string;
  description: string | null;
  category: 'Food & Beverage' | 'Labor' | 'Rent & Utilities' | 'Marketing' | 'Equipment' | 'Maintenance' | 'Other';
  budgetLimit: number;
  isActive: boolean;
  color: string;
  taxDeductible: boolean;
  requiresApproval: boolean;
  approvalThreshold: number;
  autoRecurring: boolean;
  defaultVendors: string[] | null;
  glCode: string | null;
  costCenter: string | null;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  budgetPeriod: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Yearly';
  notificationThreshold: number;
  allowOverBudget: boolean;
  restrictedUsers: string[] | null;
  tags: string[] | null;
  createdAt: string;
  updatedAt: string;
}

export type NewExpenseType = Omit<ExpenseType, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateExpenseType = Partial<NewExpenseType>;


const mapDbToApp = (dbData: DbExpenseType): ExpenseType => ({
    id: dbData.id,
    name: dbData.name,
    description: dbData.description,
    category: dbData.category as ExpenseType['category'],
    budgetLimit: dbData.budget_limit,
    isActive: dbData.is_active,
    color: dbData.color,
    taxDeductible: dbData.tax_deductible,
    requiresApproval: dbData.requires_approval,
    approvalThreshold: dbData.approval_threshold,
    autoRecurring: dbData.auto_recurring,
    defaultVendors: dbData.default_vendors,
    glCode: dbData.gl_code,
    costCenter: dbData.cost_center,
    priority: dbData.priority as ExpenseType['priority'],
    budgetPeriod: dbData.budget_period as ExpenseType['budgetPeriod'],
    notificationThreshold: dbData.notification_threshold,
    allowOverBudget: dbData.allow_over_budget,
    restrictedUsers: dbData.restricted_users,
    tags: dbData.tags,
    createdAt: dbData.created_at,
    updatedAt: dbData.updated_at,
});

const mapAppToDb = (appData: NewExpenseType | UpdateExpenseType): TablesUpdate<'expense_types'> => ({
    name: appData.name,
    description: appData.description,
    category: appData.category,
    budget_limit: appData.budgetLimit,
    is_active: appData.isActive,
    color: appData.color,
    tax_deductible: appData.taxDeductible,
    requires_approval: appData.requiresApproval,
    approval_threshold: appData.approvalThreshold,
    auto_recurring: appData.autoRecurring,
    default_vendors: appData.defaultVendors,
    gl_code: appData.glCode,
    cost_center: appData.costCenter,
    priority: appData.priority,
    budget_period: appData.budgetPeriod,
    notification_threshold: appData.notificationThreshold,
    allow_over_budget: appData.allowOverBudget,
    restricted_users: appData.restrictedUsers,
    tags: appData.tags,
});

export function useExpenseTypes() {
    const [expenseTypes, setExpenseTypes] = useState<ExpenseType[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchExpenseTypes = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('expense_types')
            .select('*')
            .order('name', { ascending: true });

        if (error) {
            toast({
                title: 'Error fetching expense types',
                description: error.message,
                variant: 'destructive',
            });
            setExpenseTypes([]);
        } else {
            setExpenseTypes(data.map(mapDbToApp));
        }
        setLoading(false);
    }, [toast]);

    useEffect(() => {
        fetchExpenseTypes();
    }, [fetchExpenseTypes]);

    const addExpenseType = async (expenseTypeData: NewExpenseType) => {
        if (!expenseTypeData.name?.trim()) {
            toast({ title: "Validation Error", description: "Expense type name is required.", variant: "destructive" });
            return null;
        }

        const dbData = mapAppToDb(expenseTypeData);

        const { data, error } = await supabase
            .from('expense_types')
            .insert(dbData as TablesInsert<'expense_types'>)
            .select()
            .single();
        
        if (error) {
            toast({ title: 'Error creating expense type', description: error.message, variant: 'destructive' });
            return null;
        }
        
        await fetchExpenseTypes();
        toast({ title: 'Expense Type Created', description: `"${expenseTypeData.name}" has been created successfully.` });
        return data ? mapDbToApp(data) : null;
    };

    const updateExpenseType = async (id: string, expenseTypeData: UpdateExpenseType) => {
        const dbData = mapAppToDb(expenseTypeData);

        const { data, error } = await supabase
            .from('expense_types')
            .update({ ...dbData, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            toast({ title: 'Error updating expense type', description: error.message, variant: 'destructive' });
            return null;
        }

        await fetchExpenseTypes();
        toast({ title: 'Expense Type Updated', description: `Expense type has been updated successfully.` });
        return data ? mapDbToApp(data) : null;
    };
    
    const deleteExpenseType = async (id: string) => {
        const { error } = await supabase
            .from('expense_types')
            .delete()
            .eq('id', id);

        if (error) {
            toast({ title: 'Error deleting expense type', description: error.message, variant: 'destructive' });
            return;
        }

        await fetchExpenseTypes();
        toast({ title: 'Expense Type Deleted', description: 'The expense type has been deleted successfully.' });
    };

    return { expenseTypes, loading, addExpenseType, updateExpenseType, deleteExpenseType };
}
