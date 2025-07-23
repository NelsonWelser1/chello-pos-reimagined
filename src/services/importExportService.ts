import { supabase } from "@/integrations/supabase/client";

export interface ImportExportHistory {
  id: string;
  operation_type: 'import' | 'export';
  data_type: string;
  file_name: string;
  file_size?: number;
  file_path?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  records_processed: number;
  records_total: number;
  records_successful: number;
  records_failed: number;
  error_details: any[];
  validation_errors: any[];
  processing_time?: number;
  initiated_by?: string;
  completed_at?: string;
  download_url?: string;
  download_expires_at?: string;
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface DataTemplate {
  id: string;
  name: string;
  data_type: string;
  description?: string;
  template_structure: {
    required_fields: string[];
    optional_fields: string[];
    validation_rules: Record<string, any>;
  };
  sample_data: any[];
  is_system_template: boolean;
  is_active: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface ImportMapping {
  id: string;
  import_history_id: string;
  source_field: string;
  target_field: string;
  data_transformation?: string;
  is_required: boolean;
  default_value?: string;
  created_at: string;
}

export type NewImportExportHistory = Omit<ImportExportHistory, 'id' | 'created_at' | 'updated_at'>;
export type UpdateImportExportHistory = Partial<NewImportExportHistory>;
export type NewDataTemplate = Omit<DataTemplate, 'id' | 'created_at' | 'updated_at'>;
export type NewImportMapping = Omit<ImportMapping, 'id' | 'created_at'>;

export interface ImportValidationResult {
  isValid: boolean;
  errors: Array<{
    row: number;
    field: string;
    message: string;
    value: any;
  }>;
  warnings: Array<{
    row: number;
    field: string;
    message: string;
    value: any;
  }>;
  summary: {
    totalRows: number;
    validRows: number;
    invalidRows: number;
    warningRows: number;
  };
}

export interface ExportOptions {
  format: 'csv' | 'json' | 'excel';
  includeHeaders: boolean;
  dateFormat?: string;
  filters?: Record<string, any>;
  columns?: string[];
}

export class ImportExportService {
  // Import/Export History Management
  static async getImportExportHistory(): Promise<ImportExportHistory[]> {
    try {
      const { data, error } = await supabase
        .from('import_export_history')
        .select(`
          *,
          staff:initiated_by(name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching import/export history:', error);
        throw error;
      }

      return (data || []) as ImportExportHistory[];
    } catch (error) {
      console.error('Error in getImportExportHistory:', error);
      throw error;
    }
  }

  static async getImportExportById(id: string): Promise<ImportExportHistory | null> {
    try {
      const { data, error } = await supabase
        .from('import_export_history')
        .select(`
          *,
          staff:initiated_by(name),
          import_mappings(*)
        `)
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching import/export by ID:', error);
        return null;
      }

      return data as ImportExportHistory;
    } catch (error) {
      console.error('Error in getImportExportById:', error);
      return null;
    }
  }

  static async createImportExportRecord(data: NewImportExportHistory): Promise<ImportExportHistory | null> {
    try {
      const { data: result, error } = await supabase
        .from('import_export_history')
        .insert(data)
        .select()
        .single();

      if (error) {
        console.error('Error creating import/export record:', error);
        throw error;
      }

      return result as ImportExportHistory;
    } catch (error) {
      console.error('Error in createImportExportRecord:', error);
      throw error;
    }
  }

  static async updateImportExportRecord(id: string, data: UpdateImportExportHistory): Promise<ImportExportHistory | null> {
    try {
      const { data: result, error } = await supabase
        .from('import_export_history')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating import/export record:', error);
        throw error;
      }

      return result as ImportExportHistory;
    } catch (error) {
      console.error('Error in updateImportExportRecord:', error);
      throw error;
    }
  }

  // Data Templates Management
  static async getDataTemplates(): Promise<DataTemplate[]> {
    try {
      const { data, error } = await supabase
        .from('data_templates')
        .select(`
          *,
          staff:created_by(name)
        `)
        .eq('is_active', true)
        .order('is_system_template', { ascending: false })
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching data templates:', error);
        throw error;
      }

      return (data || []) as unknown as DataTemplate[];
    } catch (error) {
      console.error('Error in getDataTemplates:', error);
      throw error;
    }
  }

  static async getTemplatesByDataType(dataType: string): Promise<DataTemplate[]> {
    try {
      const { data, error } = await supabase
        .from('data_templates')
        .select('*')
        .eq('data_type', dataType)
        .eq('is_active', true)
        .order('is_system_template', { ascending: false });

      if (error) {
        console.error('Error fetching templates by data type:', error);
        throw error;
      }

      return (data || []) as unknown as DataTemplate[];
    } catch (error) {
      console.error('Error in getTemplatesByDataType:', error);
      throw error;
    }
  }

  static async createDataTemplate(templateData: NewDataTemplate): Promise<DataTemplate | null> {
    try {
      const { data, error } = await supabase
        .from('data_templates')
        .insert(templateData)
        .select()
        .single();

      if (error) {
        console.error('Error creating data template:', error);
        throw error;
      }

      return data as unknown as DataTemplate;
    } catch (error) {
      console.error('Error in createDataTemplate:', error);
      throw error;
    }
  }

  // Import Functionality
  static async validateImportData(
    data: any[], 
    template: DataTemplate
  ): Promise<ImportValidationResult> {
    try {
      const errors: any[] = [];
      const warnings: any[] = [];
      let validRows = 0;

      data.forEach((row, index) => {
        // Check required fields
        template.template_structure.required_fields.forEach(field => {
          if (!row[field] || row[field] === '') {
            errors.push({
              row: index + 1,
              field,
              message: `Required field '${field}' is missing or empty`,
              value: row[field]
            });
          }
        });

        // Validate field types and rules
        Object.entries(template.template_structure.validation_rules || {}).forEach(([field, rules]: [string, any]) => {
          const value = row[field];
          if (value !== undefined && value !== null && value !== '') {
            // Type validation
            if (rules.type === 'number' && isNaN(Number(value))) {
              errors.push({
                row: index + 1,
                field,
                message: `Field '${field}' must be a number`,
                value
              });
            } else if (rules.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
              errors.push({
                row: index + 1,
                field,
                message: `Field '${field}' must be a valid email`,
                value
              });
            }

            // Range validation for numbers
            if (rules.type === 'number' && !isNaN(Number(value))) {
              const numValue = Number(value);
              if (rules.min !== undefined && numValue < rules.min) {
                errors.push({
                  row: index + 1,
                  field,
                  message: `Field '${field}' must be at least ${rules.min}`,
                  value
                });
              }
              if (rules.max !== undefined && numValue > rules.max) {
                errors.push({
                  row: index + 1,
                  field,
                  message: `Field '${field}' must be at most ${rules.max}`,
                  value
                });
              }
            }

            // Enum validation
            if (rules.enum && !rules.enum.includes(value)) {
              errors.push({
                row: index + 1,
                field,
                message: `Field '${field}' must be one of: ${rules.enum.join(', ')}`,
                value
              });
            }
          }
        });

        // Count valid rows (rows without errors for this specific row)
        const rowErrors = errors.filter(error => error.row === index + 1);
        if (rowErrors.length === 0) {
          validRows++;
        }
      });

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
        summary: {
          totalRows: data.length,
          validRows,
          invalidRows: data.length - validRows,
          warningRows: new Set(warnings.map(w => w.row)).size
        }
      };
    } catch (error) {
      console.error('Error validating import data:', error);
      throw error;
    }
  }

  static async processImport(
    historyId: string,
    data: any[],
    dataType: string,
    mappings: ImportMapping[]
  ): Promise<{ success: boolean; results: any }> {
    try {
      // Update status to processing
      await this.updateImportExportRecord(historyId, {
        status: 'processing',
        records_total: data.length,
        records_processed: 0
      });

      const startTime = Date.now();
      let successful = 0;
      let failed = 0;
      const errors: any[] = [];

      // Process data based on data type
      for (let i = 0; i < data.length; i++) {
        try {
          const row = data[i];
          const transformedRow = await this.transformRowData(row, mappings);

          // Insert into appropriate table
          const { error } = await this.insertRowToTable(dataType, transformedRow);

          if (error) {
            failed++;
            errors.push({
              row: i + 1,
              error: error.message,
              data: row
            });
          } else {
            successful++;
          }

          // Update progress every 10 records
          if (i % 10 === 0) {
            await this.updateImportExportRecord(historyId, {
              records_processed: i + 1,
              records_successful: successful,
              records_failed: failed
            });
          }
        } catch (rowError) {
          failed++;
          errors.push({
            row: i + 1,
            error: rowError instanceof Error ? rowError.message : 'Unknown error',
            data: data[i]
          });
        }
      }

      const processingTime = Math.round((Date.now() - startTime) / 1000);

      // Update final status
      await this.updateImportExportRecord(historyId, {
        status: successful > 0 ? 'completed' : 'failed',
        records_processed: data.length,
        records_successful: successful,
        records_failed: failed,
        error_details: errors,
        processing_time: processingTime,
        completed_at: new Date().toISOString()
      });

      return {
        success: successful > 0,
        results: {
          total: data.length,
          successful,
          failed,
          errors,
          processingTime
        }
      };
    } catch (error) {
      console.error('Error processing import:', error);
      
      // Update status to failed
      await this.updateImportExportRecord(historyId, {
        status: 'failed',
        error_details: [{ error: error instanceof Error ? error.message : 'Unknown error' }]
      });

      throw error;
    }
  }

  // Export Functionality
  static async exportData(
    dataType: string,
    options: ExportOptions,
    initiatedBy?: string
  ): Promise<{ downloadUrl: string; historyId: string }> {
    try {
      // Create export record
      const exportRecord = await this.createImportExportRecord({
        operation_type: 'export',
        data_type: dataType,
        file_name: `${dataType}_export_${new Date().toISOString().split('T')[0]}.${options.format}`,
        status: 'processing',
        records_processed: 0,
        records_total: 0,
        records_successful: 0,
        records_failed: 0,
        error_details: [],
        validation_errors: [],
        initiated_by: initiatedBy,
        settings: options
      });

      if (!exportRecord) {
        throw new Error('Failed to create export record');
      }

      // Fetch data from appropriate table
      const data = await this.fetchDataForExport(dataType, options.filters);
      
      // Generate export file
      const fileContent = await this.generateExportFile(data, options);
      
      // For now, we'll create a data URL (in production, you'd upload to storage)
      const blob = new Blob([fileContent], { 
        type: options.format === 'json' ? 'application/json' : 'text/csv'
      });
      const downloadUrl = URL.createObjectURL(blob);

      // Update export record
      await this.updateImportExportRecord(exportRecord.id, {
        status: 'completed',
        records_total: data.length,
        records_successful: data.length,
        download_url: downloadUrl,
        download_expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
        completed_at: new Date().toISOString()
      });

      return {
        downloadUrl,
        historyId: exportRecord.id
      };
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  }

  // Helper Methods
  private static async transformRowData(row: any, mappings: ImportMapping[]): Promise<any> {
    const transformed: any = {};

    mappings.forEach(mapping => {
      let value = row[mapping.source_field];

      // Apply default value if needed
      if ((value === undefined || value === null || value === '') && mapping.default_value) {
        value = mapping.default_value;
      }

      // Apply data transformation if specified
      if (mapping.data_transformation && value !== undefined) {
        // Simple transformations (could be extended)
        switch (mapping.data_transformation) {
          case 'toLowerCase':
            value = String(value).toLowerCase();
            break;
          case 'toUpperCase':
            value = String(value).toUpperCase();
            break;
          case 'toNumber':
            value = Number(value);
            break;
          case 'toBoolean':
            value = Boolean(value);
            break;
        }
      }

      transformed[mapping.target_field] = value;
    });

    return transformed;
  }

  private static async insertRowToTable(dataType: string, row: any): Promise<{ error: any }> {
    try {
      // Map data types to actual table names
      const tableMap: Record<string, string> = {
        'menu_items': 'menu_items',
        'customers': 'customers',
        'staff': 'staff',
        'ingredients': 'ingredients',
        'expense_types': 'expense_types',
        'expenses': 'expenses',
        'modifiers': 'modifiers'
      };

      const tableName = tableMap[dataType];
      if (!tableName) {
        return { error: new Error(`Unknown data type: ${dataType}`) };
      }

      const { error } = await supabase
        .from(tableName as any)
        .insert(row);

      return { error };
    } catch (error) {
      return { error };
    }
  }

  private static async fetchDataForExport(dataType: string, filters?: Record<string, any>): Promise<any[]> {
    try {
      // Map data types to actual table names
      const tableMap: Record<string, string> = {
        'menu_items': 'menu_items',
        'customers': 'customers', 
        'staff': 'staff',
        'ingredients': 'ingredients',
        'expense_types': 'expense_types',
        'expenses': 'expenses',
        'modifiers': 'modifiers'
      };

      const tableName = tableMap[dataType];
      if (!tableName) {
        throw new Error(`Unknown data type: ${dataType}`);
      }

      let query = supabase.from(tableName as any).select('*');

      // Apply filters if provided
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value);
          }
        });
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching data for export:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in fetchDataForExport:', error);
      throw error;
    }
  }

  private static async generateExportFile(data: any[], options: ExportOptions): Promise<string> {
    try {
      if (options.format === 'json') {
        return JSON.stringify(data, null, 2);
      } else if (options.format === 'csv') {
        if (data.length === 0) return '';

        const columns = options.columns || Object.keys(data[0]);
        
        let csv = '';
        
        // Add headers if requested
        if (options.includeHeaders) {
          csv += columns.join(',') + '\n';
        }

        // Add data rows
        data.forEach(row => {
          const values = columns.map(col => {
            const value = row[col];
            // Escape CSV values
            if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value || '';
          });
          csv += values.join(',') + '\n';
        });

        return csv;
      }

      throw new Error('Unsupported export format');
    } catch (error) {
      console.error('Error generating export file:', error);
      throw error;
    }
  }

  // Statistics and Search
  static async getImportExportStats(): Promise<{
    totalOperations: number;
    successfulOperations: number;
    failedOperations: number;
    totalRecordsProcessed: number;
    recentOperations: ImportExportHistory[];
  }> {
    try {
      const history = await this.getImportExportHistory();
      
      const totalOperations = history.length;
      const successfulOperations = history.filter(h => h.status === 'completed').length;
      const failedOperations = history.filter(h => h.status === 'failed').length;
      const totalRecordsProcessed = history.reduce((sum, h) => sum + h.records_successful, 0);
      const recentOperations = history.slice(0, 10);

      return {
        totalOperations,
        successfulOperations,
        failedOperations,
        totalRecordsProcessed,
        recentOperations
      };
    } catch (error) {
      console.error('Error getting import/export stats:', error);
      throw error;
    }
  }

  static async deleteImportExportRecord(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('import_export_history')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting import/export record:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteImportExportRecord:', error);
      throw error;
    }
  }
}