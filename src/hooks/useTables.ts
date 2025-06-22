
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
  const [error, setError] = useState<string | null>(null);

  const fetchTables = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Fetching tables from Supabase...");
      const { data, error } = await supabase
        .from('tables')
        .select('*')
        .order('number', { ascending: true });

      if (error) {
        console.error('Error fetching tables:', error);
        setError('Failed to load tables');
        toast.error('Failed to load tables');
        return;
      }

      console.log("Tables fetched successfully:", data);
      setTables((data || []).map(table => ({
        ...table,
        status: table.status as Table['status'],
        shape: table.shape as Table['shape']
      })));
    } catch (error) {
      console.error('Error fetching tables:', error);
      setError('Failed to load tables');
      toast.error('Failed to load tables');
    } finally {
      setLoading(false);
    }
  };

  const createTable = async (tableData: Omit<Table, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      console.log("Creating table with data:", tableData);
      
      // Check if table number already exists
      const { data: existingTable } = await supabase
        .from('tables')
        .select('number')
        .eq('number', tableData.number)
        .single();

      if (existingTable) {
        throw new Error(`Table ${tableData.number} already exists`);
      }

      const { data, error } = await supabase
        .from('tables')
        .insert([{
          ...tableData,
          position_x: tableData.position_x || Math.floor(Math.random() * 300),
          position_y: tableData.position_y || Math.floor(Math.random() * 200)
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating table:', error);
        throw new Error(error.message || 'Failed to create table');
      }

      if (data) {
        const typedTable: Table = {
          ...data,
          status: data.status as Table['status'],
          shape: data.shape as Table['shape']
        };
        
        console.log("Table created successfully:", typedTable);
        setTables(prev => [...prev, typedTable].sort((a, b) => a.number - b.number));
        return typedTable;
      }
    } catch (error) {
      console.error('Error creating table:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create table';
      toast.error(errorMessage);
      throw error;
    }
    return null;
  };

  const updateTable = async (id: string, updates: Partial<Table>) => {
    try {
      console.log("Updating table:", id, updates);
      
      const { data, error } = await supabase
        .from('tables')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating table:', error);
        throw new Error(error.message || 'Failed to update table');
      }

      if (data) {
        const typedTable: Table = {
          ...data,
          status: data.status as Table['status'],
          shape: data.shape as Table['shape']
        };
        
        console.log("Table updated successfully:", typedTable);
        setTables(prev => prev.map(table => table.id === id ? typedTable : table));
        return true;
      }
    } catch (error) {
      console.error('Error updating table:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update table';
      toast.error(errorMessage);
      throw error;
    }
    return false;
  };

  const deleteTable = async (id: string) => {
    try {
      console.log("Deleting table:", id);
      
      const { error } = await supabase
        .from('tables')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting table:', error);
        throw new Error(error.message || 'Failed to delete table');
      }

      console.log("Table deleted successfully");
      setTables(prev => prev.filter(table => table.id !== id));
      toast.success('Table deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting table:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete table';
      toast.error(errorMessage);
      throw error;
    }
  };

  const updateTableStatus = async (id: string, status: Table['status']) => {
    return await updateTable(id, { status });
  };

  // Set up real-time subscriptions for table updates
  useEffect(() => {
    fetchTables();

    const channel = supabase
      .channel('tables-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tables'
        },
        (payload) => {
          console.log('Real-time table update:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newTable = {
              ...payload.new,
              status: payload.new.status as Table['status'],
              shape: payload.new.shape as Table['shape']
            } as Table;
            setTables(prev => [...prev, newTable].sort((a, b) => a.number - b.number));
          } else if (payload.eventType === 'UPDATE') {
            const updatedTable = {
              ...payload.new,
              status: payload.new.status as Table['status'],
              shape: payload.new.shape as Table['shape']
            } as Table;
            setTables(prev => prev.map(table => 
              table.id === updatedTable.id ? updatedTable : table
            ));
          } else if (payload.eventType === 'DELETE') {
            setTables(prev => prev.filter(table => table.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    tables,
    loading,
    error,
    createTable,
    updateTable,
    deleteTable,
    updateTableStatus,
    refetch: fetchTables
  };
}
