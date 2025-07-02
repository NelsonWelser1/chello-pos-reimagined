
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { PaymentGatewayFormData } from "./PaymentGatewayFormSchema";

interface GatewayBasicFieldsProps {
  form: UseFormReturn<PaymentGatewayFormData>;
}

export function GatewayBasicFields({ form }: GatewayBasicFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Gateway Name</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Main Stripe Gateway" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="provider"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Provider</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="stripe">Stripe</SelectItem>
                <SelectItem value="square">Square</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
                <SelectItem value="authorize_net">Authorize.Net</SelectItem>
                <SelectItem value="braintree">Braintree</SelectItem>
                <SelectItem value="adyen">Adyen</SelectItem>
                <SelectItem value="worldpay">Worldpay</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
