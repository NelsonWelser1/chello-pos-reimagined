
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { PaymentMethodFormData } from "./PaymentMethodFormSchema";

interface LimitFieldsProps {
  form: UseFormReturn<PaymentMethodFormData>;
}

export function LimitFields({ form }: LimitFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="daily_limit"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Daily Limit (UGX)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="No limit"
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
        name="monthly_limit"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Monthly Limit (UGX)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="No limit"
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
