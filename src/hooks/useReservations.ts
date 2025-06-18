
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Reservation {
  id: string;
  customer_name: string;
  phone: string;
  email?: string;
  date: string;
  time: string;
  party_size: number;
  table_id?: string;
  status: 'pending' | 'confirmed' | 'seated' | 'cancelled' | 'completed';
  special_requests?: string;
  duration_minutes: number;
  created_at: string;
  updated_at: string;
  table?: {
    id: string;
    number: number;
  };
}

export function useReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reservations')
        .select(`
          *,
          table:tables(id, number)
        `)
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (error) {
        console.error('Error fetching reservations:', error);
        toast.error('Failed to load reservations');
        return;
      }

      setReservations(data || []);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      toast.error('Failed to load reservations');
    } finally {
      setLoading(false);
    }
  };

  const createReservation = async (reservationData: Omit<Reservation, 'id' | 'created_at' | 'updated_at' | 'table'>) => {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .insert([reservationData])
        .select(`
          *,
          table:tables(id, number)
        `)
        .single();

      if (error) {
        console.error('Error creating reservation:', error);
        toast.error('Failed to create reservation');
        return null;
      }

      if (data) {
        setReservations(prev => [...prev, data].sort((a, b) => {
          const dateCompare = new Date(a.date).getTime() - new Date(b.date).getTime();
          if (dateCompare === 0) {
            return a.time.localeCompare(b.time);
          }
          return dateCompare;
        }));
        toast.success(`Reservation for ${data.customer_name} created successfully`);
        return data;
      }
    } catch (error) {
      console.error('Error creating reservation:', error);
      toast.error('Failed to create reservation');
    }
    return null;
  };

  const updateReservation = async (id: string, updates: Partial<Reservation>) => {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          table:tables(id, number)
        `)
        .single();

      if (error) {
        console.error('Error updating reservation:', error);
        toast.error('Failed to update reservation');
        return false;
      }

      if (data) {
        setReservations(prev => prev.map(reservation => reservation.id === id ? data : reservation));
        toast.success(`Reservation for ${data.customer_name} updated successfully`);
        return true;
      }
    } catch (error) {
      console.error('Error updating reservation:', error);
      toast.error('Failed to update reservation');
    }
    return false;
  };

  const deleteReservation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('reservations')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting reservation:', error);
        toast.error('Failed to delete reservation');
        return false;
      }

      setReservations(prev => prev.filter(reservation => reservation.id !== id));
      toast.success('Reservation deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting reservation:', error);
      toast.error('Failed to delete reservation');
    }
    return false;
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  return {
    reservations,
    loading,
    createReservation,
    updateReservation,
    deleteReservation,
    refetch: fetchReservations
  };
}
