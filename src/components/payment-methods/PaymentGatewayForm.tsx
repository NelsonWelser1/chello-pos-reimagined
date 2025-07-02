
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Settings, X } from "lucide-react";
import { toast } from "sonner";
import { gatewaySchema, PaymentGatewayFormData } from "./forms/PaymentGatewayFormSchema";
import { GatewayBasicFields } from "./forms/GatewayBasicFields";
import { GatewayEnvironmentFields } from "./forms/GatewayEnvironmentFields";
import { GatewayCredentialsFields } from "./forms/GatewayCredentialsFields";
import { GatewayTransactionLimits } from "./forms/GatewayTransactionLimits";
import { GatewaySettingsFields } from "./forms/GatewaySettingsFields";

interface PaymentGatewayFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PaymentGatewayFormData) => void;
  editingGateway?: any;
}

export function PaymentGatewayForm({ isOpen, onClose, onSubmit, editingGateway }: PaymentGatewayFormProps) {
  const form = useForm<PaymentGatewayFormData>({
    resolver: zodResolver(gatewaySchema),
    defaultValues: editingGateway || {
      name: "",
      provider: "stripe",
      environment: "sandbox",
      api_key: "",
      secret_key: "",
      enabled: true,
      priority: 1,
      supported_currencies: ["USD"],
    }
  });

  const handleSubmit = (data: PaymentGatewayFormData) => {
    onSubmit(data);
    form.reset();
    onClose();
    toast.success("Payment gateway configured successfully!");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            {editingGateway ? "Edit Payment Gateway" : "Add Payment Gateway"}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <GatewayBasicFields form={form} />
              <GatewayEnvironmentFields form={form} />
              <GatewayCredentialsFields form={form} />
              <GatewayTransactionLimits form={form} />
              <GatewaySettingsFields form={form} />

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  {editingGateway ? "Update" : "Add"} Gateway
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
