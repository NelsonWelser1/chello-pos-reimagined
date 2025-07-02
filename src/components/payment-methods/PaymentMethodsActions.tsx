
import { Button } from "@/components/ui/button";
import { Plus, Shield, Zap } from "lucide-react";

interface PaymentMethodsActionsProps {
  onShowRulesForm: () => void;
  onShowGatewayForm: () => void;
  onShowMethodForm: () => void;
}

export function PaymentMethodsActions({
  onShowRulesForm,
  onShowGatewayForm,
  onShowMethodForm
}: PaymentMethodsActionsProps) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-gray-900">Payment Methods Management</h2>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={onShowRulesForm}
          className="flex items-center gap-2"
        >
          <Shield className="w-4 h-4" />
          Payment Rules
        </Button>
        <Button 
          variant="outline" 
          onClick={onShowGatewayForm}
          className="flex items-center gap-2"
        >
          <Zap className="w-4 h-4" />
          Add Gateway
        </Button>
        <Button 
          onClick={onShowMethodForm} 
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Method
        </Button>
      </div>
    </div>
  );
}
