import { supabase } from "@/integrations/supabase/client";

export interface BackupConfiguration {
  id: string;
  name: string;
  description?: string;
  backup_type: 'full' | 'incremental' | 'differential';
  schedule_type: 'manual' | 'daily' | 'weekly' | 'monthly';
  schedule_time?: string;
  schedule_day?: number;
  tables_included: string[];
  exclude_tables: string[];
  retention_days: number;
  is_active: boolean;
  compression_enabled: boolean;
  encryption_enabled: boolean;
  storage_location: 'local' | 's3' | 'gcs';
  storage_config: Record<string, any>;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface BackupHistory {
  id: string;
  configuration_id?: string;
  backup_name: string;
  backup_type: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  file_path?: string;
  file_size?: number;
  compression_ratio?: number;
  records_count?: number;
  tables_backed_up: string[];
  start_time: string;
  end_time?: string;
  duration_seconds?: number;
  error_message?: string;
  checksum?: string;
  initiated_by?: string;
  created_at: string;
  updated_at: string;
}

export interface RestoreHistory {
  id: string;
  backup_history_id: string;
  restore_name: string;
  restore_type: 'full' | 'partial' | 'table_specific';
  status: 'pending' | 'running' | 'completed' | 'failed';
  tables_restored: string[];
  records_restored?: number;
  start_time: string;
  end_time?: string;
  duration_seconds?: number;
  error_message?: string;
  initiated_by?: string;
  created_at: string;
  updated_at: string;
}

export interface BackupSchedule {
  id: string;
  configuration_id: string;
  next_run_time: string;
  last_run_time?: string;
  last_run_status?: string;
  is_enabled: boolean;
  failure_count: number;
  max_failures: number;
  created_at: string;
  updated_at: string;
}

export type NewBackupConfiguration = Omit<BackupConfiguration, 'id' | 'created_at' | 'updated_at'>;
export type UpdateBackupConfiguration = Partial<NewBackupConfiguration>;
export type NewBackupHistory = Omit<BackupHistory, 'id' | 'created_at' | 'updated_at'>;
export type UpdateBackupHistory = Partial<NewBackupHistory>;
export type NewRestoreHistory = Omit<RestoreHistory, 'id' | 'created_at' | 'updated_at'>;

export interface BackupStats {
  totalBackups: number;
  successfulBackups: number;
  failedBackups: number;
  totalDataSize: number;
  averageBackupTime: number;
  lastBackupTime?: string;
  nextScheduledBackup?: string;
  storageUsage: {
    used: number;
    available: number;
    percentage: number;
  };
  recentBackups: BackupHistory[];
}

export class BackupService {
  // Backup Configurations Management
  static async getBackupConfigurations(): Promise<BackupConfiguration[]> {
    try {
      const { data, error } = await supabase
        .from('backup_configurations')
        .select(`
          *,
          staff:created_by(name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching backup configurations:', error);
        throw error;
      }

      return (data || []) as unknown as BackupConfiguration[];
    } catch (error) {
      console.error('Error in getBackupConfigurations:', error);
      throw error;
    }
  }

  static async getBackupConfigurationById(id: string): Promise<BackupConfiguration | null> {
    try {
      const { data, error } = await supabase
        .from('backup_configurations')
        .select(`
          *,
          staff:created_by(name),
          backup_schedules(*)
        `)
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching backup configuration by ID:', error);
        return null;
      }

      return data as unknown as BackupConfiguration;
    } catch (error) {
      console.error('Error in getBackupConfigurationById:', error);
      return null;
    }
  }

  static async createBackupConfiguration(configData: NewBackupConfiguration): Promise<BackupConfiguration | null> {
    try {
      const { data, error } = await supabase
        .from('backup_configurations')
        .insert(configData)
        .select()
        .single();

      if (error) {
        console.error('Error creating backup configuration:', error);
        throw error;
      }

      // Create schedule if not manual
      if (configData.schedule_type !== 'manual') {
        await this.createBackupSchedule(data.id, configData);
      }

      return data as unknown as BackupConfiguration;
    } catch (error) {
      console.error('Error in createBackupConfiguration:', error);
      throw error;
    }
  }

  static async updateBackupConfiguration(id: string, configData: UpdateBackupConfiguration): Promise<BackupConfiguration | null> {
    try {
      const { data, error } = await supabase
        .from('backup_configurations')
        .update({ ...configData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating backup configuration:', error);
        throw error;
      }

      // Update schedule if needed
      if (configData.schedule_type && configData.schedule_type !== 'manual') {
        await this.updateBackupSchedule(id, configData);
      }

      return data as unknown as BackupConfiguration;
    } catch (error) {
      console.error('Error in updateBackupConfiguration:', error);
      throw error;
    }
  }

  static async deleteBackupConfiguration(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('backup_configurations')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting backup configuration:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteBackupConfiguration:', error);
      throw error;
    }
  }

  // Backup History Management
  static async getBackupHistory(): Promise<BackupHistory[]> {
    try {
      const { data, error } = await supabase
        .from('backup_history')
        .select(`
          *,
          backup_configurations(name),
          staff:initiated_by(name)
        `)
        .order('start_time', { ascending: false });

      if (error) {
        console.error('Error fetching backup history:', error);
        throw error;
      }

      return (data || []) as unknown as BackupHistory[];
    } catch (error) {
      console.error('Error in getBackupHistory:', error);
      throw error;
    }
  }

  static async getBackupHistoryById(id: string): Promise<BackupHistory | null> {
    try {
      const { data, error } = await supabase
        .from('backup_history')
        .select(`
          *,
          backup_configurations(name, description),
          staff:initiated_by(name)
        `)
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching backup history by ID:', error);
        return null;
      }

      return data as unknown as BackupHistory;
    } catch (error) {
      console.error('Error in getBackupHistoryById:', error);
      return null;
    }
  }

  static async createBackupHistory(backupData: NewBackupHistory): Promise<BackupHistory | null> {
    try {
      const { data, error } = await supabase
        .from('backup_history')
        .insert(backupData)
        .select()
        .single();

      if (error) {
        console.error('Error creating backup history:', error);
        throw error;
      }

      return data as unknown as BackupHistory;
    } catch (error) {
      console.error('Error in createBackupHistory:', error);
      throw error;
    }
  }

  static async updateBackupHistory(id: string, backupData: UpdateBackupHistory): Promise<BackupHistory | null> {
    try {
      const { data, error } = await supabase
        .from('backup_history')
        .update({ ...backupData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating backup history:', error);
        throw error;
      }

      return data as unknown as BackupHistory;
    } catch (error) {
      console.error('Error in updateBackupHistory:', error);
      throw error;
    }
  }

  // Backup Operations
  static async executeBackup(configurationId: string, initiatedBy?: string): Promise<string> {
    try {
      // Get configuration
      const config = await this.getBackupConfigurationById(configurationId);
      if (!config) {
        throw new Error('Backup configuration not found');
      }

      // Create backup history record
      const backupHistory = await this.createBackupHistory({
        configuration_id: configurationId,
        backup_name: `${config.name}_${new Date().toISOString().split('T')[0]}`,
        backup_type: config.backup_type,
        status: 'running',
        tables_backed_up: config.tables_included,
        start_time: new Date().toISOString(),
        initiated_by: initiatedBy
      });

      if (!backupHistory) {
        throw new Error('Failed to create backup history record');
      }

      // Simulate backup process (in production, this would be actual backup logic)
      setTimeout(async () => {
        try {
          // Simulate backup completion
          const endTime = new Date();
          const duration = Math.round((endTime.getTime() - new Date(backupHistory.start_time).getTime()) / 1000);
          
          await this.updateBackupHistory(backupHistory.id, {
            status: 'completed',
            end_time: endTime.toISOString(),
            duration_seconds: duration,
            file_size: Math.floor(Math.random() * 1000000) + 500000, // Mock file size
            records_count: Math.floor(Math.random() * 10000) + 1000, // Mock record count
            compression_ratio: 0.7 + Math.random() * 0.2, // Mock compression ratio
            checksum: this.generateMockChecksum()
          });
        } catch (error) {
          await this.updateBackupHistory(backupHistory.id, {
            status: 'failed',
            end_time: new Date().toISOString(),
            error_message: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }, 5000); // Simulate 5 second backup

      return backupHistory.id;
    } catch (error) {
      console.error('Error executing backup:', error);
      throw error;
    }
  }

  // Restore Operations
  static async getRestoreHistory(): Promise<RestoreHistory[]> {
    try {
      const { data, error } = await supabase
        .from('restore_history')
        .select(`
          *,
          backup_history(backup_name, backup_type),
          staff:initiated_by(name)
        `)
        .order('start_time', { ascending: false });

      if (error) {
        console.error('Error fetching restore history:', error);
        throw error;
      }

      return (data || []) as unknown as RestoreHistory[];
    } catch (error) {
      console.error('Error in getRestoreHistory:', error);
      throw error;
    }
  }

  static async executeRestore(backupHistoryId: string, restoreType: string, initiatedBy?: string): Promise<string> {
    try {
      // Get backup history
      const backup = await this.getBackupHistoryById(backupHistoryId);
      if (!backup || backup.status !== 'completed') {
        throw new Error('Backup not found or not completed');
      }

      // Create restore history record
      const { data, error } = await supabase
        .from('restore_history')
        .insert({
          backup_history_id: backupHistoryId,
          restore_name: `Restore_${backup.backup_name}_${new Date().toISOString().split('T')[0]}`,
          restore_type: restoreType as any,
          status: 'running',
          tables_restored: backup.tables_backed_up,
          start_time: new Date().toISOString(),
          initiated_by: initiatedBy
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating restore history:', error);
        throw error;
      }

      // Simulate restore process
      setTimeout(async () => {
        try {
          const endTime = new Date();
          const duration = Math.round((endTime.getTime() - new Date(data.start_time).getTime()) / 1000);
          
          await supabase
            .from('restore_history')
            .update({
              status: 'completed',
              end_time: endTime.toISOString(),
              duration_seconds: duration,
              records_restored: backup.records_count
            })
            .eq('id', data.id);
        } catch (error) {
          await supabase
            .from('restore_history')
            .update({
              status: 'failed',
              end_time: new Date().toISOString(),
              error_message: error instanceof Error ? error.message : 'Unknown error'
            })
            .eq('id', data.id);
        }
      }, 3000); // Simulate 3 second restore

      return data.id;
    } catch (error) {
      console.error('Error executing restore:', error);
      throw error;
    }
  }

  // Schedule Management
  private static async createBackupSchedule(configId: string, config: NewBackupConfiguration): Promise<void> {
    try {
      const nextRunTime = this.calculateNextRunTime(config);
      
      await supabase
        .from('backup_schedules')
        .insert({
          configuration_id: configId,
          next_run_time: nextRunTime.toISOString(),
          is_enabled: config.is_active
        });
    } catch (error) {
      console.error('Error creating backup schedule:', error);
    }
  }

  private static async updateBackupSchedule(configId: string, config: UpdateBackupConfiguration): Promise<void> {
    try {
      if (config.schedule_type && config.schedule_type !== 'manual') {
        const nextRunTime = this.calculateNextRunTime(config);
        
        await supabase
          .from('backup_schedules')
          .update({
            next_run_time: nextRunTime.toISOString(),
            is_enabled: config.is_active ?? true
          })
          .eq('configuration_id', configId);
      }
    } catch (error) {
      console.error('Error updating backup schedule:', error);
    }
  }

  private static calculateNextRunTime(config: Partial<BackupConfiguration>): Date {
    const now = new Date();
    const nextRun = new Date(now);

    switch (config.schedule_type) {
      case 'daily':
        nextRun.setDate(nextRun.getDate() + 1);
        if (config.schedule_time) {
          const [hours, minutes] = config.schedule_time.split(':').map(Number);
          nextRun.setHours(hours, minutes, 0, 0);
        }
        break;
      case 'weekly':
        nextRun.setDate(nextRun.getDate() + 7);
        if (config.schedule_day) {
          const dayDiff = (config.schedule_day - nextRun.getDay() + 7) % 7;
          nextRun.setDate(nextRun.getDate() + dayDiff);
        }
        break;
      case 'monthly':
        nextRun.setMonth(nextRun.getMonth() + 1);
        if (config.schedule_day) {
          nextRun.setDate(Math.min(config.schedule_day, this.getDaysInMonth(nextRun)));
        }
        break;
    }

    return nextRun;
  }

  private static getDaysInMonth(date: Date): number {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }

  // Statistics and Analytics
  static async getBackupStats(): Promise<BackupStats> {
    try {
      const [backups, configurations] = await Promise.all([
        this.getBackupHistory(),
        this.getBackupConfigurations()
      ]);

      const totalBackups = backups.length;
      const successfulBackups = backups.filter(b => b.status === 'completed').length;
      const failedBackups = backups.filter(b => b.status === 'failed').length;
      
      const completedBackups = backups.filter(b => b.status === 'completed' && b.duration_seconds);
      const averageBackupTime = completedBackups.length > 0
        ? completedBackups.reduce((sum, b) => sum + (b.duration_seconds || 0), 0) / completedBackups.length
        : 0;

      const totalDataSize = backups.reduce((sum, b) => sum + (b.file_size || 0), 0);
      const lastBackup = backups.find(b => b.status === 'completed');
      
      // Mock storage usage (in production, this would be real storage metrics)
      const storageUsage = {
        used: totalDataSize,
        available: 10000000000, // 10GB mock available space
        percentage: (totalDataSize / 10000000000) * 100
      };

      return {
        totalBackups,
        successfulBackups,
        failedBackups,
        totalDataSize,
        averageBackupTime,
        lastBackupTime: lastBackup?.end_time,
        storageUsage,
        recentBackups: backups.slice(0, 10)
      };
    } catch (error) {
      console.error('Error getting backup stats:', error);
      throw error;
    }
  }

  // Helper Methods
  private static generateMockChecksum(): string {
    return Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  }

  static async getAvailableTables(): Promise<string[]> {
    // Return list of available tables for backup
    return [
      'menu_items',
      'orders', 
      'order_items',
      'customers',
      'staff',
      'ingredients',
      'sales_transactions',
      'expenses',
      'expense_types',
      'modifiers',
      'categories',
      'pickup_points',
      'pickup_orders',
      'reservations',
      'tables',
      'table_sessions'
    ];
  }

  static async testBackupConfiguration(configId: string): Promise<{ success: boolean; message: string }> {
    try {
      const config = await this.getBackupConfigurationById(configId);
      if (!config) {
        return { success: false, message: 'Configuration not found' };
      }

      // Perform validation checks
      if (config.tables_included.length === 0) {
        return { success: false, message: 'No tables selected for backup' };
      }

      if (config.schedule_type !== 'manual' && !config.schedule_time) {
        return { success: false, message: 'Schedule time is required for scheduled backups' };
      }

      return { success: true, message: 'Configuration is valid' };
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  static async toggleConfigurationStatus(id: string, currentStatus: boolean): Promise<BackupConfiguration | null> {
    try {
      return await this.updateBackupConfiguration(id, { is_active: !currentStatus });
    } catch (error) {
      console.error('Error toggling configuration status:', error);
      throw error;
    }
  }
}