
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Receipt, CreditCard, TrendingUp, DollarSign, Calendar, FileText } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import ExpenseStats from "@/components/expenses/ExpenseStats";
import ExpenseTypeForm from "@/components/expenses/ExpenseTypeForm";
import ExpenseTypeTable from "@/components/expenses/ExpenseTypeTable";
import ExpenseForm from "@/components/expenses/ExpenseForm";
import ExpenseTable from "@/components/expenses/ExpenseTable";
import ExpenseReports from "@/components/expenses/ExpenseReports";

export interface ExpenseType {
  id: string;
  name: string;
  description: string;
  category: 'Food & Beverage' | 'Labor' | 'Rent & Utilities' | 'Marketing' | 'Equipment' | 'Maintenance' | 'Other';
  budgetLimit: number;
  isActive: boolean;
  color: string;
  taxDeductible: boolean;
  requiresApproval: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  id: string;
  typeId: string;
  typeName: string;
  amount: number;
  description: string;
  date: string;
  vendor: string;
  receiptNumber: string;
  paymentMethod: 'Cash' | 'Credit Card' | 'Debit Card' | 'Bank Transfer' | 'Check';
  status: 'Pending' | 'Approved' | 'Rejected' | 'Paid';
  approvedBy?: string;
  approvedAt?: string;
  category: string;
  taxAmount: number;
  isRecurring: boolean;
  recurringPeriod?: 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';
  notes: string;
  attachments: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export default function Expenses() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showExpenseTypeForm, setShowExpenseTypeForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [editingExpenseType, setEditingExpenseType] = useState<ExpenseType | null>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  // Mock data for expense types
  const [expenseTypes, setExpenseTypes] = useState<ExpenseType[]>([
    {
      id: "1",
      name: "Food Supplies",
      description: "Raw ingredients and food items",
      category: "Food & Beverage",
      budgetLimit: 5000,
      isActive: true,
      color: "#10B981",
      taxDeductible: true,
      requiresApproval: false,
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:00:00Z"
    },
    {
      id: "2",
      name: "Staff Salaries",
      description: "Employee wages and benefits",
      category: "Labor",
      budgetLimit: 15000,
      isActive: true,
      color: "#3B82F6",
      taxDeductible: true,
      requiresApproval: true,
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:00:00Z"
    },
    {
      id: "3",
      name: "Rent",
      description: "Monthly rent payment",
      category: "Rent & Utilities",
      budgetLimit: 8000,
      isActive: true,
      color: "#EF4444",
      taxDeductible: true,
      requiresApproval: true,
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:00:00Z"
    }
  ]);

  // Mock data for expenses
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: "1",
      typeId: "1",
      typeName: "Food Supplies",
      amount: 1250.00,
      description: "Weekly grocery delivery",
      date: "2024-06-14",
      vendor: "Food Distributors Inc",
      receiptNumber: "REC-001",
      paymentMethod: "Credit Card",
      status: "Approved",
      approvedBy: "Manager",
      approvedAt: "2024-06-14T10:00:00Z",
      category: "Food & Beverage",
      taxAmount: 125.00,
      isRecurring: true,
      recurringPeriod: "Weekly",
      notes: "Regular supplier delivery",
      attachments: [],
      createdBy: "Chef John",
      createdAt: "2024-06-14T09:00:00Z",
      updatedAt: "2024-06-14T10:00:00Z"
    },
    {
      id: "2",
      typeId: "2",
      typeName: "Staff Salaries",
      amount: 12000.00,
      description: "Monthly staff payroll",
      date: "2024-06-01",
      vendor: "Payroll Services",
      receiptNumber: "PAY-001",
      paymentMethod: "Bank Transfer",
      status: "Paid",
      approvedBy: "Owner",
      approvedAt: "2024-06-01T10:00:00Z",
      category: "Labor",
      taxAmount: 0,
      isRecurring: true,
      recurringPeriod: "Monthly",
      notes: "Regular monthly payroll",
      attachments: [],
      createdBy: "HR Manager",
      createdAt: "2024-06-01T09:00:00Z",
      updatedAt: "2024-06-01T10:00:00Z"
    }
  ]);

  const handleAddExpenseType = (expenseType: Omit<ExpenseType, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newExpenseType: ExpenseType = {
      ...expenseType,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setExpenseTypes(prev => [...prev, newExpenseType]);
    setShowExpenseTypeForm(false);
  };

  const handleEditExpenseType = (expenseType: ExpenseType) => {
    setExpenseTypes(prev => prev.map(et => 
      et.id === expenseType.id 
        ? { ...expenseType, updatedAt: new Date().toISOString() }
        : et
    ));
    setEditingExpenseType(null);
    setShowExpenseTypeForm(false);
  };

  const handleDeleteExpenseType = (id: string) => {
    setExpenseTypes(prev => prev.filter(et => et.id !== id));
  };

  const handleAddExpense = (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setExpenses(prev => [...prev, newExpense]);
    setShowExpenseForm(false);
  };

  const handleEditExpense = (expense: Expense) => {
    setExpenses(prev => prev.map(e => 
      e.id === expense.id 
        ? { ...expense, updatedAt: new Date().toISOString() }
        : e
    ));
    setEditingExpense(null);
    setShowExpenseForm(false);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                  💰 Expense Management
                </h1>
                <p className="text-muted-foreground mt-2">
                  Track and manage all your restaurant expenses and budgets
                </p>
              </div>
              <SidebarTrigger />
            </div>

            <ExpenseStats expenses={expenses} expenseTypes={expenseTypes} />

            <Tabs defaultValue="expenses" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="expenses" className="flex items-center gap-2">
                  <Receipt className="w-4 h-4" />
                  Expenses
                </TabsTrigger>
                <TabsTrigger value="expense-types" className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Expense Types
                </TabsTrigger>
                <TabsTrigger value="reports" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Reports
                </TabsTrigger>
              </TabsList>

              <TabsContent value="expenses" className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search expenses..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button 
                    onClick={() => setShowExpenseForm(true)}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Expense
                  </Button>
                </div>

                <ExpenseTable
                  expenses={expenses.filter(expense =>
                    expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    expense.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    expense.typeName.toLowerCase().includes(searchTerm.toLowerCase())
                  )}
                  onEdit={(expense) => {
                    setEditingExpense(expense);
                    setShowExpenseForm(true);
                  }}
                  onDelete={handleDeleteExpense}
                />
              </TabsContent>

              <TabsContent value="expense-types" className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search expense types..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button 
                    onClick={() => setShowExpenseTypeForm(true)}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Expense Type
                  </Button>
                </div>

                <ExpenseTypeTable
                  expenseTypes={expenseTypes.filter(type =>
                    type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    type.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    type.category.toLowerCase().includes(searchTerm.toLowerCase())
                  )}
                  onEdit={(expenseType) => {
                    setEditingExpenseType(expenseType);
                    setShowExpenseTypeForm(true);
                  }}
                  onDelete={handleDeleteExpenseType}
                />
              </TabsContent>

              <TabsContent value="reports" className="space-y-6">
                <ExpenseReports expenses={expenses} expenseTypes={expenseTypes} />
              </TabsContent>
            </Tabs>

            {showExpenseTypeForm && (
              <ExpenseTypeForm
                expenseType={editingExpenseType}
                onSubmit={editingExpenseType ? handleEditExpenseType : handleAddExpenseType}
                onCancel={() => {
                  setShowExpenseTypeForm(false);
                  setEditingExpenseType(null);
                }}
              />
            )}

            {showExpenseForm && (
              <ExpenseForm
                expense={editingExpense}
                expenseTypes={expenseTypes}
                onSubmit={editingExpense ? handleEditExpense : handleAddExpense}
                onCancel={() => {
                  setShowExpenseForm(false);
                  setEditingExpense(null);
                }}
              />
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
