
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Edit, AlertCircle, Pause, Play } from "lucide-react";
import type { ExpenseType, ExpenseTypeRule } from "@/hooks/useExpenseTypes";
import { Badge } from "@/components/ui/badge";

interface ExpenseTypeRulesManagerProps {
  expenseTypes: ExpenseType[];
  rules: ExpenseTypeRule[];
  onRulesChange: (rules: ExpenseTypeRule[]) => void;
}

export default function ExpenseTypeRulesManager({ expenseTypes, rules, onRulesChange }: ExpenseTypeRulesManagerProps) {
  const [showRuleForm, setShowRuleForm] = useState(false);
  const [editingRule, setEditingRule] = useState<ExpenseTypeRule | null>(null);
  const [selectedTypeId, setSelectedTypeId] = useState<string>('');

  const [ruleFormData, setRuleFormData] = useState({
    name: '',
    condition: '',
    action: '',
    typeId: '',
    priority: 1
  });

  const conditionTemplates = [
    { label: "Amount exceeds threshold", value: "amount > {threshold}" },
    { label: "Amount exceeds budget percentage", value: "amount > budget_limit * {percentage}" },
    { label: "Multiple expenses in period", value: "count_in_period > {count}" },
    { label: "Vendor not in approved list", value: "vendor not in approved_vendors" },
    { label: "Missing receipt", value: "receipt_number is empty" },
    { label: "Weekend expense", value: "day_of_week in [6, 7]" },
    { label: "After hours expense", value: "hour > 18 or hour < 6" }
  ];

  const actionTemplates = [
    { label: "Require manager approval", value: "require_manager_approval" },
    { label: "Send notification", value: "send_notification" },
    { label: "Auto reject", value: "auto_reject" },
    { label: "Flag for review", value: "flag_for_review" },
    { label: "Request additional documentation", value: "request_documentation" },
    { label: "Apply markup", value: "apply_markup" },
    { label: "Log audit trail", value: "log_audit_trail" }
  ];

  const handleAddRule = () => {
    const newRule: ExpenseTypeRule = {
      id: Date.now().toString(),
      typeId: ruleFormData.typeId,
      name: ruleFormData.name,
      condition: ruleFormData.condition,
      action: ruleFormData.action,
      isActive: true,
      priority: ruleFormData.priority
    };
    onRulesChange([...rules, newRule]);
    resetForm();
  };

  const handleEditRule = () => {
    if (!editingRule) return;
    
    const updatedRules = rules.map(rule => 
      rule.id === editingRule.id 
        ? { ...rule, ...ruleFormData }
        : rule
    );
    onRulesChange(updatedRules);
    resetForm();
  };

  const handleDeleteRule = (id: string) => {
    onRulesChange(rules.filter(rule => rule.id !== id));
  };

  const handleToggleRule = (id: string) => {
    const updatedRules = rules.map(rule => 
      rule.id === id 
        ? { ...rule, isActive: !rule.isActive }
        : rule
    );
    onRulesChange(updatedRules);
  };

  const resetForm = () => {
    setRuleFormData({
      name: '',
      condition: '',
      action: '',
      typeId: '',
      priority: 1
    });
    setShowRuleForm(false);
    setEditingRule(null);
  };

  const startEdit = (rule: ExpenseTypeRule) => {
    setEditingRule(rule);
    setRuleFormData({
      name: rule.name,
      condition: rule.condition,
      action: rule.action,
      typeId: rule.typeId,
      priority: rule.priority
    });
    setShowRuleForm(true);
  };

  const filteredRules = selectedTypeId 
    ? rules.filter(rule => rule.typeId === selectedTypeId)
    : rules;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Business Rules</h3>
          <p className="text-sm text-muted-foreground">
            Automate approval workflows and compliance checks
          </p>
        </div>
        <Button onClick={() => setShowRuleForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Rule
        </Button>
      </div>

      <div className="flex gap-4">
        <Select value={selectedTypeId} onValueChange={setSelectedTypeId}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Filter by expense type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Types</SelectItem>
            {expenseTypes.map(type => (
              <SelectItem key={type.id} value={type.id}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {showRuleForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingRule ? 'Edit Rule' : 'Add New Rule'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Rule Name</Label>
                <Input
                  value={ruleFormData.name}
                  onChange={(e) => setRuleFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="High amount approval rule"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Expense Type</Label>
                <Select 
                  value={ruleFormData.typeId} 
                  onValueChange={(value) => setRuleFormData(prev => ({ ...prev, typeId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select expense type" />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseTypes.map(type => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Condition</Label>
              <Select 
                value={ruleFormData.condition} 
                onValueChange={(value) => setRuleFormData(prev => ({ ...prev, condition: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select condition template" />
                </SelectTrigger>
                <SelectContent>
                  {conditionTemplates.map(template => (
                    <SelectItem key={template.value} value={template.value}>
                      {template.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                value={ruleFormData.condition}
                onChange={(e) => setRuleFormData(prev => ({ ...prev, condition: e.target.value }))}
                placeholder="Custom condition or modify template"
              />
            </div>

            <div className="space-y-2">
              <Label>Action</Label>
              <Select 
                value={ruleFormData.action} 
                onValueChange={(value) => setRuleFormData(prev => ({ ...prev, action: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select action template" />
                </SelectTrigger>
                <SelectContent>
                  {actionTemplates.map(template => (
                    <SelectItem key={template.value} value={template.value}>
                      {template.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                value={ruleFormData.action}
                onChange={(e) => setRuleFormData(prev => ({ ...prev, action: e.target.value }))}
                placeholder="Custom action or modify template"
              />
            </div>

            <div className="space-y-2">
              <Label>Priority (1 = highest)</Label>
              <Input
                type="number"
                min="1"
                max="10"
                value={ruleFormData.priority}
                onChange={(e) => setRuleFormData(prev => ({ ...prev, priority: parseInt(e.target.value) || 1 }))}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={editingRule ? handleEditRule : handleAddRule}>
                {editingRule ? 'Update Rule' : 'Add Rule'}
              </Button>
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {filteredRules.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">No rules found</h3>
              <p className="text-muted-foreground text-center">
                {selectedTypeId ? 'No rules configured for this expense type.' : 'No business rules configured yet.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredRules
            .sort((a, b) => a.priority - b.priority)
            .map((rule) => {
              const expenseType = expenseTypes.find(type => type.id === rule.typeId);
              
              return (
                <Card key={rule.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium">{rule.name}</h4>
                          <Badge variant="outline">Priority {rule.priority}</Badge>
                          {expenseType && (
                            <Badge variant="secondary">{expenseType.name}</Badge>
                          )}
                          <Badge variant={rule.isActive ? "default" : "secondary"}>
                            {rule.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Condition:</p>
                            <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                              {rule.condition}
                            </code>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Action:</p>
                            <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                              {rule.action}
                            </code>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleRule(rule.id)}
                        >
                          {rule.isActive ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => startEdit(rule)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteRule(rule.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
        )}
      </div>
    </div>
  );
}
