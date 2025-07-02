
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { PaymentGatewayFormData } from "./PaymentGatewayFormSchema";

interface GatewayTransactionLimitsProps {
  form: UseFormReturn<PaymentGatewayFormData>;
}

export function GatewayTransactionLimits({ form }: GatewayTransactionLimitsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="min_transaction_amount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Min Transaction Amount ($)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                step="0.01"
                placeholder="0.50"
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
        name="max_transaction_amount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Max Transaction Amount ($)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                step="0.01"
                placeholder="10000.00"
                {...field}
                onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
