import { Database, FileUp, FileDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
export function ImportsExportsHeader() {
  return <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Database className="w-8 h-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Import/Export History - Data Management</h1>
          <p className="text-gray-600">Import and export your restaurant data securely</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FileUp className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="font-semibold text-blue-900">Import Data</h3>
                <p className="text-sm text-blue-700">Upload CSV, JSON, or Excel files</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FileDown className="w-6 h-6 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-900">Export Data</h3>
                <p className="text-sm text-green-700">Download in multiple formats</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Database className="w-6 h-6 text-purple-600" />
              <div>
                <h3 className="font-semibold text-purple-900">Backup & Restore</h3>
                <p className="text-sm text-purple-700">Complete data backups</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
}