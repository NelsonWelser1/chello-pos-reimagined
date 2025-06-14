
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, AlertTriangle, Target } from "lucide-react";
import type { ExpenseType } from "../../pages/ExpenseTypes";

interface ExpenseTypeBudgetAnalysisProps {
  expenseTypes: ExpenseType[];
}

export default function ExpenseTypeBudgetAnalysis({ expenseTypes }: ExpenseTypeBudgetAnalysisProps) {
  // Mock expense data for analysis (in a real app, this would come from actual expense records)
  const mockExpenseData = expenseTypes.map(type => ({
    typeId: type.id,
    spent: Math.random() * type.budgetLimit * 1.2, // Some types might be over budget
    forecast: Math.random() * type.budgetLimit * 0.3 + Math.random() * type.budgetLimit * 1.2
  }));

  const getBudgetStatus = (spent: number, budget: number) => {
    const percentage = (spent / budget) * 100;
    if (percentage > 100) return { status: 'over', color: 'text-red-600', bgColor: 'bg-red-100' };
    if (percentage > 90) return { status: 'warning', color: 'text-orange-600', bgColor: 'bg-orange-100' };
    if (percentage > 75) return { status: 'caution', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    return { status: 'good', color: 'text-green-600', bgColor: 'bg-green-100' };
  };

  const totalBudget = expenseTypes.reduce((sum, type) => sum + type.budgetLimit, 0);
  const totalSpent = mockExpenseData.reduce((sum, data) => sum + data.spent, 0);
  const totalForecast = mockExpenseData.reduce((sum, data) => sum + data.forecast, 0);

  return (
    <div className="space-y-6">
      {/* Overall Budget Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Budget</p>
                <p className="text-2xl font-bold">${totalBudget.toLocaleString()}</p>
              </div>
              <Target className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-2xl font-bold">${totalSpent.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">
                  {((totalSpent / totalBudget) * 100).toFixed(1)}% of budget
                </p>
              </div>
              {totalSpent > totalBudget ? (
                <TrendingUp className="w-8 h-8 text-red-500" />
              ) : (
                <TrendingDown className="w-8 h-8 text-green-500" />
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Forecast</p>
                <p className="text-2xl font-bold">${totalForecast.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">
                  {((totalForecast / totalBudget) * 100).toFixed(1)}% of budget
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Individual Type Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Analysis by Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {expenseTypes.map((type) => {
              const expenseData = mockExpenseData.find(data => data.typeId === type.id);
              if (!expenseData) return null;

              const spentPercentage = (expenseData.spent / type.budgetLimit) * 100;
              const forecastPercentage = (expenseData.forecast / type.budgetLimit) * 100;
              const budgetStatus = getBudgetStatus(expenseData.spent, type.budgetLimit);

              return (
                <div key={type.id} className="space-y-3 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: type.color }}
                      />
                      <div>
                        <h4 className="font-medium">{type.name}</h4>
                        <p className="text-sm text-muted-foreground">{type.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className={budgetStatus.bgColor + ' ' + budgetStatus.color}>
                        {budgetStatus.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Budget</p>
                      <p className="font-mono">${type.budgetLimit.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Spent</p>
                      <p className="font-mono">${expenseData.spent.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Remaining</p>
                      <p className="font-mono">${(type.budgetLimit - expenseData.spent).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Forecast</p>
                      <p className="font-mono">${expenseData.forecast.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Spent ({spentPercentage.toFixed(1)}%)</span>
                      <span>${expenseData.spent.toLocaleString()}</span>
                    </div>
                    <Progress value={Math.min(spentPercentage, 100)} className="h-2" />
                    
                    {forecastPercentage > spentPercentage && (
                      <>
                        <div className="flex justify-between text-sm text-orange-600">
                          <span>Forecast ({forecastPercentage.toFixed(1)}%)</span>
                          <span>${expenseData.forecast.toLocaleString()}</span>
                        </div>
                        <Progress value={Math.min(forecastPercentage, 100)} className="h-1 opacity-50" />
                      </>
                    )}
                  </div>

                  {spentPercentage >= type.notificationThreshold && (
                    <div className="flex items-center gap-2 p-2 bg-orange-50 rounded text-orange-800 text-sm">
                      <AlertTriangle className="w-4 h-4" />
                      <span>
                        Alert: {spentPercentage.toFixed(1)}% of budget used (threshold: {type.notificationThreshold}%)
                      </span>
                    </div>
                  )}

                  {spentPercentage > 100 && !type.allowOverBudget && (
                    <div className="flex items-center gap-2 p-2 bg-red-50 rounded text-red-800 text-sm">
                      <AlertTriangle className="w-4 h-4" />
                      <span>
                        Warning: Budget exceeded by ${(expenseData.spent - type.budgetLimit).toLocaleString()}. Over-budget spending not allowed for this type.
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
