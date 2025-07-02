
import { useState } from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { PaymentGatewayFormData } from "./PaymentGatewayFormSchema";

interface GatewayCredentialsFieldsProps {
  form: UseFormReturn<PaymentGatewayFormData>;
}

export function GatewayCredentialsFields({ form }: GatewayCredentialsFieldsProps) {
  const [showApiKey, setShowApiKey] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);

  return (
    <div className="grid grid-cols-1 gap-4">
      <FormField
        control={form.control}
        name="api_key"
        render={({ field }) => (
          <FormItem>
            <FormLabel>API Key</FormLabel>
            <FormControl>
              <div className="relative">
                <Input 
                  type={showApiKey ? "text" : "password"}
                  placeholder="Enter API key"
                  {...field}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="secret_key"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Secret Key</FormLabel>
            <FormControl>
              <div className="relative">
                <Input 
                  type={showSecretKey ? "text" : "password"}
                  placeholder="Enter secret key"
                  {...field}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setShowSecretKey(!showSecretKey)}
                >
                  {showSecretKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="webhook_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Webhook URL (Optional)</FormLabel>
            <FormControl>
              <Input placeholder="https://yoursite.com/webhooks/payment" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

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
    </div>
  );
}
