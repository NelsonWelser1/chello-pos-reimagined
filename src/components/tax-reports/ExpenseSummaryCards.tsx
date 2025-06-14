
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, AlertTriangle, FileText, Target } from "lucide-react";
import { ExpenseSummary, TaxAnalysis } from "./ExpenseReportTypes";

interface ExpenseSummaryCardsProps {
  summary: ExpenseSummary;
  taxAnalysis: TaxAnalysis;
}

export default function ExpenseSummaryCards({ summary, taxAnalysis }: ExpenseSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Expenses</p>
              <p className="text-2xl font-bold">${summary.totalExpenses.toLocaleString()}</p>
              <p className="text-blue-200 text-xs mt-1">
                Projected Annual: ${summary.projectedAnnualExpenses.toLocaleString()}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-200" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Budget Efficiency</p>
              <p className="text-2xl font-bold">{summary.budgetUtilization}%</p>
              <p className="text-green-200 text-xs mt-1">
                Savings Opportunity: ${summary.costSavingsOpportunity.toLocaleString()}
              </p>
            </div>
            <Target className="w-8 h-8 text-green-200" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Tax Deductible</p>
              <p className="text-2xl font-bold">${summary.taxDeductible.toLocaleString()}</p>
              <p className="text-orange-200 text-xs mt-1">
                Est. Tax Savings: ${taxAnalysis.estimatedTaxSavings.toLocaleString()}
              </p>
            </div>
            <FileText className="w-8 h-8 text-orange-200" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Over Budget</p>
              <p className="text-2xl font-bold">{summary.overBudgetCategories}</p>
              <p className="text-red-200 text-xs mt-1">
                Pending: ${summary.pendingExpenses.toLocaleString()}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-200" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
