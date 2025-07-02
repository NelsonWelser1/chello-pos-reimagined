
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { PaymentMethodFormData } from "./PaymentMethodFormSchema";

interface FeeFieldsProps {
  form: UseFormReturn<PaymentMethodFormData>;
}

export function FeeFields({ form }: FeeFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="processing_fee_percentage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Processing Fee (%)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                step="0.01" 
                {...field}
                onChange={e => field.onChange(parseFloat(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="processing_fee_fixed"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Fixed Fee ($)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                step="0.01" 
                {...field}
                onChange={e => field.onChange(parseFloat(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
