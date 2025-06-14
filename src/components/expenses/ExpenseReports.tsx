
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import type { Expense, ExpenseType } from "../../pages/Expenses";

interface ExpenseReportsProps {
  expenses: Expense[];
  expenseTypes: ExpenseType[];
}

export default function ExpenseReports({ expenses, expenseTypes }: ExpenseReportsProps) {
  // Prepare data for category spending chart
  const categoryData = expenseTypes.map(type => {
    const typeExpenses = expenses.filter(expense => expense.typeId === type.id);
    const totalSpent = typeExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const budgetUtilization = type.budgetLimit > 0 ? (totalSpent / type.budgetLimit) * 100 : 0;
    
    return {
      category: type.name,
      spent: totalSpent,
      budget: type.budgetLimit,
      utilization: budgetUtilization,
      color: type.color
    };
  });

  // Monthly trend data
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));
    return {
      month: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      amount: expenses
        .filter(expense => {
          const expenseDate = new Date(expense.date);
          return expenseDate.getMonth() === date.getMonth() && 
                 expenseDate.getFullYear() === date.getFullYear();
        })
        .reduce((sum, expense) => sum + expense.amount, 0)
    };
  });

  // Payment method distribution
  const paymentMethodData = ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Check'].map(method => {
    const methodExpenses = expenses.filter(expense => expense.paymentMethod === method);
    const total = methodExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    return {
      method,
      amount: total,
      count: methodExpenses.length
    };
  }).filter(item => item.amount > 0);

  const COLORS = ['#10B981', '#3B82F6', '#EF4444', '#F59E0B', '#8B5CF6'];

  // Top spending categories
  const topCategories = categoryData
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 5);

  // Over budget alerts
  const overBudgetItems = categoryData.filter(item => item.spent > item.budget);

  return (
    <div className="space-y-6">
      {/* Alerts */}
      {overBudgetItems.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800">⚠️ Budget Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {overBudgetItems.map(item => (
                <div key={item.category} className="flex items-center justify-between">
                  <span className="font-medium">{item.category}</span>
                  <div className="text-right">
                    <div className="text-red-600 font-bold">
                      ${item.spent.toFixed(2)} / ${item.budget.toFixed(2)}
                    </div>
                    <div className="text-sm text-red-500">
                      {((item.spent / item.budget) * 100).toFixed(1)}% over budget
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Expense Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={last6Months}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Amount']} />
                <Line type="monotone" dataKey="amount" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Payment Method Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Method Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentMethodData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ method, amount }) => `${method}: $${amount.toFixed(0)}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {paymentMethodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Amount']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Budget vs Actual */}
      <Card>
        <CardHeader>
          <CardTitle>Budget vs Actual Spending</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, '']} />
              <Bar dataKey="budget" fill="#E5E7EB" name="Budget" />
              <Bar dataKey="spent" fill="#3B82F6" name="Spent" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Spending Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCategories.map((category, index) => (
                <div key={category.category} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <span className="font-medium">{category.category}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">${category.spent.toFixed(2)}</div>
                    <Badge variant={category.utilization > 100 ? "destructive" : "secondary"}>
                      {category.utilization.toFixed(1)}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expense Status Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['Pending', 'Approved', 'Rejected', 'Paid'].map(status => {
                const statusExpenses = expenses.filter(expense => expense.status === status);
                const total = statusExpenses.reduce((sum, expense) => sum + expense.amount, 0);
                const count = statusExpenses.length;
                
                return (
                  <div key={status} className="flex items-center justify-between">
                    <Badge variant="outline">{status}</Badge>
                    <div className="text-right">
                      <div className="font-bold">${total.toFixed(2)}</div>
                      <div className="text-sm text-muted-foreground">{count} expenses</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tax Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Total Tax Paid</span>
                <span className="font-bold">
                  ${expenses.reduce((sum, expense) => sum + expense.taxAmount, 0).toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Tax Deductible</span>
                <span className="font-bold">
                  ${expenses
                    .filter(expense => {
                      const type = expenseTypes.find(t => t.id === expense.typeId);
                      return type?.taxDeductible;
                    })
                    .reduce((sum, expense) => sum + expense.amount, 0)
                    .toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Avg Tax Rate</span>
                <span className="font-bold">
                  {expenses.length > 0 
                    ? ((expenses.reduce((sum, expense) => sum + expense.taxAmount, 0) / 
                        expenses.reduce((sum, expense) => sum + expense.amount, 0)) * 100).toFixed(1)
                    : 0}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
