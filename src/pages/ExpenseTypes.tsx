import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Settings, BarChart3, Target } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import ExpenseTypeStats from "@/components/expense-types/ExpenseTypeStats";
import ExpenseTypeForm from "@/components/expense-types/ExpenseTypeForm";
import ExpenseTypeTable from "@/components/expense-types/ExpenseTypeTable";
import ExpenseTypeBudgetAnalysis from "@/components/expense-types/ExpenseTypeBudgetAnalysis";
import ExpenseTypeRulesManager from "@/components/expense-types/ExpenseTypeRulesManager";
import { useExpenseTypes, ExpenseType, NewExpenseType, ExpenseTypeRule } from "@/hooks/useExpenseTypes";
import { Skeleton } from "@/components/ui/skeleton";

export default function ExpenseTypes() {
  const {
    expenseTypes,
    loading,
    addExpenseType,
    updateExpenseType,
    deleteExpenseType,
  } = useExpenseTypes();

  const [searchTerm, setSearchTerm] = useState("");
  const [showExpenseTypeForm, setShowExpenseTypeForm] = useState(false);
  const [editingExpenseType, setEditingExpenseType] = useState<ExpenseType | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Mock data for rules remains for now
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
    const searchContent = `${type.name} ${type.description} ${type.category} ${type.tags?.join(' ')}`.toLowerCase();
    const matchesSearch = searchContent.includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || type.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSaveExpenseType = async (formData: NewExpenseType) => {
    if (editingExpenseType) {
      await updateExpenseType(editingExpenseType.id, formData);
    } else {
      await addExpenseType(formData);
    }
    setEditingExpenseType(null);
    setShowExpenseTypeForm(false);
  };

  const handleDeleteExpenseType = async (id: string) => {
    await deleteExpenseType(id);
  };

  const handleDuplicateExpenseType = async (expenseType: ExpenseType) => {
    const { id, createdAt, updatedAt, name, ...rest } = expenseType;
    const duplicatedData: NewExpenseType = {
      ...rest,
      name: `${name} (Copy)`,
    };
    await addExpenseType(duplicatedData);
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
                {loading ? (
                  <Card>
                    <CardContent className="p-6">
                      <Skeleton className="h-40 w-full" />
                    </CardContent>
                  </Card>
                ) : (
                  <ExpenseTypeTable
                    expenseTypes={filteredExpenseTypes}
                    onEdit={(expenseType) => {
                      setEditingExpenseType(expenseType);
                      setShowExpenseTypeForm(true);
                    }}
                    onDelete={handleDeleteExpenseType}
                    onDuplicate={handleDuplicateExpenseType}
                  />
                )}
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
                onSubmit={handleSaveExpenseType}
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
