
import { useState, useEffect, useRef } from 'react';
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
  const channelRef = useRef<any>(null);
  const isSubscribedRef = useRef(false);

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

      console.log("Table sessions fetched successfully:", data);
      setSessions((data || []) as TableSession[]);
    } catch (error) {
      console.error('Error fetching table sessions:', error);
      toast.error('Failed to load table sessions');
    } finally {
      setLoading(false);
    }
  };

  const startTableSession = async (sessionData: Omit<TableSession, 'id' | 'created_at' | 'updated_at' | 'table' | 'started_at' | 'status'>) => {
    try {
      console.log("Starting table session:", sessionData);
      
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
        console.log("Table session started successfully:", data);
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
      console.log("Ending table session:", sessionId);
      
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
        console.log("Table session ended successfully:", data);
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
      console.log("Updating table session:", sessionId, updates);
      
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
        console.log("Table session updated successfully:", data);
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

  // Set up real-time subscriptions for table session updates
  useEffect(() => {
    fetchSessions();

    // Only subscribe if we haven't already
    if (!isSubscribedRef.current) {
      // Clean up any existing channel before creating a new one
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }

      const channelName = `table-sessions-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      channelRef.current = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'table_sessions'
          },
          (payload) => {
            console.log('Real-time table session update:', payload);
            
            if (payload.eventType === 'INSERT') {
              // Refetch to get the joined table data
              fetchSessions();
            } else if (payload.eventType === 'UPDATE') {
              // Refetch to get the updated joined table data
              fetchSessions();
            } else if (payload.eventType === 'DELETE') {
              setSessions(prev => prev.filter(session => session.id !== payload.old.id));
            }
          }
        )
        .subscribe((status) => {
          console.log('Table sessions subscription status:', status);
          if (status === 'SUBSCRIBED') {
            isSubscribedRef.current = true;
          } else if (status === 'CLOSED') {
            isSubscribedRef.current = false;
          }
        });
    }

    return () => {
      if (channelRef.current && isSubscribedRef.current) {
        console.log('Cleaning up table sessions subscription');
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
        isSubscribedRef.current = false;
      }
    };
  }, []); // Empty dependency array to run only once

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
