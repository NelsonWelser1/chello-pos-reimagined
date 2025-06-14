
import { useState, useMemo } from "react";
import ExpenseReportHeader from "./ExpenseReportHeader";
import ExpenseSummaryCards from "./ExpenseSummaryCards";
import ExpenseChartControls from "./ExpenseChartControls";
import ExpenseCharts from "./ExpenseCharts";
import ExpenseAnalyticsTabs from "./ExpenseAnalyticsTabs";
import { mockExpenseData } from "./ExpenseReportTypes";

export default function ExpenseReport() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTimeframe, setSelectedTimeframe] = useState("monthly");
  const [activeChart, setActiveChart] = useState("overview");

  const { summary, categoryBreakdown, monthlyTrends, weeklyTrends, vendorAnalysis, taxAnalysis, costOptimization, expenseForecasting } = mockExpenseData;

  // Filter data based on search and category selection
  const filteredData = useMemo(() => {
    let filtered = categoryBreakdown;
    
    if (selectedCategory !== "all") {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  }, [searchTerm, selectedCategory, categoryBreakdown]);

  // Transform data for different chart types
  const trendsData = selectedTimeframe === "weekly" ? weeklyTrends : monthlyTrends;
  
  const efficiencyData = categoryBreakdown.map(item => ({
    category: item.category.split(' ')[0],
    efficiency: item.efficiency,
    amount: item.amount
  }));

  // Export functionality
  const handleExport = (format: string) => {
    console.log(`Exporting expense report as ${format}`);
    // In a real app, this would trigger actual export functionality
  };

  return (
    <div className="space-y-6">
      <ExpenseReportHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedTimeframe={selectedTimeframe}
        setSelectedTimeframe={setSelectedTimeframe}
        categoryBreakdown={categoryBreakdown}
        onExport={handleExport}
      />

      <ExpenseSummaryCards 
        summary={summary}
        taxAnalysis={taxAnalysis}
      />

      <ExpenseChartControls 
        activeChart={activeChart}
        setActiveChart={setActiveChart}
      />

      <ExpenseCharts
        activeChart={activeChart}
        filteredData={filteredData}
        trendsData={trendsData}
        selectedTimeframe={selectedTimeframe}
        efficiencyData={efficiencyData}
        expenseForecasting={expenseForecasting}
      />

      <ExpenseAnalyticsTabs
        filteredData={filteredData}
        vendorAnalysis={vendorAnalysis}
        taxAnalysis={taxAnalysis}
        costOptimization={costOptimization}
      />
    </div>
  );
}
