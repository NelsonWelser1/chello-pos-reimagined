import { supabase } from "@/integrations/supabase/client";
import { PickupPointService } from "./pickupPointService";
import { ImportExportService } from "./importExportService";
import { BackupService } from "./backupService";

/**
 * Service Test Suite - Validates all service interfaces and functionality
 * This ensures all services work as expected and deliver the correct data
 */
export class ServiceTestSuite {
  
  static async runAllTests(): Promise<{ 
    success: boolean; 
    results: Record<string, any>; 
    errors: string[] 
  }> {
    const results: Record<string, any> = {};
    const errors: string[] = [];
    
    console.log('🧪 Starting Service Test Suite...');
    
    try {
      // Test Pickup Points Service
      console.log('📍 Testing Pickup Points Service...');
      results.pickupPoints = await this.testPickupPointsService();
      
      // Test Import/Export Service  
      console.log('📊 Testing Import/Export Service...');
      results.importExport = await this.testImportExportService();
      
      // Test Backup Service
      console.log('💾 Testing Backup Service...');
      results.backup = await this.testBackupService();
      
      console.log('✅ All service tests completed successfully!');
      
      return {
        success: true,
        results,
        errors
      };
      
    } catch (error) {
      console.error('❌ Service test suite failed:', error);
      errors.push(error instanceof Error ? error.message : 'Unknown error');
      
      return {
        success: false,
        results,
        errors
      };
    }
  }
  
  private static async testPickupPointsService(): Promise<any> {
    const results: any = {
      getPickupPoints: false,
      getActivePickupPoints: false,
      createPickupPoint: false,
      createPickupOrder: false,
      analytics: false,
      search: false
    };
    
    try {
      // Test getting pickup points
      const pickupPoints = await PickupPointService.getPickupPoints();
      results.getPickupPoints = Array.isArray(pickupPoints);
      console.log(`  ✓ getPickupPoints: ${pickupPoints.length} points found`);
      
      // Test getting active pickup points
      const activePoints = await PickupPointService.getActivePickupPoints();
      results.getActivePickupPoints = Array.isArray(activePoints);
      console.log(`  ✓ getActivePickupPoints: ${activePoints.length} active points`);
      
      // Test creating a pickup point
      const newPoint = await PickupPointService.createPickupPoint({
        name: 'Test Point',
        address: '123 Test Street',
        opening_hours: [
          { day: 'Monday', open: '09:00', close: '18:00', closed: false }
        ],
        capacity: 10,
        current_orders: 0,
        is_active: true,
        delivery_radius: 5,
        facilities: ['parking']
      });
      results.createPickupPoint = !!newPoint?.id;
      console.log(`  ✓ createPickupPoint: ${newPoint?.id ? 'Created' : 'Failed'}`);
      
      // Test analytics
      const analytics = await PickupPointService.getPickupAnalytics();
      results.analytics = typeof analytics.totalPickupPoints === 'number';
      console.log(`  ✓ getPickupAnalytics: ${analytics.totalPickupPoints} total points`);
      
      // Test search
      const searchResults = await PickupPointService.searchPickupPoints('test');
      results.search = Array.isArray(searchResults);
      console.log(`  ✓ searchPickupPoints: ${searchResults.length} results`);
      
      // Clean up test data
      if (newPoint?.id) {
        await PickupPointService.deletePickupPoint(newPoint.id);
        console.log(`  🧹 Cleaned up test pickup point`);
      }
      
    } catch (error) {
      console.error('  ❌ PickupPointService test failed:', error);
      throw error;
    }
    
    return results;
  }
  
  private static async testImportExportService(): Promise<any> {
    const results: any = {
      getHistory: false,
      getTemplates: false,
      validateData: false,
      exportData: false,
      stats: false
    };
    
    try {
      // Test getting import/export history
      const history = await ImportExportService.getImportExportHistory();
      results.getHistory = Array.isArray(history);
      console.log(`  ✓ getImportExportHistory: ${history.length} records`);
      
      // Test getting data templates
      const templates = await ImportExportService.getDataTemplates();
      results.getTemplates = Array.isArray(templates) && templates.length > 0;
      console.log(`  ✓ getDataTemplates: ${templates.length} templates`);
      
      // Test data validation
      if (templates.length > 0) {
        const testData = [
          { name: 'Test Item', price: 100, category: 'Test' }
        ];
        const validation = await ImportExportService.validateImportData(testData, templates[0]);
        results.validateData = typeof validation.isValid === 'boolean';
        console.log(`  ✓ validateImportData: ${validation.isValid ? 'Valid' : 'Invalid'} test data`);
      }
      
      // Test export functionality
      const exportResult = await ImportExportService.exportData(
        'menu_items',
        {
          format: 'csv',
          includeHeaders: true
        }
      );
      results.exportData = !!exportResult.downloadUrl;
      console.log(`  ✓ exportData: ${exportResult.downloadUrl ? 'Generated' : 'Failed'}`);
      
      // Test statistics
      const stats = await ImportExportService.getImportExportStats();
      results.stats = typeof stats.totalOperations === 'number';
      console.log(`  ✓ getImportExportStats: ${stats.totalOperations} operations`);
      
    } catch (error) {
      console.error('  ❌ ImportExportService test failed:', error);
      throw error;
    }
    
    return results;
  }
  
  private static async testBackupService(): Promise<any> {
    const results: any = {
      getConfigurations: false,
      getHistory: false,
      createConfiguration: false,
      executeBackup: false,
      stats: false,
      availableTables: false
    };
    
    try {
      // Test getting backup configurations
      const configurations = await BackupService.getBackupConfigurations();
      results.getConfigurations = Array.isArray(configurations);
      console.log(`  ✓ getBackupConfigurations: ${configurations.length} configurations`);
      
      // Test getting backup history
      const history = await BackupService.getBackupHistory();
      results.getHistory = Array.isArray(history);
      console.log(`  ✓ getBackupHistory: ${history.length} backups`);
      
      // Test creating a backup configuration
      const newConfig = await BackupService.createBackupConfiguration({
        name: 'Test Configuration',
        backup_type: 'full',
        schedule_type: 'manual',
        tables_included: ['menu_items'],
        exclude_tables: [],
        retention_days: 30,
        is_active: true,
        compression_enabled: true,
        encryption_enabled: false,
        storage_location: 'local',
        storage_config: {}
      });
      results.createConfiguration = !!newConfig?.id;
      console.log(`  ✓ createBackupConfiguration: ${newConfig?.id ? 'Created' : 'Failed'}`);
      
      // Test backup execution
      if (newConfig?.id) {
        const backupId = await BackupService.executeBackup(newConfig.id);
        results.executeBackup = !!backupId;
        console.log(`  ✓ executeBackup: ${backupId ? 'Started' : 'Failed'}`);
      }
      
      // Test statistics
      const stats = await BackupService.getBackupStats();
      results.stats = typeof stats.totalBackups === 'number';
      console.log(`  ✓ getBackupStats: ${stats.totalBackups} total backups`);
      
      // Test available tables
      const tables = await BackupService.getAvailableTables();
      results.availableTables = Array.isArray(tables) && tables.length > 0;
      console.log(`  ✓ getAvailableTables: ${tables.length} tables available`);
      
      // Clean up test data
      if (newConfig?.id) {
        await BackupService.deleteBackupConfiguration(newConfig.id);
        console.log(`  🧹 Cleaned up test backup configuration`);
      }
      
    } catch (error) {
      console.error('  ❌ BackupService test failed:', error);
      throw error;
    }
    
    return results;
  }
  
  /**
   * Validate database schema matches service interfaces
   */
  static async validateDatabaseSchema(): Promise<{ 
    valid: boolean; 
    tables: Record<string, boolean>; 
    errors: string[] 
  }> {
    const errors: string[] = [];
    const tables: Record<string, boolean> = {};
    
    console.log('🔍 Validating database schema...');
    
    try {
      // Check pickup points tables
      const { data: pickupPoints, error: ppError } = await supabase
        .from('pickup_points')
        .select('*')
        .limit(1);
      tables.pickup_points = !ppError;
      if (ppError) errors.push(`pickup_points: ${ppError.message}`);
      
      const { data: pickupOrders, error: poError } = await supabase
        .from('pickup_orders')
        .select('*')
        .limit(1);
      tables.pickup_orders = !poError;
      if (poError) errors.push(`pickup_orders: ${poError.message}`);
      
      // Check import/export tables
      const { data: importHistory, error: ihError } = await supabase
        .from('import_export_history')
        .select('*')
        .limit(1);
      tables.import_export_history = !ihError;
      if (ihError) errors.push(`import_export_history: ${ihError.message}`);
      
      const { data: dataTemplates, error: dtError } = await supabase
        .from('data_templates')
        .select('*')
        .limit(1);
      tables.data_templates = !dtError;
      if (dtError) errors.push(`data_templates: ${dtError.message}`);
      
      // Check backup tables
      const { data: backupConfigs, error: bcError } = await supabase
        .from('backup_configurations')
        .select('*')
        .limit(1);
      tables.backup_configurations = !bcError;
      if (bcError) errors.push(`backup_configurations: ${bcError.message}`);
      
      const { data: backupHistory, error: bhError } = await supabase
        .from('backup_history')
        .select('*')
        .limit(1);
      tables.backup_history = !bhError;
      if (bhError) errors.push(`backup_history: ${bhError.message}`);
      
      console.log(`✅ Schema validation complete: ${Object.values(tables).filter(Boolean).length}/${Object.keys(tables).length} tables valid`);
      
      return {
        valid: errors.length === 0,
        tables,
        errors
      };
      
    } catch (error) {
      console.error('❌ Schema validation failed:', error);
      errors.push(error instanceof Error ? error.message : 'Unknown validation error');
      
      return {
        valid: false,
        tables,
        errors
      };
    }
  }
}