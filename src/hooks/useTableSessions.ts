
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface TableSession {
  id: string;
  table_id: string;
  customer_name?: string;
  party_size: number;
  started_at: string;
  ended_at?: string;
  status: 'active' | 'completed';
  notes?: string;
  created_at: string;
  updated_at: string;
  table?: {
    id: string;
    number: number;
    seats: number;
  };
}

export function useTableSessions() {
  const [sessions, setSessions] = useState<TableSession[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('table_sessions')
        .select(`
          *,
          table:tables(id, number, seats)
        `)
        .order('started_at', { ascending: false });

      if (error) {
        console.error('Error fetching table sessions:', error);
        toast.error('Failed to load table sessions');
        return;
      }

      setSessions(data as TableSession[] || []);
    } catch (error) {
      console.error('Error fetching table sessions:', error);
      toast.error('Failed to load table sessions');
    } finally {
      setLoading(false);
    }
  };

  const startTableSession = async (sessionData: Omit<TableSession, 'id' | 'created_at' | 'updated_at' | 'table' | 'started_at' | 'status'>) => {
    try {
      const { data, error } = await supabase
        .from('table_sessions')
        .insert([{ ...sessionData, status: 'active' }])
        .select(`
          *,
          table:tables(id, number, seats)
        `)
        .single();

      if (error) {
        console.error('Error starting table session:', error);
        toast.error('Failed to start table session');
        return null;
      }

      if (data) {
        setSessions(prev => [data as TableSession, ...prev]);
        toast.success(`Table session started for ${data.customer_name || 'customer'}`);
        return data as TableSession;
      }
    } catch (error) {
      console.error('Error starting table session:', error);
      toast.error('Failed to start table session');
    }
    return null;
  };

  const endTableSession = async (sessionId: string) => {
    try {
      const { data, error } = await supabase
        .from('table_sessions')
        .update({ 
          status: 'completed',
          ended_at: new Date().toISOString()
        })
        .eq('id', sessionId)
        .select(`
          *,
          table:tables(id, number, seats)
        `)
        .single();

      if (error) {
        console.error('Error ending table session:', error);
        toast.error('Failed to end table session');
        return false;
      }

      if (data) {
        setSessions(prev => prev.map(session => session.id === sessionId ? data as TableSession : session));
        toast.success('Table session ended successfully');
        return true;
      }
    } catch (error) {
      console.error('Error ending table session:', error);
      toast.error('Failed to end table session');
    }
    return false;
  };

  const updateTableSession = async (sessionId: string, updates: Partial<TableSession>) => {
    try {
      const { data, error } = await supabase
        .from('table_sessions')
        .update(updates)
        .eq('id', sessionId)
        .select(`
          *,
          table:tables(id, number, seats)
        `)
        .single();

      if (error) {
        console.error('Error updating table session:', error);
        toast.error('Failed to update table session');
        return false;
      }

      if (data) {
        setSessions(prev => prev.map(session => session.id === sessionId ? data as TableSession : session));
        toast.success('Table session updated successfully');
        return true;
      }
    } catch (error) {
      console.error('Error updating table session:', error);
      toast.error('Failed to update table session');
    }
    return false;
  };

  const getActiveSessionForTable = (tableId: string) => {
    return sessions.find(session => session.table_id === tableId && session.status === 'active');
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  return {
    sessions,
    loading,
    startTableSession,
    endTableSession,
    updateTableSession,
    getActiveSessionForTable,
    refetch: fetchSessions
  };
}
