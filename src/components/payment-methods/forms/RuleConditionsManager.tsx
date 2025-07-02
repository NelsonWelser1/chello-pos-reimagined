
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";

interface Condition {
  field: string;
  operator: "equals" | "not_equals" | "greater_than" | "less_than" | "contains" | "not_contains";
  value: string;
}

interface RuleConditionsManagerProps {
  conditions: Condition[];
  setConditions: (conditions: Condition[]) => void;
}

export function RuleConditionsManager({ conditions, setConditions }: RuleConditionsManagerProps) {
  const addCondition = () => {
    const newCondition = { field: "", operator: "equals" as const, value: "" };
    setConditions([...conditions, newCondition]);
  };

  const removeCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  const updateCondition = (index: number, field: keyof Condition, value: string) => {
    const newConditions = [...conditions];
    (newConditions[index] as any)[field] = value;
    setConditions(newConditions);
  };

  return (
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
                  onChange={(e) => updateCondition(index, "field", e.target.value)}
                />
              </div>
              <div>
                <Label>Operator</Label>
                <Select 
                  value={condition.operator}
                  onValueChange={(value) => updateCondition(index, "operator", value)}
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
                  onChange={(e) => updateCondition(index, "value", e.target.value)}
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
  );
}
