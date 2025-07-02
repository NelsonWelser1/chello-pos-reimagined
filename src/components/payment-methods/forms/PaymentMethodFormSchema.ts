
import * as z from "zod";

export const paymentMethodSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["card", "mobile", "cash", "gift", "bank_transfer", "crypto"]),
  provider: z.string().optional(),
  processing_fee_percentage: z.number().min(0).max(100),
  processing_fee_fixed: z.number().min(0),
  daily_limit: z.number().min(0).optional(),
  monthly_limit: z.number().min(0).optional(),
  enabled: z.boolean().default(true),
  requires_verification: z.boolean().default(false),
  auto_settlement: z.boolean().default(true),
  currency: z.string().default("USD"),
  description: z.string().optional(),
  api_key: z.string().optional(),
  webhook_url: z.string().optional(),
  merchant_id: z.string().optional(),
  terminal_id: z.string().optional(),
});

export type PaymentMethodFormData = z.infer<typeof paymentMethodSchema>;
