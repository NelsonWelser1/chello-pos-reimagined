
import * as z from "zod";

export const ruleSchema = z.object({
  name: z.string().min(1, "Rule name is required"),
  rule_type: z.enum(["fraud_detection", "amount_limit", "geographic", "time_based", "velocity", "blacklist"]),
  enabled: z.boolean().default(true),
  priority: z.number().min(1).max(100).default(50),
  conditions: z.array(z.object({
    field: z.string(),
    operator: z.enum(["equals", "not_equals", "greater_than", "less_than", "contains", "not_contains"]),
    value: z.string(),
  })).default([]),
  actions: z.array(z.object({
    action_type: z.enum(["block", "flag", "require_verification", "apply_fee", "route_to_gateway"]),
    parameters: z.record(z.string()).optional(),
  })).default([]),
  description: z.string().optional(),
  applies_to_methods: z.array(z.string()).default([]),
  max_amount: z.number().min(0).optional(),
  min_amount: z.number().min(0).optional(),
  allowed_countries: z.array(z.string()).default([]),
  blocked_countries: z.array(z.string()).default([]),
  time_restrictions: z.object({
    start_time: z.string().optional(),
    end_time: z.string().optional(),
    days_of_week: z.array(z.string()).default([]),
  }).optional(),
});

export type PaymentRuleFormData = z.infer<typeof ruleSchema>;
