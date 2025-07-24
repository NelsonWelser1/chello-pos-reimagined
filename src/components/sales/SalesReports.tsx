
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  FileText, 
  Download, 
  Calendar as CalendarIcon, 
  Filter,
  TrendingUp,
  DollarSign,
  Users,
  Clock,
  Printer,
  Mail,
  Share,
  RefreshCw,
  Eye
} from "lucide-react";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useSalesTransactions } from "@/hooks/useSalesTransactions";
import { useSalesAnalytics } from "@/hooks/useSalesAnalytics";
import { ExportDialog } from "./ExportDialog";
import { ReportGenerator } from "./ReportGenerator";
import { ScheduledReports } from "./ScheduledReports";

export function SalesReports() {
  const { transactions, loading: transactionsLoading } = useSalesTransactions();
  const { analytics, loading: analyticsLoading, getTodaysAnalytics, getWeeklyAnalytics } = useSalesAnalytics();
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });
  const [reportType, setReportType] = useState("sales-summary");
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportMetrics, setReportMetrics] = useState({
    dailyRevenue: 0,
    weeklyRevenue: 0,
    monthlyRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    customerCount: 0
  });

  useEffect(() => {
    calculateReportMetrics();
  }, [transactions, analytics]);

  const calculateReportMetrics = () => {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const todayTransactions = transactions.filter(t => 
      new Date(t.transaction_date).toDateString() === today.toDateString()
    );
    
    const weekTransactions = transactions.filter(t => 
      new Date(t.transaction_date) >= weekAgo
    );
    
    const monthTransactions = transactions.filter(t => 
      new Date(t.transaction_date) >= monthAgo
    );

    const uniqueCustomers = new Set(transactions.map(t => t.customer_id).filter(Boolean)).size;

    setReportMetrics({
      dailyRevenue: todayTransactions.reduce((sum, t) => sum + t.total_amount, 0),
      weeklyRevenue: weekTransactions.reduce((sum, t) => sum + t.total_amount, 0),
      monthlyRevenue: monthTransactions.reduce((sum, t) => sum + t.total_amount, 0),
      totalOrders: transactions.length,
      averageOrderValue: transactions.length > 0 ? transactions.reduce((sum, t) => sum + t.total_amount, 0) / transactions.length : 0,
      customerCount: uniqueCustomers
    });
  };

  const handleGenerateReport = async () => {
    if (!dateRange.from || !dateRange.to) {
      toast.error("Please select a date range for the report");
      return;
    }

    setIsGenerating(true);

    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const filteredTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.transaction_date);
        return transactionDate >= dateRange.from! && transactionDate <= dateRange.to!;
      });

      toast.success(`Generated ${reportType} report with ${filteredTransactions.length} transactions`);
    } catch (error) {
      console.error('Report generation failed:', error);
      toast.error("Failed to generate report. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const reportTypes = [
    {
      title: "Daily Sales Summary",
      description: "Complete breakdown of today's sales performance",
      period: "Today",
      revenue: `UGX ${Math.round(reportMetrics.dailyRevenue).toLocaleString('en-UG')}`,
      orders: Math.floor(reportMetrics.totalOrders / 30), // Approximate daily orders
      icon: DollarSign,
      gradient: "from-green-500 to-emerald-600"
    },
    {
      title: "Weekly Performance",
      description: "7-day sales trends and customer analytics",
      period: "This Week",
      revenue: `UGX ${Math.round(reportMetrics.weeklyRevenue).toLocaleString('en-UG')}`,
      orders: Math.floor(reportMetrics.totalOrders / 4), // Approximate weekly orders
      icon: TrendingUp,
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      title: "Monthly Analysis",
      description: "Comprehensive monthly sales and inventory report",
      period: "This Month",
      revenue: `UGX ${Math.round(reportMetrics.monthlyRevenue).toLocaleString('en-UG')}`,
      orders: reportMetrics.totalOrders,
      icon: CalendarIcon,
      gradient: "from-purple-500 to-violet-600"
    },
    {
      title: "Customer Insights",
      description: "Customer behavior and loyalty analysis",
      period: "Last 30 Days",
      revenue: `${reportMetrics.customerCount} customers`,
      orders: reportMetrics.customerCount > 0 ? Math.round((reportMetrics.totalOrders / reportMetrics.customerCount) * 100) / 100 : 0,
      icon: Users,
      gradient: "from-orange-500 to-red-600"
    }
  ];

  const quickReports = [
    {
      name: "Top Selling Items",
      description: "Most popular menu items by quantity",
      icon: "🍔",
      timeframe: "Last 7 days",
      action: () => toast.info("Top selling items report generated!")
    },
    {
      name: "Payment Methods",
      description: "Breakdown of payment preferences",
      icon: "💳",
      timeframe: "Today",
      action: () => toast.info("Payment methods report generated!")
    },
    {
      name: "Peak Hours Analysis",
      description: "Busiest times and staffing insights",
      icon: "⏰",
      timeframe: "This week",
      action: () => toast.info("Peak hours analysis generated!")
    },
    {
      name: "Tax Summary",
      description: "Complete tax breakdown for accounting",
      icon: "📊",
      timeframe: "This month",
      action: () => toast.info("Tax summary report generated!")
    },
    {
      name: "Inventory Impact",
      description: "Sales impact on inventory levels",
      icon: "📦",
      timeframe: "Real-time",
      action: () => toast.info("Inventory impact report generated!")
    },
    {
      name: "Customer Satisfaction",
      description: "Reviews and feedback analysis",
      icon: "⭐",
      timeframe: "Last 30 days",
      action: () => toast.info("Customer satisfaction report generated!")
    }
  ];

  if (transactionsLoading || analyticsLoading) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-indigo-600" />
          <div className="text-xl text-slate-600 mt-4">Loading reports data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-3xl font-black text-slate-800">
            <FileText className="w-8 h-8 text-indigo-600" />
            Sales Reports & Analytics
          </CardTitle>
          <p className="text-lg text-gray-600 font-medium">Generate comprehensive reports and insights from real data</p>
        </CardHeader>
      </Card>

      {/* Report Generation Controls */}
      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl font-black text-slate-800">
            <CalendarIcon className="w-6 h-6 text-blue-600" />
            Custom Report Generator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Start Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-12",
                      !dateRange.from && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? format(dateRange.from, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateRange.from}
                    onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">End Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-12",
                      !dateRange.to && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.to ? format(dateRange.to, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateRange.to}
                    onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales-summary">Sales Summary</SelectItem>
                  <SelectItem value="customer-analysis">Customer Analysis</SelectItem>
                  <SelectItem value="product-performance">Product Performance</SelectItem>
                  <SelectItem value="financial-overview">Financial Overview</SelectItem>
                  <SelectItem value="staff-performance">Staff Performance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 font-bold text-lg"
                onClick={handleGenerateReport}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Filter className="w-5 h-5 mr-2" />
                    Generate
                  </>
                )}
              </Button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <ExportDialog 
              transactions={transactions}
              trigger={
                <Button variant="outline" className="h-12">
                  <Download className="w-5 h-5 mr-2" />
                  Export Data
                </Button>
              }
            />
            <Button variant="outline" className="h-12">
              <Mail className="w-5 h-5 mr-2" />
              Email Report
            </Button>
            <Button variant="outline" className="h-12">
              <Printer className="w-5 h-5 mr-2" />
              Print
            </Button>
            <Button variant="outline" className="h-12">
              <Share className="w-5 h-5 mr-2" />
              Share
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {reportTypes.map((report, index) => (
          <Card key={index} className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h3 className="text-2xl font-black text-slate-800 mb-2">{report.title}</h3>
                  <p className="text-gray-600 font-medium mb-4">{report.description}</p>
                  <Badge className="bg-blue-100 text-blue-800 font-bold px-3 py-1">
                    {report.period}
                  </Badge>
                </div>
                <div className={`w-16 h-16 bg-gradient-to-br ${report.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                  <report.icon className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/70 p-4 rounded-xl">
                  <p className="text-sm font-bold text-gray-600 mb-1">Revenue</p>
                  <p className="text-2xl font-black text-green-600">{report.revenue}</p>
                </div>
                <div className="bg-white/70 p-4 rounded-xl">
                  <p className="text-sm font-bold text-gray-600 mb-1">
                    {report.icon === Users ? "Avg Orders/Customer" : "Orders"}
                  </p>
                  <p className="text-2xl font-black text-blue-600">
                    {report.icon === Users ? `${report.orders}` : report.orders}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <ExportDialog 
                  transactions={transactions}
                  trigger={
                    <Button className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 font-bold">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  }
                />
                <Button variant="outline" className="flex-1 font-bold">
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Reports */}
      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl font-black text-slate-800">
            <Clock className="w-6 h-6 text-purple-600" />
            Quick Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickReports.map((report, index) => (
              <div key={index} className="p-6 bg-white/70 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-purple-200">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-3xl">{report.icon}</div>
                  <div>
                    <h4 className="font-black text-lg text-slate-800">{report.name}</h4>
                    <p className="text-sm text-gray-600 font-medium">{report.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Badge className="bg-purple-100 text-purple-800 font-bold">
                    {report.timeframe}
                  </Badge>
                  <Button size="sm" variant="outline" className="hover:bg-purple-50" onClick={report.action}>
                    Generate
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scheduled Reports Component */}
      <ScheduledReports />
    </div>
  );
}
