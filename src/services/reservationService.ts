import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Reservation {
  id: string;
  customer_name: string;
  phone: string;
  email?: string;
  date: string;
  time: string;
  party_size: number;
  table_id?: string;
  duration_minutes: number;
  status: 'pending' | 'confirmed' | 'seated' | 'completed' | 'cancelled' | 'no_show';
  special_requests?: string;
  created_at: string;
  updated_at: string;
}

export interface ReservationStats {
  totalToday: number;
  totalUpcoming: number;
  avgPartySize: number;
  peakHours: string[];
  occupancyRate: number;
  noShowRate: number;
}

export class ReservationService {
  // Get all reservations
  static async getReservations(date?: string): Promise<Reservation[]> {
    try {
      let query = supabase
        .from('reservations')
        .select('*')
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (date) {
        query = query.eq('date', date);
      }

      const { data, error } = await query;

      if (error) throw error;
      return (data || []) as Reservation[];
    } catch (error) {
      console.error('Error fetching reservations:', error);
      return [];
    }
  }

  // Get reservation by ID
  static async getReservation(id: string): Promise<Reservation | null> {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Reservation | null;
    } catch (error) {
      console.error('Error fetching reservation:', error);
      return null;
    }
  }

  // Create reservation
  static async createReservation(reservation: Omit<Reservation, 'id' | 'created_at' | 'updated_at'>): Promise<Reservation | null> {
    try {
      // Check table availability if table_id is provided
      if (reservation.table_id) {
        const isAvailable = await this.checkTableAvailability(
          reservation.table_id,
          reservation.date,
          reservation.time,
          reservation.duration_minutes
        );

        if (!isAvailable) {
          toast({
            title: "Error",
            description: "Selected table is not available at the requested time.",
            variant: "destructive",
          });
          return null;
        }
      }

      const { data, error } = await supabase
        .from('reservations')
        .insert([{
          ...reservation,
          status: 'pending'
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Reservation created successfully!",
      });
      return data as Reservation;
    } catch (error) {
      console.error('Error creating reservation:', error);
      toast({
        title: "Error",
        description: "Failed to create reservation.",
        variant: "destructive",
      });
      return null;
    }
  }

  // Update reservation
  static async updateReservation(id: string, updates: Partial<Reservation>): Promise<boolean> {
    try {
      // If updating table or time, check availability
      if (updates.table_id || updates.time || updates.date) {
        const currentReservation = await this.getReservation(id);
        if (currentReservation) {
          const tableId = updates.table_id || currentReservation.table_id;
          const date = updates.date || currentReservation.date;
          const time = updates.time || currentReservation.time;
          const duration = updates.duration_minutes || currentReservation.duration_minutes;

          if (tableId) {
            const isAvailable = await this.checkTableAvailability(
              tableId,
              date,
              time,
              duration,
              id // Exclude current reservation from availability check
            );

            if (!isAvailable) {
              toast({
                title: "Error",
                description: "Selected table is not available at the requested time.",
                variant: "destructive",
              });
              return false;
            }
          }
        }
      }

      const { error } = await supabase
        .from('reservations')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Reservation updated successfully!",
      });
      return true;
    } catch (error) {
      console.error('Error updating reservation:', error);
      toast({
        title: "Error",
        description: "Failed to update reservation.",
        variant: "destructive",
      });
      return false;
    }
  }

  // Delete reservation
  static async deleteReservation(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('reservations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Reservation cancelled successfully!",
      });
      return true;
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      toast({
        title: "Error",
        description: "Failed to cancel reservation.",
        variant: "destructive",
      });
      return false;
    }
  }

  // Check table availability
  static async checkTableAvailability(
    tableId: string,
    date: string,
    time: string,
    durationMinutes: number,
    excludeReservationId?: string
  ): Promise<boolean> {
    try {
      const requestedStart = new Date(`${date}T${time}`);
      const requestedEnd = new Date(requestedStart.getTime() + durationMinutes * 60000);

      let query = supabase
        .from('reservations')
        .select('*')
        .eq('table_id', tableId)
        .eq('date', date)
        .not('status', 'in', '(cancelled,no_show)');

      if (excludeReservationId) {
        query = query.neq('id', excludeReservationId);
      }

      const { data: existingReservations, error } = await query;

      if (error) throw error;

      // Check for overlapping reservations
      for (const reservation of existingReservations || []) {
        const existingStart = new Date(`${reservation.date}T${reservation.time}`);
        const existingEnd = new Date(existingStart.getTime() + reservation.duration_minutes * 60000);

        // Check if times overlap
        if (
          (requestedStart >= existingStart && requestedStart < existingEnd) ||
          (requestedEnd > existingStart && requestedEnd <= existingEnd) ||
          (requestedStart <= existingStart && requestedEnd >= existingEnd)
        ) {
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Error checking table availability:', error);
      return false;
    }
  }

  // Get today's reservations
  static async getTodaysReservations(): Promise<Reservation[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.getReservations(today);
  }

  // Get upcoming reservations
  static async getUpcomingReservations(days: number = 7): Promise<Reservation[]> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + days);
      const futureDateStr = futureDate.toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .gte('date', today)
        .lte('date', futureDateStr)
        .not('status', 'in', '(cancelled,no_show,completed)')
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (error) throw error;
      return (data || []) as Reservation[];
    } catch (error) {
      console.error('Error fetching upcoming reservations:', error);
      return [];
    }
  }

  // Get reservation statistics
  static async getReservationStats(): Promise<ReservationStats> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0];

      // Get all reservations for stats
      const { data: allReservations, error } = await supabase
        .from('reservations')
        .select('*')
        .gte('date', thirtyDaysAgoStr);

      if (error) throw error;

      const todaysReservations = allReservations?.filter(r => r.date === today) || [];
      const upcomingReservations = allReservations?.filter(r => r.date >= today && r.status !== 'cancelled' && r.status !== 'no_show') || [];
      
      const totalPartySize = allReservations?.reduce((sum, r) => sum + r.party_size, 0) || 0;
      const avgPartySize = allReservations?.length ? totalPartySize / allReservations.length : 0;

      // Calculate peak hours
      const hourCounts = new Map<number, number>();
      allReservations?.forEach(reservation => {
        const hour = parseInt(reservation.time.split(':')[0]);
        hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1);
      });

      const peakHours = Array.from(hourCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([hour]) => `${hour}:00`);

      // Calculate no-show rate
      const completedReservations = allReservations?.filter(r => r.status === 'completed' || r.status === 'no_show') || [];
      const noShowCount = allReservations?.filter(r => r.status === 'no_show').length || 0;
      const noShowRate = completedReservations.length ? (noShowCount / completedReservations.length) * 100 : 0;

      // Calculate occupancy rate (simplified)
      const occupancyRate = Math.min(100, (todaysReservations.length / 10) * 100); // Assuming 10 tables max

      return {
        totalToday: todaysReservations.length,
        totalUpcoming: upcomingReservations.length,
        avgPartySize: Math.round(avgPartySize * 10) / 10,
        peakHours,
        occupancyRate: Math.round(occupancyRate),
        noShowRate: Math.round(noShowRate * 10) / 10
      };
    } catch (error) {
      console.error('Error fetching reservation stats:', error);
      return {
        totalToday: 0,
        totalUpcoming: 0,
        avgPartySize: 0,
        peakHours: [],
        occupancyRate: 0,
        noShowRate: 0
      };
    }
  }

  // Search reservations
  static async searchReservations(query: string): Promise<Reservation[]> {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .or(`customer_name.ilike.%${query}%,phone.ilike.%${query}%,email.ilike.%${query}%`)
        .order('date', { ascending: false })
        .limit(20);

      if (error) throw error;
      return (data || []) as Reservation[];
    } catch (error) {
      console.error('Error searching reservations:', error);
      return [];
    }
  }

  // Confirm reservation
  static async confirmReservation(id: string): Promise<boolean> {
    return this.updateReservation(id, { status: 'confirmed' });
  }

  // Mark reservation as seated
  static async seatReservation(id: string): Promise<boolean> {
    return this.updateReservation(id, { status: 'seated' });
  }

  // Mark reservation as completed
  static async completeReservation(id: string): Promise<boolean> {
    return this.updateReservation(id, { status: 'completed' });
  }

  // Mark reservation as no-show
  static async markNoShow(id: string): Promise<boolean> {
    return this.updateReservation(id, { status: 'no_show' });
  }
}