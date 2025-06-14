
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter,
  TrendingUp,
  DollarSign,
  Users,
  Clock,
  Printer,
  Mail,
  Share
} from "lucide-react";

const reportTypes = [
  {
    title: "Daily Sales Summary",
    description: "Complete breakdown of today's sales performance",
    period: "Today",
    revenue: "$24,580",
    orders: 342,
    icon: DollarSign,
    gradient: "from-green-500 to-emerald-600"
  },
  {
    title: "Weekly Performance",
    description: "7-day sales trends and customer analytics",
    period: "This Week",
    revenue: "$167,240",
    orders: 2156,
    icon: TrendingUp,
    gradient: "from-blue-500 to-cyan-600"
  },
  {
    title: "Monthly Analysis",
    description: "Comprehensive monthly sales and inventory report",
    period: "This Month",
    revenue: "$684,320",
    orders: 8943,
    icon: Calendar,
    gradient: "from-purple-500 to-violet-600"
  },
  {
    title: "Customer Insights",
    description: "Customer behavior and loyalty analysis",
    period: "Last 30 Days",
    revenue: "1,234 customers",
    orders: 67,
    icon: Users,
    gradient: "from-orange-500 to-red-600"
  }
];

const quickReports = [
  {
    name: "Top Selling Items",
    description: "Most popular menu items by quantity",
    icon: "🍔",
    timeframe: "Last 7 days"
  },
  {
    name: "Payment Methods",
    description: "Breakdown of payment preferences",
    icon: "💳",
    timeframe: "Today"
  },
  {
    name: "Peak Hours Analysis",
    description: "Busiest times and staffing insights",
    icon: "⏰",
    timeframe: "This week"
  },
  {
    name: "Tax Summary",
    description: "Complete tax breakdown for accounting",
    icon: "📊",
    timeframe: "This month"
  },
  {
    name: "Inventory Impact",
    description: "Sales impact on inventory levels",
    icon: "📦",
    timeframe: "Real-time"
  },
  {
    name: "Customer Satisfaction",
    description: "Reviews and feedback analysis",
    icon: "⭐",
    timeframe: "Last 30 days"
  }
];

export function SalesReports() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-3xl font-black text-slate-800">
            <FileText className="w-8 h-8 text-indigo-600" />
            Sales Reports & Analytics
          </CardTitle>
          <p className="text-lg text-gray-600 font-medium">Generate comprehensive reports and insights</p>
        </CardHeader>
      </Card>

      {/* Report Generation Controls */}
      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl font-black text-slate-800">
            <Calendar className="w-6 h-6 text-blue-600" />
            Custom Report Generator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Start Date</label>
              <Input type="date" className="h-12" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">End Date</label>
              <Input type="date" className="h-12" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Report Type</label>
              <select className="w-full h-12 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Sales Summary</option>
                <option>Customer Analysis</option>
                <option>Product Performance</option>
                <option>Financial Overview</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button className="w-full h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 font-bold text-lg">
                <Filter className="w-5 h-5 mr-2" />
                Generate
              </Button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="h-12">
              <Download className="w-5 h-5 mr-2" />
              Download PDF
            </Button>
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
                    {report.icon === Users ? "Repeat Rate" : "Orders"}
                  </p>
                  <p className="text-2xl font-black text-blue-600">
                    {report.icon === Users ? `${report.orders}%` : report.orders}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 font-bold">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" className="flex-1 font-bold">
                  <FileText className="w-4 h-4 mr-2" />
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
                  <Button size="sm" variant="outline" className="hover:bg-purple-50">
                    Generate
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scheduled Reports */}
      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl font-black text-slate-800">
            <Calendar className="w-6 h-6 text-green-600" />
            Scheduled Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/70 rounded-xl">
              <div>
                <h4 className="font-black text-lg">Daily Sales Summary</h4>
                <p className="text-gray-600 font-medium">Sent every day at 11:00 PM</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-green-100 text-green-800 font-bold">Active</Badge>
                <Button size="sm" variant="outline">Configure</Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-white/70 rounded-xl">
              <div>
                <h4 className="font-black text-lg">Weekly Performance</h4>
                <p className="text-gray-600 font-medium">Sent every Monday at 9:00 AM</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-green-100 text-green-800 font-bold">Active</Badge>
                <Button size="sm" variant="outline">Configure</Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-white/70 rounded-xl">
              <div>
                <h4 className="font-black text-lg">Monthly Analysis</h4>
                <p className="text-gray-600 font-medium">Sent on the 1st of every month</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-yellow-100 text-yellow-800 font-bold">Paused</Badge>
                <Button size="sm" variant="outline">Configure</Button>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <Button className="w-full h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 font-bold text-lg">
              <Calendar className="w-5 h-5 mr-2" />
              Create New Scheduled Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
