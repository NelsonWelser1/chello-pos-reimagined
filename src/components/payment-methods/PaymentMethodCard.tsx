
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Settings,
  Trash2,
  CheckCircle,
  XCircle
} from "lucide-react";

interface PaymentMethod {
  id: string;
  name: string;
  type: string;
  icon: any;
  enabled: boolean;
  processingFee: string;
  dailyLimit: string;
  status: string;
  transactions: number;
  revenue: string;
}

interface PaymentMethodCardProps {
  method: PaymentMethod;
  onToggle: (id: string) => void;
  onEdit: (method: PaymentMethod) => void;
}

export function PaymentMethodCard({ method, onToggle, onEdit }: PaymentMethodCardProps) {
  return (
    <Card className="relative">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${method.enabled ? 'bg-blue-100' : 'bg-gray-100'}`}>
              <method.icon className={`w-6 h-6 ${method.enabled ? 'text-blue-600' : 'text-gray-400'}`} />
            </div>
            <div>
              <CardTitle className="text-lg">{method.name}</CardTitle>
              <Badge 
                variant={method.status === "active" ? "default" : "secondary"}
                className={method.status === "active" ? "bg-green-500" : "bg-gray-500"}
              >
                {method.status === "active" ? (
                  <CheckCircle className="w-3 h-3 mr-1" />
                ) : (
                  <XCircle className="w-3 h-3 mr-1" />
                )}
                {method.status}
              </Badge>
            </div>
          </div>
          <Switch
            checked={method.enabled}
            onCheckedChange={() => onToggle(method.id)}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Processing Fee</span>
            <p className="font-semibold">{method.processingFee}</p>
          </div>
          <div>
            <span className="text-gray-500">Daily Limit</span>
            <p className="font-semibold">{method.dailyLimit}</p>
          </div>
          <div>
            <span className="text-gray-500">Transactions</span>
            <p className="font-semibold">{method.transactions}</p>
          </div>
          <div>
            <span className="text-gray-500">Revenue</span>
            <p className="font-semibold text-green-600">{method.revenue}</p>
          </div>
        </div>
        
        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onEdit(method)}
          >
            <Settings className="w-4 h-4 mr-1" />
            Configure
          </Button>
          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
