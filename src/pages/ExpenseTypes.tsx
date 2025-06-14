
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Settings, TrendingUp, AlertTriangle, CheckCircle, DollarSign, Target, BarChart3 } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import ExpenseTypeStats from "@/components/expense-types/ExpenseTypeStats";
import ExpenseTypeForm from "@/components/expense-types/ExpenseTypeForm";
import ExpenseTypeTable from "@/components/expense-types/ExpenseTypeTable";
import ExpenseTypeBudgetAnalysis from "@/components/expense-types/ExpenseTypeBudgetAnalysis";
import ExpenseTypeRulesManager from "@/components/expense-types/ExpenseTypeRulesManager";

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
  approvalThreshold: number;
  autoRecurring: boolean;
  defaultVendors: string[];
  glCode: string;
  costCenter: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  budgetPeriod: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Yearly';
  notificationThreshold: number;
  allowOverBudget: boolean;
  restrictedUsers: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseTypeRule {
  id: string;
  typeId: string;
  name: string;
  condition: string;
  action: string;
  isActive: boolean;
  priority: number;
}

export default function ExpenseTypes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showExpenseTypeForm, setShowExpenseTypeForm] = useState(false);
  const [editingExpenseType, setEditingExpenseType] = useState<ExpenseType | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Mock data for expense types with enhanced properties
  const [expenseTypes, setExpenseTypes] = useState<ExpenseType[]>([
    {
      id: "1",
      name: "Food Supplies",
      description: "Raw ingredients and food items for restaurant operations",
      category: "Food & Beverage",
      budgetLimit: 5000,
      isActive: true,
      color: "#10B981",
      taxDeductible: true,
      requiresApproval: false,
      approvalThreshold: 1000,
      autoRecurring: true,
      defaultVendors: ["Food Distributors Inc", "Fresh Produce Co"],
      glCode: "FOOD-001",
      costCenter: "Kitchen",
      priority: "High",
      budgetPeriod: "Monthly",
      notificationThreshold: 80,
      allowOverBudget: false,
      restrictedUsers: [],
      tags: ["perishable", "essential", "daily"],
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:00:00Z"
    },
    {
      id: "2",
      name: "Staff Salaries",
      description: "Employee wages, benefits, and payroll expenses",
      category: "Labor",
      budgetLimit: 15000,
      isActive: true,
      color: "#3B82F6",
      taxDeductible: true,
      requiresApproval: true,
      approvalThreshold: 500,
      autoRecurring: true,
      defaultVendors: ["Payroll Services", "Benefits Provider"],
      glCode: "LAB-001",
      costCenter: "HR",
      priority: "Critical",
      budgetPeriod: "Monthly",
      notificationThreshold: 90,
      allowOverBudget: false,
      restrictedUsers: ["junior-staff"],
      tags: ["recurring", "critical", "monthly"],
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:00:00Z"
    },
    {
      id: "3",
      name: "Rent & Utilities",
      description: "Property rent, electricity, water, gas, internet",
      category: "Rent & Utilities",
      budgetLimit: 8000,
      isActive: true,
      color: "#EF4444",
      taxDeductible: true,
      requiresApproval: true,
      approvalThreshold: 100,
      autoRecurring: true,
      defaultVendors: ["Property Management", "Electric Company", "Gas Company"],
      glCode: "RENT-001",
      costCenter: "Operations",
      priority: "Critical",
      budgetPeriod: "Monthly",
      notificationThreshold: 95,
      allowOverBudget: false,
      restrictedUsers: [],
      tags: ["fixed", "critical", "monthly"],
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:00:00Z"
    },
    {
      id: "4",
      name: "Marketing & Advertising",
      description: "Digital marketing, print ads, promotional materials",
      category: "Marketing",
      budgetLimit: 2500,
      isActive: true,
      color: "#8B5CF6",
      taxDeductible: true,
      requiresApproval: true,
      approvalThreshold: 300,
      autoRecurring: false,
      defaultVendors: ["Digital Agency", "Print Shop"],
      glCode: "MKT-001",
      costCenter: "Marketing",
      priority: "Medium",
      budgetPeriod: "Monthly",
      notificationThreshold: 75,
      allowOverBudget: true,
      restrictedUsers: [],
      tags: ["variable", "seasonal", "growth"],
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:00:00Z"
    }
  ]);

  const [expenseTypeRules, setExpenseTypeRules] = useState<ExpenseTypeRule[]>([
    {
      id: "1",
      typeId: "1",
      name: "High Amount Alert",
      condition: "amount > 500",
      action: "require_manager_approval",
      isActive: true,
      priority: 1
    },
    {
      id: "2",
      typeId: "2",
      name: "Overtime Alert",
      condition: "amount > budget_limit * 0.9",
      action: "send_notification",
      isActive: true,
      priority: 2
    }
  ]);

  const categories = ['all', 'Food & Beverage', 'Labor', 'Rent & Utilities', 'Marketing', 'Equipment', 'Maintenance', 'Other'];

  const filteredExpenseTypes = expenseTypes.filter(type => {
    const matchesSearch = type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         type.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         type.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         type.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || type.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

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

  const handleDuplicateExpenseType = (expenseType: ExpenseType) => {
    const duplicated: ExpenseType = {
      ...expenseType,
      id: Date.now().toString(),
      name: `${expenseType.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setExpenseTypes(prev => [...prev, duplicated]);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  ⚙️ Expense Types Management
                </h1>
                <p className="text-muted-foreground mt-2">
                  Configure expense categories, budgets, approval workflows, and business rules
                </p>
              </div>
              <SidebarTrigger />
            </div>

            <ExpenseTypeStats expenseTypes={expenseTypes} />

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex gap-4 flex-1">
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search expense types, tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-input rounded-md"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>
              <Button 
                onClick={() => setShowExpenseTypeForm(true)}
                className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Expense Type
              </Button>
            </div>

            <Tabs defaultValue="types" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="types" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Expense Types
                </TabsTrigger>
                <TabsTrigger value="budget-analysis" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Budget Analysis
                </TabsTrigger>
                <TabsTrigger value="rules" className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Business Rules
                </TabsTrigger>
              </TabsList>

              <TabsContent value="types" className="space-y-6">
                <ExpenseTypeTable
                  expenseTypes={filteredExpenseTypes}
                  onEdit={(expenseType) => {
                    setEditingExpenseType(expenseType);
                    setShowExpenseTypeForm(true);
                  }}
                  onDelete={handleDeleteExpenseType}
                  onDuplicate={handleDuplicateExpenseType}
                />
              </TabsContent>

              <TabsContent value="budget-analysis" className="space-y-6">
                <ExpenseTypeBudgetAnalysis expenseTypes={expenseTypes} />
              </TabsContent>

              <TabsContent value="rules" className="space-y-6">
                <ExpenseTypeRulesManager 
                  expenseTypes={expenseTypes}
                  rules={expenseTypeRules}
                  onRulesChange={setExpenseTypeRules}
                />
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
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
