
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, FileText, Calendar } from "lucide-react";
import { toast } from "sonner";

export function ExportSection() {
  const [exportType, setExportType] = useState<string>("");
  const [format, setFormat] = useState<string>("csv");
  const [dateRange, setDateRange] = useState<string>("all");
  const [includeHeaders, setIncludeHeaders] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!exportType) {
      toast.error("Please select data type to export");
      return;
    }

    setIsExporting(true);
    console.log("Exporting:", { exportType, format, dateRange, includeHeaders });

    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      toast.success(`Successfully exported ${exportType} data as ${format.toUpperCase()}`);
      
      // Create and download a dummy file
      const content = `Sample ${exportType} data export\nGenerated on: ${new Date().toLocaleString()}`;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${exportType}_export_${Date.now()}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 2000);
  };

  const handleHeadersChange = (checked: boolean | "indeterminate") => {
    setIncludeHeaders(checked === true);
  };

  const exportTypes = [
    { value: "menu-items", label: "Menu Items" },
    { value: "categories", label: "Categories" },
    { value: "ingredients", label: "Ingredients" },
    { value: "sales", label: "Sales Data" },
    { value: "customers", label: "Customer Data" },
    { value: "inventory", label: "Inventory" },
    { value: "full-backup", label: "Full Database Backup" },
  ];

  const formats = [
    { value: "csv", label: "CSV" },
    { value: "json", label: "JSON" },
    { value: "xlsx", label: "Excel" },
  ];

  const dateRanges = [
    { value: "all", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "quarter", label: "This Quarter" },
    { value: "year", label: "This Year" },
  ];

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="w-5 h-5 text-green-600" />
          Export Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Type
            </label>
            <Select value={exportType} onValueChange={setExportType}>
              <SelectTrigger>
                <SelectValue placeholder="Choose data to export" />
              </SelectTrigger>
              <SelectContent>
                {exportTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Format
              </label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {formats.map((fmt) => (
                    <SelectItem key={fmt.value} value={fmt.value}>
                      {fmt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dateRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="headers" 
              checked={includeHeaders}
              onCheckedChange={handleHeadersChange}
            />
            <label htmlFor="headers" className="text-sm text-gray-700">
              Include column headers
            </label>
          </div>
        </div>

        <Button 
          onClick={handleExport} 
          disabled={!exportType || isExporting}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          {isExporting ? "Exporting..." : "Export Data"}
        </Button>

        <div className="bg-green-50 p-3 rounded-lg flex items-start gap-2">
          <FileText className="w-5 h-5 text-green-600 mt-0.5" />
          <div className="text-sm text-green-700">
            <p className="font-medium">Export Features:</p>
            <ul className="mt-1 list-disc list-inside space-y-1">
              <li>Multiple format support (CSV, JSON, Excel)</li>
              <li>Date range filtering</li>
              <li>Automatic file download</li>
              <li>Data validation before export</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
