
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Download, FileText, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { SalesTransaction } from "@/hooks/useSalesTransactions";
import { ExportService, ExportOptions } from "@/services/exportService";

interface ExportDialogProps {
  transactions: SalesTransaction[];
  trigger: React.ReactNode;
}

export function ExportDialog({ transactions, trigger }: ExportDialogProps) {
  const [open, setOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<'csv' | 'json' | 'xlsx'>('csv');
  const [includeHeaders, setIncludeHeaders] = useState(true);
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined
  });
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (transactions.length === 0) {
      toast.error("No transactions available to export");
      return;
    }

    setIsExporting(true);

    try {
      const options: ExportOptions = {
        format: exportFormat,
        includeHeaders,
        dateRange: dateRange.from && dateRange.to ? {
          from: dateRange.from.toISOString(),
          to: dateRange.to.toISOString()
        } : undefined
      };

      await ExportService.exportTransactions(transactions, options);
      
      const summary = ExportService.getExportSummary(transactions);
      toast.success(`Successfully exported ${summary.totalTransactions} transactions as ${(exportFormat as string).toUpperCase()}`);
      setOpen(false);
    } catch (error) {
      console.error('Export failed:', error);
      toast.error("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleHeadersChange = (checked: boolean | "indeterminate") => {
    setIncludeHeaders(checked === true);
  };

  const exportSummary = ExportService.getExportSummary(transactions);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5 text-green-600" />
            Export Transaction Data
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Export Summary */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Export Summary</span>
            </div>
            <div className="text-sm text-blue-700">
              <p>{exportSummary.totalTransactions} transactions available</p>
              <p>Total value: UGX {Math.round(exportSummary.totalAmount).toLocaleString('en-UG')}</p>
              {exportSummary.dateRange && (
                <p>Date range: {exportSummary.dateRange.from} - {exportSummary.dateRange.to}</p>
              )}
            </div>
          </div>

          {/* Format Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Export Format</label>
            <Select value={exportFormat} onValueChange={(value: 'csv' | 'json' | 'xlsx') => setExportFormat(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV (Comma Separated Values)</SelectItem>
                <SelectItem value="json">JSON (JavaScript Object Notation)</SelectItem>
                <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Range Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Date Range (Optional)</label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "flex-1 justify-start text-left font-normal",
                      !dateRange.from && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? format(dateRange.from, "PPP") : "From date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateRange.from}
                    onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "flex-1 justify-start text-left font-normal",
                      !dateRange.to && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.to ? format(dateRange.to, "PPP") : "To date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateRange.to}
                    onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Export Options</label>
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

          {/* Warning for no data */}
          {transactions.length === 0 && (
            <div className="bg-yellow-50 p-4 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <span className="text-sm text-yellow-700">
                No transaction data available to export. Process some orders first.
              </span>
            </div>
          )}

          {/* Export Button */}
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleExport}
              disabled={isExporting || transactions.length === 0}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {isExporting ? "Exporting..." : "Export Data"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
