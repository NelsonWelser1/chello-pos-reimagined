
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Target, AlertTriangle, TrendingUp } from "lucide-react";
import { ExpenseSummary } from "./ExpenseReportTypes";

interface ExpenseSummaryCardsProps {
  summary: ExpenseSummary;
}

export default function ExpenseSummaryCards({ summary }: ExpenseSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Expenses</p>
              <p className="text-3xl font-bold">${summary.totalExpenses.toLocaleString()}</p>
              <p className="text-blue-200 text-sm mt-1">+5.2% from last month</p>
            </div>
            <DollarSign className="w-12 h-12 text-blue-200" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Budget Utilization</p>
              <p className="text-3xl font-bold">{summary.budgetUtilization}%</p>
              <p className="text-green-200 text-sm mt-1">Within target range</p>
            </div>
            <Target className="w-12 h-12 text-green-200" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Pending Approvals</p>
              <p className="text-3xl font-bold">${summary.pendingApprovals.toLocaleString()}</p>
              <p className="text-orange-200 text-sm mt-1">8 items pending</p>
            </div>
            <AlertTriangle className="w-12 h-12 text-orange-200" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Projected Savings</p>
              <p className="text-3xl font-bold">${summary.projectedSavings.toLocaleString()}</p>
              <p className="text-purple-200 text-sm mt-1">AI optimization potential</p>
            </div>
            <TrendingUp className="w-12 h-12 text-purple-200" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
