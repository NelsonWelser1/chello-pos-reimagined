
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";

interface Action {
  action_type: "block" | "flag" | "require_verification" | "apply_fee" | "route_to_gateway";
  parameters?: Record<string, string>;
}

interface RuleActionsManagerProps {
  actions: Action[];
  setActions: (actions: Action[]) => void;
}

export function RuleActionsManager({ actions, setActions }: RuleActionsManagerProps) {
  const addAction = () => {
    const newAction = { action_type: "flag" as const, parameters: {} };
    setActions([...actions, newAction]);
  };

  const removeAction = (index: number) => {
    setActions(actions.filter((_, i) => i !== index));
  };

  const updateAction = (index: number, action_type: Action["action_type"]) => {
    const newActions = [...actions];
    newActions[index].action_type = action_type;
    setActions(newActions);
  };

  return (
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
                  onValueChange={(value) => updateAction(index, value as Action["action_type"])}
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
  );
}
