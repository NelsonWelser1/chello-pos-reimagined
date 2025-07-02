
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Shield, X } from "lucide-react";
import { toast } from "sonner";
import { ruleSchema, PaymentRuleFormData } from "./forms/PaymentRulesFormSchema";
import { RuleBasicFields } from "./forms/RuleBasicFields";
import { RuleConditionsManager } from "./forms/RuleConditionsManager";
import { RuleActionsManager } from "./forms/RuleActionsManager";

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
              <RuleBasicFields form={form} />

              <RuleConditionsManager 
                conditions={conditions} 
                setConditions={setConditions} 
              />

              <RuleActionsManager 
                actions={actions} 
                setActions={setActions} 
              />

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
