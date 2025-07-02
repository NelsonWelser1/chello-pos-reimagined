
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { PaymentMethodFormData } from "./PaymentMethodFormSchema";

interface SettingsFieldsProps {
  form: UseFormReturn<PaymentMethodFormData>;
}

export function SettingsFields({ form }: SettingsFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <FormField
        control={form.control}
        name="enabled"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between">
            <FormLabel>Enabled</FormLabel>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="requires_verification"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between">
            <FormLabel>Requires Verification</FormLabel>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="auto_settlement"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between">
            <FormLabel>Auto Settlement</FormLabel>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}
