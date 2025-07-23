import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  ImportExportService, 
  ImportExportHistory, 
  DataTemplate, 
  NewImportExportHistory,
  NewDataTemplate,
  ExportOptions 
} from '@/services/importExportService';

// Import/Export History Hooks
export function useImportExportHistory() {
  return useQuery({
    queryKey: ['import-export-history'],
    queryFn: ImportExportService.getImportExportHistory,
  });
}

export function useImportExportById(id: string) {
  return useQuery({
    queryKey: ['import-export-history', id],
    queryFn: () => ImportExportService.getImportExportById(id),
    enabled: !!id,
  });
}

export function useCreateImportExportRecord() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: NewImportExportHistory) => 
      ImportExportService.createImportExportRecord(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['import-export-history'] });
    },
  });
}

export function useUpdateImportExportRecord() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<NewImportExportHistory> }) => 
      ImportExportService.updateImportExportRecord(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['import-export-history'] });
    },
  });
}

export function useDeleteImportExportRecord() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => ImportExportService.deleteImportExportRecord(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['import-export-history'] });
    },
  });
}

// Data Templates Hooks
export function useDataTemplates() {
  return useQuery({
    queryKey: ['data-templates'],
    queryFn: ImportExportService.getDataTemplates,
  });
}

export function useTemplatesByDataType(dataType: string) {
  return useQuery({
    queryKey: ['data-templates', 'type', dataType],
    queryFn: () => ImportExportService.getTemplatesByDataType(dataType),
    enabled: !!dataType,
  });
}

export function useCreateDataTemplate() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: NewDataTemplate) => ImportExportService.createDataTemplate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['data-templates'] });
    },
  });
}

// Import Operations Hooks
export function useValidateImportData() {
  return useMutation({
    mutationFn: ({ data, template }: { data: any[]; template: DataTemplate }) =>
      ImportExportService.validateImportData(data, template),
  });
}

export function useProcessImport() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      historyId, 
      data, 
      dataType, 
      mappings 
    }: { 
      historyId: string; 
      data: any[]; 
      dataType: string; 
      mappings: any[] 
    }) => ImportExportService.processImport(historyId, data, dataType, mappings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['import-export-history'] });
      // Invalidate data tables that might have been updated
      queryClient.invalidateQueries({ queryKey: ['menu_items'] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      queryClient.invalidateQueries({ queryKey: ['ingredients'] });
    },
  });
}

// Export Operations Hooks
export function useExportData() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      dataType, 
      options, 
      initiatedBy 
    }: { 
      dataType: string; 
      options: ExportOptions; 
      initiatedBy?: string 
    }) => ImportExportService.exportData(dataType, options, initiatedBy),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['import-export-history'] });
    },
  });
}

// Statistics Hooks
export function useImportExportStats() {
  return useQuery({
    queryKey: ['import-export-stats'],
    queryFn: ImportExportService.getImportExportStats,
    refetchInterval: 60000, // Refresh every minute
  });
}