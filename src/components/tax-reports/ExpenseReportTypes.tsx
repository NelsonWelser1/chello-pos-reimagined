
export interface ExpenseSummary {
  totalExpenses: number;
  monthlyAverage: number;
  budgetUtilization: number;
  overBudgetCategories: number;
  pendingExpenses: number;
  approvedExpenses: number;
  taxDeductible: number;
  nonDeductible: number;
  projectedAnnualExpenses: number;
  costSavingsOpportunity: number;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  budget: number;
  percentage: number;
  trend: string;
  status: string;
  variance: number;
  efficiency: number;
}

export interface MonthlyTrend {
  month: string;
  expenses: number;
  budget: number;
  variance: number;
  forecast: number;
}

export interface WeeklyTrend {
  week: string;
  expenses: number;
  target: number;
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
  vendorAnalysis: VendorAnalysis[];
  taxAnalysis: TaxAnalysis;
  costOptimization: CostOptimization[];
  expenseForecasting: ExpenseForecasting[];
}

// Enhanced mock expense data
export const mockExpenseData: ExpenseData = {
  summary: {
    totalExpenses: 67850.75,
    monthlyAverage: 22616.92,
    budgetUtilization: 78.5,
    overBudgetCategories: 3,
    pendingExpenses: 4750.00,
    approvedExpenses: 63100.75,
    taxDeductible: 58475.50,
    nonDeductible: 9375.25,
    projectedAnnualExpenses: 271403.00,
    costSavingsOpportunity: 8950.00
  },
  
  categoryBreakdown: [
    { category: "Food & Beverage", amount: 24500, budget: 25000, percentage: 36.1, trend: "+2.8%", status: "on-track", variance: -500, efficiency: 92 },
    { category: "Labor", amount: 18900, budget: 18000, percentage: 27.9, trend: "+5.0%", status: "over-budget", variance: 900, efficiency: 85 },
    { category: "Rent & Utilities", amount: 12200, budget: 12000, percentage: 18.0, trend: "+1.7%", status: "over-budget", variance: 200, efficiency: 95 },
    { category: "Marketing", amount: 6100, budget: 8000, percentage: 9.0, trend: "-23.8%", status: "under-budget", variance: -1900, efficiency: 76 },
    { category: "Equipment", amount: 3850, budget: 5000, percentage: 5.7, trend: "-23.0%", status: "under-budget", variance: -1150, efficiency: 88 },
    { category: "Maintenance", amount: 2300, budget: 3000, percentage: 3.4, trend: "-23.3%", status: "under-budget", variance: -700, efficiency: 91 }
  ],

  monthlyTrends: [
    { month: "Jan", expenses: 21200, budget: 22000, variance: -800, forecast: 22500 },
    { month: "Feb", expenses: 23100, budget: 22000, variance: 1100, forecast: 23200 },
    { month: "Mar", expenses: 23550, budget: 22500, variance: 1050, forecast: 23800 },
    { month: "Apr", expenses: 22800, budget: 22500, variance: 300, forecast: 22900 },
    { month: "May", expenses: 21950, budget: 22500, variance: -550, forecast: 22100 },
    { month: "Jun", expenses: 22650, budget: 22500, variance: 150, forecast: 22750 }
  ],

  weeklyTrends: [
    { week: "Week 1", expenses: 5600, target: 5500 },
    { week: "Week 2", expenses: 5450, target: 5500 },
    { week: "Week 3", expenses: 5800, target: 5500 },
    { week: "Week 4", expenses: 5800, target: 5500 }
  ],

  vendorAnalysis: [
    { vendor: "Premier Food Distributors", amount: 12500, transactions: 28, category: "Food & Beverage", reliability: 98, paymentTerms: "Net 30", avgDeliveryTime: "1.2 days" },
    { vendor: "Elite Staffing Solutions", amount: 15000, transactions: 6, category: "Labor", reliability: 100, paymentTerms: "Net 15", avgDeliveryTime: "Same day" },
    { vendor: "Metro Utility Services", amount: 6200, transactions: 12, category: "Utilities", reliability: 95, paymentTerms: "Net 15", avgDeliveryTime: "2-3 days" },
    { vendor: "Digital Marketing Pro", amount: 4800, transactions: 15, category: "Marketing", reliability: 92, paymentTerms: "Net 30", avgDeliveryTime: "1-2 days" },
    { vendor: "Professional Equipment Co", amount: 2850, transactions: 8, category: "Equipment", reliability: 88, paymentTerms: "Net 45", avgDeliveryTime: "3-5 days" }
  ],

  taxAnalysis: {
    totalTaxPaid: 6785.50,
    deductibleExpenses: 58475.50,
    nonDeductibleExpenses: 9375.25,
    estimatedTaxSavings: 17542.65,
    quarterlyProjection: 52627.95,
    categories: [
      { category: "Food & Beverage", deductible: 24500, nonDeductible: 0, taxSavings: 7350, rate: 0.30 },
      { category: "Labor", deductible: 18900, nonDeductible: 0, taxSavings: 5670, rate: 0.30 },
      { category: "Rent & Utilities", deductible: 12200, nonDeductible: 0, taxSavings: 3660, rate: 0.30 },
      { category: "Marketing", deductible: 6100, nonDeductible: 0, taxSavings: 1830, rate: 0.30 },
      { category: "Equipment", deductible: 3850, nonDeductible: 0, taxSavings: 1155, rate: 0.30 }
    ]
  },

  costOptimization: [
    { 
      category: "Food & Beverage", 
      currentCost: 24500, 
      potentialSavings: 2450, 
      recommendation: "Negotiate volume discounts and seasonal pricing with suppliers",
      priority: "High",
      implementationTime: "2-4 weeks",
      roi: 245
    },
    { 
      category: "Labor", 
      currentCost: 18900, 
      potentialSavings: 1890, 
      recommendation: "Implement dynamic scheduling based on customer traffic patterns",
      priority: "Medium",
      implementationTime: "4-6 weeks",
      roi: 189
    },
    { 
      category: "Utilities", 
      currentCost: 6200, 
      potentialSavings: 620, 
      recommendation: "Upgrade to energy-efficient equipment and smart controls",
      priority: "Medium",
      implementationTime: "6-8 weeks",
      roi: 62
    },
    { 
      category: "Marketing", 
      currentCost: 4800, 
      potentialSavings: 960, 
      recommendation: "Focus budget on high-converting digital channels",
      priority: "High",
      implementationTime: "1-2 weeks",
      roi: 96
    }
  ],

  expenseForecasting: [
    { month: "Jul", predicted: 23100, confidence: 85, factors: ["Seasonal increase", "New marketing campaign"] },
    { month: "Aug", predicted: 23800, confidence: 82, factors: ["Peak season", "Equipment upgrade"] },
    { month: "Sep", predicted: 22900, confidence: 88, factors: ["Post-summer normalization"] },
    { month: "Oct", predicted: 22400, confidence: 90, factors: ["Stable operations"] }
  ]
};

export const COLORS = ['#10B981', '#3B82F6', '#EF4444', '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];
