
export interface ExpenseSummary {
  totalExpenses: number;
  monthlyAverage: number;
  budgetUtilization: number;
  overBudgetCategories: number;
  pendingApprovals: number;
  approvedExpenses: number;
  taxDeductible: number;
  projectedSavings: number;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  budget: number;
  percentage: number;
  status: string;
  trend: string;
  efficiency: number;
}

export interface MonthlyTrend {
  month: string;
  amount: number;
  budget: number;
  variance: number;
}

export interface WeeklyTrend {
  week: string;
  expenses: number;
  target: number;
}

export interface RecentExpense {
  id: number;
  description: string;
  category: string;
  amount: number;
  date: string;
  status: string;
  vendor: string;
}

export interface VendorAnalysis {
  vendor: string;
  amount: number;
  transactions: number;
  category: string;
  reliability: number;
  paymentTerms: string;
  avgDeliveryTime: string;
}

export interface TaxAnalysis {
  totalTaxPaid: number;
  deductibleExpenses: number;
  nonDeductibleExpenses: number;
  estimatedTaxSavings: number;
  quarterlyProjection: number;
  categories: {
    category: string;
    deductible: number;
    nonDeductible: number;
    taxSavings: number;
    rate: number;
  }[];
}

export interface CostOptimization {
  category: string;
  currentCost: number;
  potentialSavings: number;
  recommendation: string;
  priority: string;
  implementationTime: string;
  roi: number;
}

export interface ExpenseForecasting {
  month: string;
  predicted: number;
  confidence: number;
  factors: string[];
}

export interface ExpenseData {
  summary: ExpenseSummary;
  categoryBreakdown: CategoryBreakdown[];
  monthlyTrends: MonthlyTrend[];
  weeklyTrends: WeeklyTrend[];
  recentExpenses: RecentExpense[];
  vendorAnalysis: VendorAnalysis[];
  taxAnalysis: TaxAnalysis;
  costOptimization: CostOptimization[];
  expenseForecasting: ExpenseForecasting[];
}

// Enhanced mock expense data
export const mockExpenseData: ExpenseData = {
  summary: {
    totalExpenses: 125750.50,
    monthlyAverage: 31437.63,
    budgetUtilization: 82.3,
    overBudgetCategories: 4,
    pendingApprovals: 8750.00,
    approvedExpenses: 117000.50,
    taxDeductible: 98250.75,
    projectedSavings: 15500.00
  },
  
  categoryBreakdown: [
    { category: "Food & Beverage", amount: 45250, budget: 50000, percentage: 36.0, status: "on-track", trend: "+2.5%", efficiency: 90 },
    { category: "Labor Costs", amount: 38900, budget: 35000, percentage: 31.0, status: "over-budget", trend: "+11.1%", efficiency: 78 },
    { category: "Utilities", amount: 15200, budget: 16000, percentage: 12.1, status: "under-budget", trend: "-5.0%", efficiency: 95 },
    { category: "Marketing", amount: 12800, budget: 15000, percentage: 10.2, status: "under-budget", trend: "-14.7%", efficiency: 85 },
    { category: "Equipment", amount: 8600, budget: 10000, percentage: 6.8, status: "under-budget", trend: "-14.0%", efficiency: 92 },
    { category: "Maintenance", amount: 5000, budget: 6000, percentage: 4.0, status: "on-track", trend: "-16.7%", efficiency: 88 }
  ],

  monthlyTrends: [
    { month: "Jan", amount: 28500, budget: 30000, variance: -1500 },
    { month: "Feb", amount: 32100, budget: 30000, variance: 2100 },
    { month: "Mar", amount: 31800, budget: 31000, variance: 800 },
    { month: "Apr", amount: 33350, budget: 32000, variance: 1350 }
  ],

  weeklyTrends: [
    { week: "Week 1", expenses: 5600, target: 5500 },
    { week: "Week 2", expenses: 5450, target: 5500 },
    { week: "Week 3", expenses: 5800, target: 5500 },
    { week: "Week 4", expenses: 5800, target: 5500 }
  ],

  recentExpenses: [
    { id: 1, description: "Fresh Seafood Delivery", category: "Food & Beverage", amount: 2850, date: "2024-04-15", status: "approved", vendor: "Ocean Fresh Suppliers" },
    { id: 2, description: "Social Media Campaign", category: "Marketing", amount: 1200, date: "2024-04-14", status: "pending", vendor: "Digital Marketing Pro" },
    { id: 3, description: "Kitchen Equipment Repair", category: "Maintenance", amount: 850, date: "2024-04-13", status: "approved", vendor: "TechRepair Solutions" },
    { id: 4, description: "Utility Bill - Electric", category: "Utilities", amount: 3200, date: "2024-04-12", status: "approved", vendor: "Metro Electric Co" },
    { id: 5, description: "Staff Training Program", category: "Labor Costs", amount: 1500, date: "2024-04-11", status: "pending", vendor: "ProTraining Institute" }
  ],

  vendorAnalysis: [
    { vendor: "Premier Food Distributors", amount: 12500, transactions: 28, category: "Food & Beverage", reliability: 98, paymentTerms: "Net 30", avgDeliveryTime: "1.2 days" },
    { vendor: "Elite Staffing Solutions", amount: 15000, transactions: 6, category: "Labor Costs", reliability: 100, paymentTerms: "Net 15", avgDeliveryTime: "Same day" },
    { vendor: "Metro Utility Services", amount: 6200, transactions: 12, category: "Utilities", reliability: 95, paymentTerms: "Net 15", avgDeliveryTime: "2-3 days" },
    { vendor: "Digital Marketing Pro", amount: 4800, transactions: 15, category: "Marketing", reliability: 92, paymentTerms: "Net 30", avgDeliveryTime: "1-2 days" },
    { vendor: "Professional Equipment Co", amount: 2850, transactions: 8, category: "Equipment", reliability: 88, paymentTerms: "Net 45", avgDeliveryTime: "3-5 days" }
  ],

  taxAnalysis: {
    totalTaxPaid: 6785.50,
    deductibleExpenses: 98250.75,
    nonDeductibleExpenses: 27499.75,
    estimatedTaxSavings: 29475.23,
    quarterlyProjection: 88275.68,
    categories: [
      { category: "Food & Beverage", deductible: 45250, nonDeductible: 0, taxSavings: 13575, rate: 0.30 },
      { category: "Labor Costs", deductible: 38900, nonDeductible: 0, taxSavings: 11670, rate: 0.30 },
      { category: "Utilities", deductible: 15200, nonDeductible: 0, taxSavings: 4560, rate: 0.30 },
      { category: "Marketing", deductible: 12800, nonDeductible: 0, taxSavings: 3840, rate: 0.30 },
      { category: "Equipment", deductible: 8600, nonDeductible: 0, taxSavings: 2580, rate: 0.30 }
    ]
  },

  costOptimization: [
    { 
      category: "Food & Beverage", 
      currentCost: 45250, 
      potentialSavings: 4525, 
      recommendation: "Negotiate volume discounts and seasonal pricing with suppliers",
      priority: "High",
      implementationTime: "2-4 weeks",
      roi: 452
    },
    { 
      category: "Labor Costs", 
      currentCost: 38900, 
      potentialSavings: 3890, 
      recommendation: "Implement dynamic scheduling based on customer traffic patterns",
      priority: "Medium",
      implementationTime: "4-6 weeks",
      roi: 389
    },
    { 
      category: "Utilities", 
      currentCost: 15200, 
      potentialSavings: 1520, 
      recommendation: "Upgrade to energy-efficient equipment and smart controls",
      priority: "Medium",
      implementationTime: "6-8 weeks",
      roi: 152
    },
    { 
      category: "Marketing", 
      currentCost: 12800, 
      potentialSavings: 2560, 
      recommendation: "Focus budget on high-converting digital channels",
      priority: "High",
      implementationTime: "1-2 weeks",
      roi: 256
    }
  ],

  expenseForecasting: [
    { month: "Jul", predicted: 33100, confidence: 85, factors: ["Seasonal increase", "New marketing campaign"] },
    { month: "Aug", predicted: 35800, confidence: 82, factors: ["Peak season", "Equipment upgrade"] },
    { month: "Sep", predicted: 32900, confidence: 88, factors: ["Post-summer normalization"] },
    { month: "Oct", predicted: 31400, confidence: 90, factors: ["Stable operations"] }
  ]
};

export const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
