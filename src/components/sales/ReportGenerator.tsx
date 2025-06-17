
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { FileText, Settings, Download, Eye } from "lucide-react";
import { toast } from "sonner";
import { SalesTransaction } from "@/hooks/useSalesTransactions";

interface ReportGeneratorProps {
  transactions: SalesTransaction[];
}

export function ReportGenerator({ transactions }: ReportGeneratorProps) {
  const [reportConfig, setReportConfig] = useState({
    type: "comprehensive",
    period: "month",
    includeCharts: true,
    includeComparisons: true,
    includeForecasts: false,
    format: "pdf"
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateAdvancedReport = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate advanced report generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast.success(`Advanced ${reportConfig.type} report generated successfully!`);
    } catch (error) {
      toast.error("Failed to generate advanced report");
    } finally {
      setIsGenerating(false);
    }
  };

  const reportTypes = [
    { value: "comprehensive", label: "Comprehensive Business Report", description: "Full analysis with all metrics" },
    { value: "financial", label: "Financial Performance", description: "Revenue, costs, and profitability" },
    { value: "operational", label: "Operational Efficiency", description: "Service times and staff performance" },
    { value: "customer", label: "Customer Analytics", description: "Behavior patterns and satisfaction" },
    { value: "inventory", label: "Inventory Impact", description: "Stock levels and menu performance" }
  ];

  return (
    <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl font-black text-slate-800">
          <Settings className="w-6 h-6 text-blue-600" />
          Advanced Report Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Report Type</label>
              <Select value={reportConfig.type} onValueChange={(value) => setReportConfig(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      <div>
                        <div className="font-semibold">{type.label}</div>
                        <div className="text-sm text-gray-500">{type.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Time Period</label>
              <Select value={reportConfig.period} onValueChange={(value) => setReportConfig(prev => ({ ...prev, period: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="quarter">Last Quarter</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Output Format</label>
              <Select value={reportConfig.format} onValueChange={(value) => setReportConfig(prev => ({ ...prev, format: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF Report</SelectItem>
                  <SelectItem value="excel">Excel Workbook</SelectItem>
                  <SelectItem value="powerpoint">PowerPoint Presentation</SelectItem>
                  <SelectItem value="web">Interactive Web Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-bold text-gray-700">Report Features</label>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="charts" 
                  checked={reportConfig.includeCharts}
                  onCheckedChange={(checked) => setReportConfig(prev => ({ ...prev, includeCharts: checked === true }))}
                />
                <label htmlFor="charts" className="text-sm font-medium">Include Charts & Visualizations</label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="comparisons" 
                  checked={reportConfig.includeComparisons}
                  onCheckedChange={(checked) => setReportConfig(prev => ({ ...prev, includeComparisons: checked === true }))}
                />
                <label htmlFor="comparisons" className="text-sm font-medium">Historical Comparisons</label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="forecasts" 
                  checked={reportConfig.includeForecasts}
                  onCheckedChange={(checked) => setReportConfig(prev => ({ ...prev, includeForecasts: checked === true }))}
                />
                <label htmlFor="forecasts" className="text-sm font-medium">Predictive Forecasts</label>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-bold text-blue-800 mb-2">Report Preview</h4>
              <div className="space-y-2 text-sm text-blue-700">
                <div className="flex justify-between">
                  <span>Data Points:</span>
                  <Badge variant="secondary">{transactions.length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Pages:</span>
                  <Badge variant="secondary">{reportConfig.includeCharts ? "12-15" : "6-8"}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Generation Time:</span>
                  <Badge variant="secondary">~30 seconds</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <Button
            onClick={handleGenerateAdvancedReport}
            disabled={isGenerating}
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 h-12 font-bold text-lg"
          >
            {isGenerating ? (
              <>
                <FileText className="w-5 h-5 mr-2 animate-pulse" />
                Generating Report...
              </>
            ) : (
              <>
                <Download className="w-5 h-5 mr-2" />
                Generate Advanced Report
              </>
            )}
          </Button>
          <Button variant="outline" className="h-12">
            <Eye className="w-5 h-5 mr-2" />
            Preview
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
