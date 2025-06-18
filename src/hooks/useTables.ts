
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Table {
  id: string;
  number: number;
  seats: number;
  status: 'available' | 'occupied' | 'reserved' | 'cleaning';
  shape: 'round' | 'square' | 'rectangle';
  location: string;
  position_x: number;
  position_y: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export function useTables() {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTables = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tables')
        .select('*')
        .order('number', { ascending: true });

      if (error) {
        console.error('Error fetching tables:', error);
        toast.error('Failed to load tables');
        return;
      }

      setTables((data || []).map(table => ({
        ...table,
        status: table.status as Table['status'],
        shape: table.shape as Table['shape']
      })));
    } catch (error) {
      console.error('Error fetching tables:', error);
      toast.error('Failed to load tables');
    } finally {
      setLoading(false);
    }
  };

  const createTable = async (tableData: Omit<Table, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('tables')
        .insert([tableData])
        .select()
        .single();

      if (error) {
        console.error('Error creating table:', error);
        toast.error('Failed to create table');
        return null;
      }

      if (data) {
        const typedTable: Table = {
          ...data,
          status: data.status as Table['status'],
          shape: data.shape as Table['shape']
        };
        setTables(prev => [...prev, typedTable].sort((a, b) => a.number - b.number));
        toast.success(`Table ${data.number} created successfully`);
        return typedTable;
      }
    } catch (error) {
      console.error('Error creating table:', error);
      toast.error('Failed to create table');
    }
    return null;
  };

  const updateTable = async (id: string, updates: Partial<Table>) => {
    try {
      const { data, error } = await supabase
        .from('tables')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating table:', error);
        toast.error('Failed to update table');
        return false;
      }

      if (data) {
        const typedTable: Table = {
          ...data,
          status: data.status as Table['status'],
          shape: data.shape as Table['shape']
        };
        setTables(prev => prev.map(table => table.id === id ? typedTable : table));
        toast.success(`Table ${data.number} updated successfully`);
        return true;
      }
    } catch (error) {
      console.error('Error updating table:', error);
      toast.error('Failed to update table');
    }
    return false;
  };

  const deleteTable = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tables')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting table:', error);
        toast.error('Failed to delete table');
        return false;
      }

      setTables(prev => prev.filter(table => table.id !== id));
      toast.success('Table deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting table:', error);
      toast.error('Failed to delete table');
    }
    return false;
  };

  const updateTableStatus = async (id: string, status: Table['status']) => {
    return await updateTable(id, { status });
  };

  useEffect(() => {
    fetchTables();
  }, []);

  return {
    tables,
    loading,
    createTable,
    updateTable,
    deleteTable,
    updateTableStatus,
    refetch: fetchTables
  };
}
