
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { PaymentMethodFormData } from "./PaymentMethodFormSchema";

interface IntegrationFieldsProps {
  form: UseFormReturn<PaymentMethodFormData>;
}

export function IntegrationFields({ form }: IntegrationFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="merchant_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Merchant ID (Optional)</FormLabel>
            <FormControl>
              <Input placeholder="Merchant identifier" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="terminal_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Terminal ID (Optional)</FormLabel>
            <FormControl>
              <Input placeholder="Terminal identifier" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
