import { supabase } from "@/integrations/supabase/client";

export interface PickupPoint {
  id: string;
  name: string;
  address: string;
  coordinates?: { lat: number; lng: number };
  phone?: string;
  email?: string;
  opening_hours: Array<{
    day: string;
    open: string;
    close: string;
    closed: boolean;
  }>;
  capacity: number;
  current_orders: number;
  is_active: boolean;
  delivery_radius: number;
  special_instructions?: string;
  facilities: string[];
  manager_name?: string;
  manager_contact?: string;
  created_at: string;
  updated_at: string;
}

export interface PickupOrder {
  id: string;
  order_id: string;
  pickup_point_id: string;
  customer_name: string;
  customer_phone: string;
  estimated_pickup_time?: string;
  actual_pickup_time?: string;
  pickup_code: string;
  status: 'preparing' | 'ready' | 'picked_up' | 'expired';
  special_instructions?: string;
  assigned_staff_id?: string;
  created_at: string;
  updated_at: string;
}

export type NewPickupPoint = Omit<PickupPoint, 'id' | 'created_at' | 'updated_at'>;
export type UpdatePickupPoint = Partial<NewPickupPoint>;
export type NewPickupOrder = Omit<PickupOrder, 'id' | 'pickup_code' | 'created_at' | 'updated_at'>;
export type UpdatePickupOrder = Partial<Omit<PickupOrder, 'id' | 'pickup_code' | 'created_at' | 'updated_at'>>;

export interface PickupAnalytics {
  totalPickupPoints: number;
  activePickupPoints: number;
  totalOrdersToday: number;
  completedOrdersToday: number;
  averagePickupTime: number;
  busyPickupPoints: Array<{
    id: string;
    name: string;
    current_orders: number;
    capacity: number;
    utilization: number;
  }>;
  statusBreakdown: Record<string, number>;
  hourlyPickupTrend: Array<{
    hour: number;
    count: number;
  }>;
}

export class PickupPointService {
  // Pickup Points Management
  static async getPickupPoints(): Promise<PickupPoint[]> {
    try {
      const { data, error } = await supabase
        .from('pickup_points')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching pickup points:', error);
        throw error;
      }

      return (data || []) as PickupPoint[];
    } catch (error) {
      console.error('Error in getPickupPoints:', error);
      throw error;
    }
  }

  static async getActivePickupPoints(): Promise<PickupPoint[]> {
    try {
      const { data, error } = await supabase
        .from('pickup_points')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching active pickup points:', error);
        throw error;
      }

      return (data || []) as PickupPoint[];
    } catch (error) {
      console.error('Error in getActivePickupPoints:', error);
      throw error;
    }
  }

  static async getPickupPointById(id: string): Promise<PickupPoint | null> {
    try {
      const { data, error } = await supabase
        .from('pickup_points')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching pickup point by ID:', error);
        return null;
      }

      return data as PickupPoint;
    } catch (error) {
      console.error('Error in getPickupPointById:', error);
      return null;
    }
  }

  static async createPickupPoint(pickupPointData: NewPickupPoint): Promise<PickupPoint | null> {
    try {
      const { data, error } = await supabase
        .from('pickup_points')
        .insert(pickupPointData)
        .select()
        .single();

      if (error) {
        console.error('Error creating pickup point:', error);
        throw error;
      }

      return data as PickupPoint;
    } catch (error) {
      console.error('Error in createPickupPoint:', error);
      throw error;
    }
  }

  static async updatePickupPoint(id: string, pickupPointData: UpdatePickupPoint): Promise<PickupPoint | null> {
    try {
      const { data, error } = await supabase
        .from('pickup_points')
        .update({ ...pickupPointData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating pickup point:', error);
        throw error;
      }

      return data as PickupPoint;
    } catch (error) {
      console.error('Error in updatePickupPoint:', error);
      throw error;
    }
  }

  static async deletePickupPoint(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('pickup_points')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting pickup point:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error in deletePickupPoint:', error);
      throw error;
    }
  }

  // Pickup Orders Management
  static async getPickupOrders(): Promise<PickupOrder[]> {
    try {
      const { data, error } = await supabase
        .from('pickup_orders')
        .select(`
          *,
          pickup_points(name, address),
          orders(total_amount, status),
          staff(name)
        `)
        .order('estimated_pickup_time', { ascending: true });

      if (error) {
        console.error('Error fetching pickup orders:', error);
        throw error;
      }

      return (data || []) as PickupOrder[];
    } catch (error) {
      console.error('Error in getPickupOrders:', error);
      throw error;
    }
  }

  static async getPickupOrdersByPoint(pickupPointId: string): Promise<PickupOrder[]> {
    try {
      const { data, error } = await supabase
        .from('pickup_orders')
        .select(`
          *,
          orders(total_amount, status),
          staff(name)
        `)
        .eq('pickup_point_id', pickupPointId)
        .order('estimated_pickup_time', { ascending: true });

      if (error) {
        console.error('Error fetching pickup orders by point:', error);
        throw error;
      }

      return (data || []) as PickupOrder[];
    } catch (error) {
      console.error('Error in getPickupOrdersByPoint:', error);
      throw error;
    }
  }

  static async getPickupOrderByCode(pickupCode: string): Promise<PickupOrder | null> {
    try {
      const { data, error } = await supabase
        .from('pickup_orders')
        .select(`
          *,
          pickup_points(name, address),
          orders(total_amount, status)
        `)
        .eq('pickup_code', pickupCode)
        .maybeSingle();

      if (error) {
        console.error('Error fetching pickup order by code:', error);
        return null;
      }

      return data as PickupOrder;
    } catch (error) {
      console.error('Error in getPickupOrderByCode:', error);
      return null;
    }
  }

  static async createPickupOrder(pickupOrderData: NewPickupOrder): Promise<PickupOrder | null> {
    try {
      // Generate unique pickup code
      const { data: codeData, error: codeError } = await supabase
        .rpc('generate_pickup_code');

      if (codeError || !codeData) {
        throw new Error('Failed to generate pickup code');
      }

      const { data, error } = await supabase
        .from('pickup_orders')
        .insert({
          ...pickupOrderData,
          pickup_code: codeData
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating pickup order:', error);
        throw error;
      }

      // Update pickup point current orders count
      await this.updatePickupPointOrderCount(pickupOrderData.pickup_point_id, 1);

      return data as PickupOrder;
    } catch (error) {
      console.error('Error in createPickupOrder:', error);
      throw error;
    }
  }

  static async updatePickupOrder(id: string, pickupOrderData: UpdatePickupOrder): Promise<PickupOrder | null> {
    try {
      const { data, error } = await supabase
        .from('pickup_orders')
        .update({ ...pickupOrderData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating pickup order:', error);
        throw error;
      }

      return data as PickupOrder;
    } catch (error) {
      console.error('Error in updatePickupOrder:', error);
      throw error;
    }
  }

  static async markOrderReady(id: string, staffId?: string): Promise<PickupOrder | null> {
    try {
      return await this.updatePickupOrder(id, {
        status: 'ready',
        assigned_staff_id: staffId
      });
    } catch (error) {
      console.error('Error marking order ready:', error);
      throw error;
    }
  }

  static async markOrderPickedUp(id: string): Promise<PickupOrder | null> {
    try {
      const order = await this.updatePickupOrder(id, {
        status: 'picked_up',
        actual_pickup_time: new Date().toISOString()
      });

      if (order) {
        // Decrease pickup point current orders count
        await this.updatePickupPointOrderCount(order.pickup_point_id, -1);
      }

      return order;
    } catch (error) {
      console.error('Error marking order picked up:', error);
      throw error;
    }
  }

  // Helper method to update pickup point order count
  private static async updatePickupPointOrderCount(pickupPointId: string, change: number): Promise<void> {
    try {
      const { error } = await supabase
        .rpc('increment_pickup_point_orders', {
          point_id: pickupPointId,
          increment_by: change
        });

      if (error) {
        console.error('Error updating pickup point order count:', error);
      }
    } catch (error) {
      console.error('Error in updatePickupPointOrderCount:', error);
    }
  }

  // Analytics and Search
  static async getPickupAnalytics(): Promise<PickupAnalytics> {
    try {
      const [pickupPoints, pickupOrders] = await Promise.all([
        this.getPickupPoints(),
        this.getPickupOrders()
      ]);

      const totalPickupPoints = pickupPoints.length;
      const activePickupPoints = pickupPoints.filter(pp => pp.is_active).length;

      const today = new Date().toISOString().split('T')[0];
      const todayOrders = pickupOrders.filter(order => 
        order.created_at.startsWith(today)
      );

      const totalOrdersToday = todayOrders.length;
      const completedOrdersToday = todayOrders.filter(order => 
        order.status === 'picked_up'
      ).length;

      // Calculate average pickup time (in minutes)
      const completedOrders = pickupOrders.filter(order => 
        order.actual_pickup_time && order.estimated_pickup_time
      );
      
      const averagePickupTime = completedOrders.length > 0 
        ? completedOrders.reduce((sum, order) => {
            const estimated = new Date(order.estimated_pickup_time!);
            const actual = new Date(order.actual_pickup_time!);
            return sum + (actual.getTime() - estimated.getTime()) / (1000 * 60);
          }, 0) / completedOrders.length
        : 0;

      // Busy pickup points
      const busyPickupPoints = pickupPoints
        .map(pp => ({
          id: pp.id,
          name: pp.name,
          current_orders: pp.current_orders,
          capacity: pp.capacity,
          utilization: pp.capacity > 0 ? (pp.current_orders / pp.capacity) * 100 : 0
        }))
        .sort((a, b) => b.utilization - a.utilization)
        .slice(0, 5);

      // Status breakdown
      const statusBreakdown = pickupOrders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Hourly pickup trend (mock data for now)
      const hourlyPickupTrend = Array.from({ length: 24 }, (_, hour) => ({
        hour,
        count: 0
      }));

      return {
        totalPickupPoints,
        activePickupPoints,
        totalOrdersToday,
        completedOrdersToday,
        averagePickupTime,
        busyPickupPoints,
        statusBreakdown,
        hourlyPickupTrend
      };
    } catch (error) {
      console.error('Error getting pickup analytics:', error);
      throw error;
    }
  }

  static async searchPickupPoints(query: string): Promise<PickupPoint[]> {
    try {
      const { data, error } = await supabase
        .from('pickup_points')
        .select('*')
        .or(`name.ilike.%${query}%,address.ilike.%${query}%,manager_name.ilike.%${query}%`)
        .order('name', { ascending: true });

      if (error) {
        console.error('Error searching pickup points:', error);
        throw error;
      }

      return (data || []) as PickupPoint[];
    } catch (error) {
      console.error('Error in searchPickupPoints:', error);
      throw error;
    }
  }

  static async findNearbyPickupPoints(
    latitude: number, 
    longitude: number, 
    radiusKm: number = 10
  ): Promise<PickupPoint[]> {
    try {
      const pickupPoints = await this.getActivePickupPoints();
      
      // Filter by distance (simple implementation)
      return pickupPoints.filter(point => {
        if (!point.coordinates) return false;
        
        const distance = this.calculateDistance(
          latitude, longitude,
          point.coordinates.lat, point.coordinates.lng
        );
        
        return distance <= radiusKm;
      }).sort((a, b) => {
        const distA = this.calculateDistance(
          latitude, longitude,
          a.coordinates!.lat, a.coordinates!.lng
        );
        const distB = this.calculateDistance(
          latitude, longitude,
          b.coordinates!.lat, b.coordinates!.lng
        );
        return distA - distB;
      });
    } catch (error) {
      console.error('Error finding nearby pickup points:', error);
      throw error;
    }
  }

  // Helper method to calculate distance between two points
  private static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  // Toggle pickup point status
  static async togglePickupPointStatus(id: string, currentStatus: boolean): Promise<PickupPoint | null> {
    try {
      return await this.updatePickupPoint(id, { is_active: !currentStatus });
    } catch (error) {
      console.error('Error toggling pickup point status:', error);
      throw error;
    }
  }
}