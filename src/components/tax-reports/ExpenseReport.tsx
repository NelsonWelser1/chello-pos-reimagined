
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ExpenseReportHeader from "./ExpenseReportHeader";
import ExpenseSummaryCards from "./ExpenseSummaryCards";
import ExpenseChartControls from "./ExpenseChartControls";
import ExpenseCharts from "./ExpenseCharts";
import ExpenseAnalyticsTabs from "./ExpenseAnalyticsTabs";
import { mockExpenseData } from "./ExpenseReportTypes";

export default function ExpenseReport() {
  const [activeChart, setActiveChart] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTimeframe, setSelectedTimeframe] = useState("monthly");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter data based on search and category
  const filteredData = useMemo(() => {
    let filtered = mockExpenseData.categoryBreakdown;
    
    if (selectedCategory !== "all") {
      filtered = filtered.filter(cat => cat.category === selectedCategory);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(cat => 
        cat.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  }, [searchTerm, selectedCategory]);

  // Create efficiency data for scatter chart
  const efficiencyData = useMemo(() => {
    return filteredData.map(cat => ({
      category: cat.category,
      efficiency: cat.efficiency,
      amount: cat.amount
    }));
  }, [filteredData]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  const handleExport = () => {
    console.log("Exporting expense report...");
  };

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <ExpenseReportHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedTimeframe={selectedTimeframe}
        setSelectedTimeframe={setSelectedTimeframe}
        categoryBreakdown={mockExpenseData.categoryBreakdown}
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
        onExport={handleExport}
      />

      <ExpenseSummaryCards summary={mockExpenseData.summary} />

      <Card className="bg-white shadow-lg border border-slate-200">
        <CardHeader className="border-b border-slate-200">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-slate-800">Expense Analytics Dashboard</CardTitle>
            <ExpenseChartControls 
              activeChart={activeChart}
              setActiveChart={setActiveChart}
            />
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <ExpenseCharts
            activeChart={activeChart}
            filteredData={filteredData}
            trendsData={selectedTimeframe === "weekly" ? mockExpenseData.weeklyTrends : mockExpenseData.monthlyTrends}
            selectedTimeframe={selectedTimeframe}
            efficiencyData={efficiencyData}
            expenseForecasting={mockExpenseData.expenseForecasting}
          />
        </CardContent>
      </Card>

      <ExpenseAnalyticsTabs
        filteredData={filteredData}
        vendorAnalysis={mockExpenseData.vendorAnalysis}
        taxAnalysis={mockExpenseData.taxAnalysis}
        costOptimization={mockExpenseData.costOptimization}
        recentExpenses={mockExpenseData.recentExpenses}
      />
    </div>
  );
}
