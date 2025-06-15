import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, CheckCircle, AlertTriangle, TrendingUp } from "lucide-react";
import type { ExpenseType } from "@/hooks/useExpenseTypes";

interface ExpenseTypeStatsProps {
  expenseTypes: ExpenseType[];
}

export default function ExpenseTypeStats({ expenseTypes }: ExpenseTypeStatsProps) {
  const totalBudget = expenseTypes.reduce((sum, type) => sum + type.budgetLimit, 0);
  const activeTypes = expenseTypes.filter(type => type.isActive).length;
  const approvalRequired = expenseTypes.filter(type => type.requiresApproval).length;
  const taxDeductible = expenseTypes.filter(type => type.taxDeductible).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Total Budget
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalBudget.toLocaleString()}</div>
          <p className="text-sm text-muted-foreground">Across all expense types</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            Active Types
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeTypes}</div>
          <p className="text-sm text-muted-foreground">Currently enabled</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-500" />
            Approval Required
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{approvalRequired}</div>
          <p className="text-sm text-muted-foreground">Types needing approval</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            Tax Deductible
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{taxDeductible}</div>
          <p className="text-sm text-muted-foreground">Eligible for tax deduction</p>
        </CardContent>
      </Card>
    </div>
  );
}
