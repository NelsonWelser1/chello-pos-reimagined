
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type DbCustomer = Tables<'customers'>;

export interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export type NewCustomer = Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateCustomer = Partial<NewCustomer>;

const mapDbToApp = (dbData: DbCustomer): Customer => ({
    id: dbData.id,
    name: dbData.name,
    email: dbData.email,
    phone: dbData.phone,
    address: dbData.address as Customer['address'],
    createdAt: dbData.created_at,
    updatedAt: dbData.updated_at,
});

const mapAppToDb = (appData: NewCustomer | UpdateCustomer): TablesUpdate<'customers'> => ({
    name: appData.name,
    email: appData.email,
    phone: appData.phone,
    address: appData.address,
});

export function useCustomers() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchCustomers = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('customers')
            .select('*')
            .order('name', { ascending: true });

        if (error) {
            toast({
                title: 'Error fetching customers',
                description: error.message,
                variant: 'destructive',
            });
            setCustomers([]);
        } else {
            setCustomers(data.map(mapDbToApp));
        }
        setLoading(false);
    }, [toast]);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    const addCustomer = async (customerData: NewCustomer) => {
        if (!customerData.name?.trim()) {
            toast({ title: "Validation Error", description: "Customer name is required.", variant: "destructive" });
            return null;
        }

        const dbData = mapAppToDb(customerData);

        const { data, error } = await supabase
            .from('customers')
            .insert(dbData as TablesInsert<'customers'>)
            .select()
            .single();
        
        if (error) {
            toast({ title: 'Error creating customer', description: error.message, variant: 'destructive' });
            return null;
        }
        
        await fetchCustomers();
        toast({ title: 'Customer Created', description: `"${customerData.name}" has been created successfully.` });
        return data ? mapDbToApp(data) : null;
    };

    const updateCustomer = async (id: string, customerData: UpdateCustomer) => {
        const dbData = mapAppToDb(customerData);

        const { data, error } = await supabase
            .from('customers')
            .update({ ...dbData, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            toast({ title: 'Error updating customer', description: error.message, variant: 'destructive' });
            return null;
        }

        await fetchCustomers();
        toast({ title: 'Customer Updated', description: `Customer has been updated successfully.` });
        return data ? mapDbToApp(data) : null;
    };
    
    const deleteCustomer = async (id: string) => {
        const { error } = await supabase
            .from('customers')
            .delete()
            .eq('id', id);

        if (error) {
            toast({ title: 'Error deleting customer', description: error.message, variant: 'destructive' });
            return;
        }

        await fetchCustomers();
        toast({ title: 'Customer Deleted', description: 'The customer has been deleted successfully.' });
    };

    return { customers, loading, addCustomer, updateCustomer, deleteCustomer, fetchCustomers };
}
