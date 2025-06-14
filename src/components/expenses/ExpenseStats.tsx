
import { Card, CardContent } from "@/components/ui/card";
import { Receipt, TrendingUp, DollarSign, AlertTriangle, Calendar } from "lucide-react";
import type { Expense, ExpenseType } from "../../pages/Expenses";

interface ExpenseStatsProps {
  expenses: Expense[];
  expenseTypes: ExpenseType[];
}

export default function ExpenseStats({ expenses, expenseTypes }: ExpenseStatsProps) {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
  });

  const totalMonthlyAmount = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  const pendingExpenses = expenses.filter(expense => expense.status === 'Pending');
  const pendingAmount = pendingExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const totalBudget = expenseTypes.reduce((sum, type) => sum + type.budgetLimit, 0);
  const budgetUtilization = totalBudget > 0 ? (totalMonthlyAmount / totalBudget) * 100 : 0;

  const averageExpense = expenses.length > 0 ? expenses.reduce((sum, expense) => sum + expense.amount, 0) / expenses.length : 0;

  const overBudgetTypes = expenseTypes.filter(type => {
    const typeExpenses = monthlyExpenses.filter(expense => expense.typeId === type.id);
    const typeTotal = typeExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    return typeTotal > type.budgetLimit;
  }).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
      <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Expenses</p>
              <p className="text-3xl font-black">{expenses.length}</p>
            </div>
            <Receipt className="w-12 h-12 text-blue-200" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Monthly Total</p>
              <p className="text-3xl font-black">${totalMonthlyAmount.toFixed(2)}</p>
            </div>
            <Calendar className="w-12 h-12 text-green-200" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Pending</p>
              <p className="text-3xl font-black">${pendingAmount.toFixed(2)}</p>
            </div>
            <AlertTriangle className="w-12 h-12 text-orange-200" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Budget Used</p>
              <p className="text-3xl font-black">{budgetUtilization.toFixed(1)}%</p>
            </div>
            <TrendingUp className="w-12 h-12 text-purple-200" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100">Over Budget</p>
              <p className="text-3xl font-black">{overBudgetTypes}</p>
            </div>
            <AlertTriangle className="w-12 h-12 text-red-200" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
