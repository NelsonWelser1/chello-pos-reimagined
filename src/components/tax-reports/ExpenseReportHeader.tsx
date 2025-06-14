
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Download, RefreshCw } from "lucide-react";
import { CategoryBreakdown } from "./ExpenseReportTypes";

interface ExpenseReportHeaderProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  selectedTimeframe: string;
  setSelectedTimeframe: (value: string) => void;
  categoryBreakdown: CategoryBreakdown[];
  isRefreshing: boolean;
  onRefresh: () => void;
  onExport: () => void;
}

export default function ExpenseReportHeader({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedTimeframe,
  setSelectedTimeframe,
  categoryBreakdown,
  isRefreshing,
  onRefresh,
  onExport
}: ExpenseReportHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-lg border border-slate-200">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
          💰 Smart Expense Analytics
        </h1>
        <p className="text-slate-600 mt-2 text-lg">AI-powered insights for optimal financial management</p>
      </div>
      
      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-64 border-slate-300 focus:border-blue-500 transition-colors"
          />
        </div>
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48 border-slate-300 focus:border-blue-500">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categoryBreakdown.map(cat => (
              <SelectItem key={cat.category} value={cat.category}>{cat.category}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
          <SelectTrigger className="w-32 border-slate-300 focus:border-blue-500">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>

        <Button 
          variant="outline" 
          onClick={onRefresh}
          disabled={isRefreshing}
          className="border-slate-300 hover:border-blue-500 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>

        <Button onClick={onExport} className="bg-blue-600 hover:bg-blue-700 transition-colors">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>
    </div>
  );
}
