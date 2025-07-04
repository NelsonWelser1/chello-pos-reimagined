
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { paymentMethodSchema, PaymentMethodFormData } from "./forms/PaymentMethodFormSchema";
import { BasicInfoFields } from "./forms/BasicInfoFields";
import { ProviderFields } from "./forms/ProviderFields";
import { FeeFields } from "./forms/FeeFields";
import { LimitFields } from "./forms/LimitFields";
import { IntegrationFields } from "./forms/IntegrationFields";
import { DescriptionField } from "./forms/DescriptionField";
import { SettingsFields } from "./forms/SettingsFields";

interface PaymentMethodFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PaymentMethodFormData) => Promise<void> | void;
  editingMethod?: any;
}

export function PaymentMethodForm({ isOpen, onClose, onSubmit, editingMethod }: PaymentMethodFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<PaymentMethodFormData>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: editingMethod || {
      name: "",
      type: "card",
      processing_fee_percentage: 2.9,
      processing_fee_fixed: 0.30,
      enabled: true,
      requires_verification: false,
      auto_settlement: true,
      currency: "UGX",
    }
  });

  const handleSubmit = async (data: PaymentMethodFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      form.reset();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {editingMethod ? "Edit Payment Method" : "Add Payment Method"}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <BasicInfoFields form={form} />
              <ProviderFields form={form} />
              <FeeFields form={form} />
              <LimitFields form={form} />
              <IntegrationFields form={form} />
              <DescriptionField form={form} />
              <SettingsFields form={form} />

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : (editingMethod ? "Update" : "Add")} Payment Method
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
