
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, ComposedChart,
  ReferenceLine
} from "recharts";
import { 
  TrendingUp, TrendingDown, DollarSign, Receipt, Users, Calendar, 
  Download, FileText, Filter, AlertTriangle, Target, BarChart3,
  PieChart as PieChartIcon, Activity, Zap, Clock, Award
} from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import OverallReportsKPI from "@/components/overall-reports/OverallReportsKPI";
import OverallReportsProfitability from "@/components/overall-reports/OverallReportsProfitability";
import OverallReportsOperational from "@/components/overall-reports/OverallReportsOperational";
import OverallReportsComparative from "@/components/overall-reports/OverallReportsComparative";
import OverallReportsForecasting from "@/components/overall-reports/OverallReportsForecasting";

export default function OverallReports() {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [comparisonPeriod, setComparisonPeriod] = useState("previous");
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["revenue", "expenses", "profit"]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  📊 Overall Reports & Analytics
                </h1>
                <p className="text-muted-foreground mt-2">
                  Comprehensive business intelligence and performance analytics
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="quarter">This Quarter</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
                <SidebarTrigger />
              </div>
            </div>

            <Tabs defaultValue="kpi" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="kpi" className="flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  KPI Dashboard
                </TabsTrigger>
                <TabsTrigger value="profitability" className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Profitability
                </TabsTrigger>
                <TabsTrigger value="operational" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Operational
                </TabsTrigger>
                <TabsTrigger value="comparative" className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Comparative
                </TabsTrigger>
                <TabsTrigger value="forecasting" className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Forecasting
                </TabsTrigger>
              </TabsList>

              <TabsContent value="kpi" className="space-y-6">
                <OverallReportsKPI selectedPeriod={selectedPeriod} />
              </TabsContent>

              <TabsContent value="profitability" className="space-y-6">
                <OverallReportsProfitability selectedPeriod={selectedPeriod} />
              </TabsContent>

              <TabsContent value="operational" className="space-y-6">
                <OverallReportsOperational selectedPeriod={selectedPeriod} />
              </TabsContent>

              <TabsContent value="comparative" className="space-y-6">
                <OverallReportsComparative 
                  selectedPeriod={selectedPeriod} 
                  comparisonPeriod={comparisonPeriod}
                />
              </TabsContent>

              <TabsContent value="forecasting" className="space-y-6">
                <OverallReportsForecasting selectedPeriod={selectedPeriod} />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
