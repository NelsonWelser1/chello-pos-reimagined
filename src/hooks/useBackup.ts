import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  BackupService, 
  BackupConfiguration, 
  BackupHistory, 
  RestoreHistory,
  NewBackupConfiguration 
} from '@/services/backupService';

// Backup Configuration Hooks
export function useBackupConfigurations() {
  return useQuery({
    queryKey: ['backup-configurations'],
    queryFn: BackupService.getBackupConfigurations,
  });
}

export function useBackupConfiguration(id: string) {
  return useQuery({
    queryKey: ['backup-configurations', id],
    queryFn: () => BackupService.getBackupConfigurationById(id),
    enabled: !!id,
  });
}

export function useCreateBackupConfiguration() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: NewBackupConfiguration) => 
      BackupService.createBackupConfiguration(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['backup-configurations'] });
    },
  });
}

export function useUpdateBackupConfiguration() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<NewBackupConfiguration> }) => 
      BackupService.updateBackupConfiguration(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['backup-configurations'] });
    },
  });
}

export function useDeleteBackupConfiguration() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => BackupService.deleteBackupConfiguration(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['backup-configurations'] });
    },
  });
}

export function useToggleConfigurationStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, currentStatus }: { id: string; currentStatus: boolean }) => 
      BackupService.toggleConfigurationStatus(id, currentStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['backup-configurations'] });
    },
  });
}

// Backup History Hooks
export function useBackupHistory() {
  return useQuery({
    queryKey: ['backup-history'],
    queryFn: BackupService.getBackupHistory,
  });
}

export function useBackupHistoryById(id: string) {
  return useQuery({
    queryKey: ['backup-history', id],
    queryFn: () => BackupService.getBackupHistoryById(id),
    enabled: !!id,
  });
}

// Backup Operations Hooks
export function useExecuteBackup() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ configurationId, initiatedBy }: { configurationId: string; initiatedBy?: string }) => 
      BackupService.executeBackup(configurationId, initiatedBy),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['backup-history'] });
    },
  });
}

// Restore Operations Hooks
export function useRestoreHistory() {
  return useQuery({
    queryKey: ['restore-history'],
    queryFn: BackupService.getRestoreHistory,
  });
}

export function useExecuteRestore() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      backupHistoryId, 
      restoreType, 
      initiatedBy 
    }: { 
      backupHistoryId: string; 
      restoreType: string; 
      initiatedBy?: string 
    }) => BackupService.executeRestore(backupHistoryId, restoreType, initiatedBy),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restore-history'] });
      // Invalidate all data as it might have been restored
      queryClient.invalidateQueries();
    },
  });
}

// Statistics and Utility Hooks
export function useBackupStats() {
  return useQuery({
    queryKey: ['backup-stats'],
    queryFn: BackupService.getBackupStats,
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}

export function useAvailableTables() {
  return useQuery({
    queryKey: ['available-tables'],
    queryFn: BackupService.getAvailableTables,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useTestBackupConfiguration() {
  return useMutation({
    mutationFn: (configId: string) => BackupService.testBackupConfiguration(configId),
  });
}