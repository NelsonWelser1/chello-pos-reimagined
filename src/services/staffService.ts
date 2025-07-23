import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Staff {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'Admin' | 'Manager' | 'Chef' | 'Waiter' | 'Cashier';
  pin_code?: string;
  hourly_rate?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type NewStaff = Omit<Staff, 'id' | 'created_at' | 'updated_at'>;
export type UpdateStaff = Partial<NewStaff>;

export interface StaffStats {
  totalStaff: number;
  activeStaff: number;
  totalSalary: number;
  averageHourlyRate: number;
  roleDistribution: Record<string, number>;
  recentHires: number;
}

export interface StaffPerformance {
  staff_id: string;
  name: string;
  total_sales: number;
  order_count: number;
  average_order_value: number;
  work_hours: number;
  performance_score: number;
}

export class StaffService {
  // Get all staff members
  static async getStaff(): Promise<Staff[]> {
    try {
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching staff:', error);
        throw error;
      }

      return (data || []) as Staff[];
    } catch (error) {
      console.error('Error in getStaff:', error);
      throw error;
    }
  }

  // Get staff by ID
  static async getStaffById(id: string): Promise<Staff | null> {
    try {
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching staff by ID:', error);
        return null;
      }

      return data as Staff;
    } catch (error) {
      console.error('Error in getStaffById:', error);
      return null;
    }
  }

  // Create new staff member
  static async createStaff(staffData: NewStaff): Promise<Staff | null> {
    try {
      const { data, error } = await supabase
        .from('staff')
        .insert(staffData)
        .select()
        .single();

      if (error) {
        console.error('Error creating staff:', error);
        throw error;
      }

      return data as Staff;
    } catch (error) {
      console.error('Error in createStaff:', error);
      throw error;
    }
  }

  // Update staff member
  static async updateStaff(id: string, staffData: UpdateStaff): Promise<Staff | null> {
    try {
      const { data, error } = await supabase
        .from('staff')
        .update({ ...staffData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating staff:', error);
        throw error;
      }

      return data as Staff;
    } catch (error) {
      console.error('Error in updateStaff:', error);
      throw error;
    }
  }

  // Delete staff member
  static async deleteStaff(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('staff')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting staff:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteStaff:', error);
      throw error;
    }
  }

  // Get staff statistics
  static async getStaffStats(): Promise<StaffStats> {
    try {
      const staff = await this.getStaff();
      
      const totalStaff = staff.length;
      const activeStaff = staff.filter(s => s.is_active).length;
      const totalSalary = staff.reduce((sum, s) => sum + (s.hourly_rate || 0), 0);
      const averageHourlyRate = totalStaff > 0 ? totalSalary / totalStaff : 0;
      
      const roleDistribution = staff.reduce((acc, s) => {
        acc[s.role] = (acc[s.role] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recentHires = staff.filter(s => 
        new Date(s.created_at) > thirtyDaysAgo
      ).length;

      return {
        totalStaff,
        activeStaff,
        totalSalary,
        averageHourlyRate,
        roleDistribution,
        recentHires
      };
    } catch (error) {
      console.error('Error getting staff stats:', error);
      throw error;
    }
  }

  // Get staff performance data
  static async getStaffPerformance(period = '30'): Promise<StaffPerformance[]> {
    try {
      // This would require a more complex query joining with sales data
      // For now, return mock data structure
      const staff = await this.getStaff();
      
      return staff.map(member => ({
        staff_id: member.id,
        name: member.name,
        total_sales: 0,
        order_count: 0,
        average_order_value: 0,
        work_hours: 0,
        performance_score: 0
      }));
    } catch (error) {
      console.error('Error getting staff performance:', error);
      throw error;
    }
  }

  // Search staff members
  static async searchStaff(query: string): Promise<Staff[]> {
    try {
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .or(`name.ilike.%${query}%,email.ilike.%${query}%,role.ilike.%${query}%`)
        .order('name', { ascending: true });

      if (error) {
        console.error('Error searching staff:', error);
        throw error;
      }

      return (data || []) as Staff[];
    } catch (error) {
      console.error('Error in searchStaff:', error);
      throw error;
    }
  }

  // Toggle staff active status
  static async toggleStaffStatus(id: string, currentStatus: boolean): Promise<Staff | null> {
    try {
      return await this.updateStaff(id, { is_active: !currentStatus });
    } catch (error) {
      console.error('Error toggling staff status:', error);
      throw error;
    }
  }
}