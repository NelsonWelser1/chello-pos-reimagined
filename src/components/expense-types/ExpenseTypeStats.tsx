
import { Card, CardContent } from "@/components/ui/card";
import { Settings, DollarSign, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import type { ExpenseType } from "../../pages/ExpenseTypes";

interface ExpenseTypeStatsProps {
  expenseTypes: ExpenseType[];
}

export default function ExpenseTypeStats({ expenseTypes }: ExpenseTypeStatsProps) {
  const activeTypes = expenseTypes.filter(type => type.isActive);
  const totalBudgetAllocated = expenseTypes.reduce((sum, type) => sum + type.budgetLimit, 0);
  const typesRequiringApproval = expenseTypes.filter(type => type.requiresApproval).length;
  const averageBudgetLimit = expenseTypes.length > 0 ? totalBudgetAllocated / expenseTypes.length : 0;
  const criticalPriorityTypes = expenseTypes.filter(type => type.priority === 'Critical').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
      <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Types</p>
              <p className="text-3xl font-black">{expenseTypes.length}</p>
            </div>
            <Settings className="w-12 h-12 text-blue-200" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Active Types</p>
              <p className="text-3xl font-black">{activeTypes.length}</p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-200" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Total Budget</p>
              <p className="text-3xl font-black">${totalBudgetAllocated.toLocaleString()}</p>
            </div>
            <DollarSign className="w-12 h-12 text-purple-200" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Need Approval</p>
              <p className="text-3xl font-black">{typesRequiringApproval}</p>
            </div>
            <TrendingUp className="w-12 h-12 text-orange-200" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100">Critical Priority</p>
              <p className="text-3xl font-black">{criticalPriorityTypes}</p>
            </div>
            <AlertTriangle className="w-12 h-12 text-red-200" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
