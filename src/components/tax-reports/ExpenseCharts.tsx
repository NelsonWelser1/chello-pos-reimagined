
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, LineChart, Line, ScatterChart, Scatter } from "recharts";
import { CategoryBreakdown, MonthlyTrend, WeeklyTrend, ExpenseForecasting, COLORS } from "./ExpenseReportTypes";

interface ExpenseChartsProps {
  activeChart: string;
  filteredData: CategoryBreakdown[];
  trendsData: MonthlyTrend[] | WeeklyTrend[];
  selectedTimeframe: string;
  efficiencyData: { category: string; efficiency: number; amount: number; }[];
  expenseForecasting: ExpenseForecasting[];
}

export default function ExpenseCharts({
  activeChart,
  filteredData,
  trendsData,
  selectedTimeframe,
  efficiencyData,
  expenseForecasting
}: ExpenseChartsProps) {
  if (activeChart === "overview") {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-4 text-slate-800">Category Distribution</h3>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={filteredData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ category, percentage }) => `${category.split(' ')[0]}: ${percentage}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="amount"
              >
                {filteredData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Amount']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4 text-slate-800">Budget vs Actual</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, '']} />
              <Bar dataKey="budget" fill="#E5E7EB" name="Budget" />
              <Bar dataKey="amount" fill="#3B82F6" name="Actual" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  if (activeChart === "trends") {
    return (
      <div>
        <h3 className="text-lg font-semibold mb-4 text-slate-800">{selectedTimeframe === "weekly" ? "Weekly" : "Monthly"} Expense Trends</h3>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={trendsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={selectedTimeframe === "weekly" ? "week" : "month"} />
            <YAxis />
            <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, '']} />
            <Area type="monotone" dataKey={selectedTimeframe === "weekly" ? "target" : "budget"} stackId="1" stroke="#E5E7EB" fill="#E5E7EB" name="Target/Budget" />
            <Area type="monotone" dataKey={selectedTimeframe === "weekly" ? "expenses" : "amount"} stackId="2" stroke="#3B82F6" fill="#3B82F6" name="Actual" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (activeChart === "efficiency") {
    return (
      <div>
        <h3 className="text-lg font-semibold mb-4 text-slate-800">Category Efficiency Analysis</h3>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart data={efficiencyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="efficiency" name="Efficiency %" />
            <YAxis dataKey="amount" name="Amount ($)" />
            <Tooltip formatter={(value, name) => [
              name === "efficiency" ? `${value}%` : `$${Number(value).toLocaleString()}`,
              name === "efficiency" ? "Efficiency" : "Amount"
            ]} />
            <Scatter dataKey="amount" fill="#3B82F6" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (activeChart === "forecasting") {
    return (
      <div>
        <h3 className="text-lg font-semibold mb-4 text-slate-800">AI-Powered Expense Forecasting</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={expenseForecasting}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value, name) => [
              name === "confidence" ? `${value}%` : `$${Number(value).toLocaleString()}`,
              name === "confidence" ? "Confidence" : "Predicted Amount"
            ]} />
            <Line type="monotone" dataKey="predicted" stroke="#3B82F6" strokeWidth={3} name="Predicted Expenses" />
            <Line type="monotone" dataKey="confidence" stroke="#10B981" strokeDasharray="5 5" name="Confidence %" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return null;
}
