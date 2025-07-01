
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Shield, X, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

const ruleSchema = z.object({
  name: z.string().min(1, "Rule name is required"),
  rule_type: z.enum(["fraud_detection", "amount_limit", "geographic", "time_based", "velocity", "blacklist"]),
  enabled: z.boolean().default(true),
  priority: z.number().min(1).max(100).default(50),
  conditions: z.array(z.object({
    field: z.string(),
    operator: z.enum(["equals", "not_equals", "greater_than", "less_than", "contains", "not_contains"]),
    value: z.string(),
  })).default([]),
  actions: z.array(z.object({
    action_type: z.enum(["block", "flag", "require_verification", "apply_fee", "route_to_gateway"]),
    parameters: z.record(z.string()).optional(),
  })).default([]),
  description: z.string().optional(),
  applies_to_methods: z.array(z.string()).default([]),
  max_amount: z.number().min(0).optional(),
  min_amount: z.number().min(0).optional(),
  allowed_countries: z.array(z.string()).default([]),
  blocked_countries: z.array(z.string()).default([]),
  time_restrictions: z.object({
    start_time: z.string().optional(),
    end_time: z.string().optional(),
    days_of_week: z.array(z.string()).default([]),
  }).optional(),
});

type PaymentRuleFormData = z.infer<typeof ruleSchema>;

interface PaymentRulesFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PaymentRuleFormData) => void;
  editingRule?: any;
}

export function PaymentRulesForm({ isOpen, onClose, onSubmit, editingRule }: PaymentRulesFormProps) {
  const form = useForm<PaymentRuleFormData>({
    resolver: zodResolver(ruleSchema),
    defaultValues: editingRule || {
      name: "",
      rule_type: "fraud_detection",
      enabled: true,
      priority: 50,
      conditions: [],
      actions: [],
      applies_to_methods: [],
      allowed_countries: [],
      blocked_countries: [],
    }
  });

  const [conditions, setConditions] = useState(editingRule?.conditions || []);
  const [actions, setActions] = useState(editingRule?.actions || []);

  const addCondition = () => {
    const newCondition = { field: "", operator: "equals" as const, value: "" };
    setConditions([...conditions, newCondition]);
  };

  const removeCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  const addAction = () => {
    const newAction = { action_type: "flag" as const, parameters: {} };
    setActions([...actions, newAction]);
  };

  const removeAction = (index: number) => {
    setActions(actions.filter((_, i) => i !== index));
  };

  const handleSubmit = (data: PaymentRuleFormData) => {
    const submissionData = {
      ...data,
      conditions,
      actions,
    };
    onSubmit(submissionData);
    form.reset();
    onClose();
    toast.success("Payment rule saved successfully!");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            {editingRule ? "Edit Payment Rule" : "Add Payment Rule"}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rule Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., High Amount Verification" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rule_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rule Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select rule type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="fraud_detection">Fraud Detection</SelectItem>
                          <SelectItem value="amount_limit">Amount Limit</SelectItem>
                          <SelectItem value="geographic">Geographic</SelectItem>
                          <SelectItem value="time_based">Time Based</SelectItem>
                          <SelectItem value="velocity">Velocity Check</SelectItem>
                          <SelectItem value="blacklist">Blacklist</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority (1-100)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="1" 
                          max="100"
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="min_amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Min Amount ($)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="max_amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Amount ($)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01"
                          placeholder="No limit"
                          {...field}
                          onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe when this rule should be applied"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Conditions Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold">Conditions</h4>
                  <Button type="button" variant="outline" size="sm" onClick={addCondition}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Condition
                  </Button>
                </div>
                
                {conditions.map((condition, index) => (
                  <Card key={index}>
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div>
                          <Label>Field</Label>
                          <Input 
                            placeholder="e.g., amount, country, email"
                            value={condition.field}
                            onChange={(e) => {
                              const newConditions = [...conditions];
                              newConditions[index].field = e.target.value;
                              setConditions(newConditions);
                            }}
                          />
                        </div>
                        <div>
                          <Label>Operator</Label>
                          <Select 
                            value={condition.operator}
                            onValueChange={(value) => {
                              const newConditions = [...conditions];
                              newConditions[index].operator = value as any;
                              setConditions(newConditions);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="equals">Equals</SelectItem>
                              <SelectItem value="not_equals">Not Equals</SelectItem>
                              <SelectItem value="greater_than">Greater Than</SelectItem>
                              <SelectItem value="less_than">Less Than</SelectItem>
                              <SelectItem value="contains">Contains</SelectItem>
                              <SelectItem value="not_contains">Not Contains</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Value</Label>
                          <Input 
                            placeholder="Condition value"
                            value={condition.value}
                            onChange={(e) => {
                              const newConditions = [...conditions];
                              newConditions[index].value = e.target.value;
                              setConditions(newConditions);
                            }}
                          />
                        </div>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => removeCondition(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Actions Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold">Actions</h4>
                  <Button type="button" variant="outline" size="sm" onClick={addAction}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Action
                  </Button>
                </div>
                
                {actions.map((action, index) => (
                  <Card key={index}>
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div className="md:col-span-2">
                          <Label>Action Type</Label>
                          <Select 
                            value={action.action_type}
                            onValueChange={(value) => {
                              const newActions = [...actions];
                              newActions[index].action_type = value as any;
                              setActions(newActions);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="block">Block Transaction</SelectItem>
                              <SelectItem value="flag">Flag for Review</SelectItem>
                              <SelectItem value="require_verification">Require Verification</SelectItem>
                              <SelectItem value="apply_fee">Apply Additional Fee</SelectItem>
                              <SelectItem value="route_to_gateway">Route to Specific Gateway</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => removeAction(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <FormField
                control={form.control}
                name="enabled"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <FormLabel>Enable Rule</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  {editingRule ? "Update" : "Create"} Rule
                </Button>
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
