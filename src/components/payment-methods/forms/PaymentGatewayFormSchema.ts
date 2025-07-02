
import * as z from "zod";

export const gatewaySchema = z.object({
  name: z.string().min(1, "Gateway name is required"),
  provider: z.enum(["stripe", "square", "paypal", "authorize_net", "braintree", "adyen", "worldpay"]),
  environment: z.enum(["sandbox", "production"]),
  api_key: z.string().min(1, "API key is required"),
  secret_key: z.string().min(1, "Secret key is required"),
  webhook_url: z.string().url().optional(),
  webhook_secret: z.string().optional(),
  merchant_id: z.string().optional(),
  public_key: z.string().optional(),
  enabled: z.boolean().default(true),
  priority: z.number().min(1).max(10).default(1),
  supported_currencies: z.array(z.string()).default(["USD"]),
  max_transaction_amount: z.number().min(0).optional(),
  min_transaction_amount: z.number().min(0).optional(),
  description: z.string().optional(),
});

export type PaymentGatewayFormData = z.infer<typeof gatewaySchema>;
