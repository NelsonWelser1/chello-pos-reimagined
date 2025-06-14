
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, Upload, Clock, CheckCircle, XCircle } from "lucide-react";

export function ImportExportHistory() {
  const historyData = [
    {
      id: 1,
      type: "import",
      dataType: "Menu Items",
      fileName: "menu_items_2024.csv",
      status: "completed",
      timestamp: "2024-01-15 14:30",
      records: 245,
    },
    {
      id: 2,
      type: "export",
      dataType: "Sales Data",
      fileName: "sales_export_january.xlsx",
      status: "completed",
      timestamp: "2024-01-14 09:15",
      records: 1420,
    },
    {
      id: 3,
      type: "import",
      dataType: "Ingredients",
      fileName: "ingredients_update.json",
      status: "failed",
      timestamp: "2024-01-13 16:45",
      records: 0,
      error: "Invalid JSON format",
    },
    {
      id: 4,
      type: "export",
      dataType: "Full Backup",
      fileName: "restaurant_backup_2024.json",
      status: "processing",
      timestamp: "2024-01-12 11:20",
      records: 5230,
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "processing":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-600" />
          Import/Export History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {historyData.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {item.type === "import" ? (
                    <Upload className="w-5 h-5 text-blue-600" />
                  ) : (
                    <Download className="w-5 h-5 text-green-600" />
                  )}
                  {getStatusIcon(item.status)}
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">{item.fileName}</span>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    {item.dataType} • {item.timestamp} • {item.records} records
                    {item.error && (
                      <span className="text-red-600 ml-2">• {item.error}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {item.status === "completed" && item.type === "export" && (
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                )}
                {item.status === "failed" && (
                  <Button size="sm" variant="outline">
                    Retry
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
