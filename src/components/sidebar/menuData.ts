import { 
  LayoutDashboard, 
  DollarSign, 
  ShoppingCart, 
  ChefHat, 
  Grid3X3, 
  Package, 
  Settings, 
  Layers, 
  Receipt, 
  CreditCard, 
  Users, 
  UserCog, 
  FileText, 
  AlertTriangle, 
  Star, 
  Database, 
  Archive 
} from "lucide-react";

export const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    url: "/"
  },
  {
    title: "Sales",
    icon: DollarSign,
    url: "/sales"
  }
];

export const portalsItems = [
  {
    title: "POS",
    icon: ShoppingCart,
    url: "/pos"
  },
  {
    title: "Kitchen",
    icon: ChefHat,
    url: "/kitchen"
  }
];

export const foodsItems = [
  {
    title: "Categories",
    icon: Grid3X3,
    url: "/categories"
  },
  {
    title: "Items",
    icon: Package,
    url: "/items"
  },
  {
    title: "Modifiers",
    icon: Settings,
    url: "/modifiers"
  },
  {
    title: "Ingredients",
    icon: Layers,
    url: "/ingredients"
  }
];

export const expensesItems = [
  {
    title: "Expense Types",
    icon: Receipt,
    url: "/expense-types"
  },
  {
    title: "Expenses", 
    icon: CreditCard,
    url: "/expenses"
  }
];

export const peopleItems = [
  {
    title: "Users",
    icon: Users,
    url: "#users"
  },
  {
    title: "User Roles",
    icon: UserCog,
    url: "#user-roles"
  }
];

export const reportsItems = [
  {
    title: "Overall Report",
    icon: FileText,
    url: "/overall-reports"
  },
  {
    title: "Tax Report",
    icon: FileText,
    url: "/tax-reports"
  },
  {
    title: "Expense Report",
    icon: FileText,
    url: "/tax-reports?tab=expense-report"
  },
  {
    title: "Stock Alert",
    icon: AlertTriangle,
    url: "/stock-alert"
  }
];

export const advanceItems = [
  {
    title: "Imports Exports",
    icon: Database,
    url: "/imports-exports"
  },
  {
    title: "Service Tables",
    icon: Star,
    url: "/service-tables"
  },
  {
    title: "Payment Methods",
    icon: DollarSign,
    url: "#payment-methods"
  },
  {
    title: "Pickup Points",
    icon: Package,
    url: "#pickup-points"
  },
  {
    title: "Backup",
    icon: Archive,
    url: "#backup"
  },
  {
    title: "Settings",
    icon: Settings,
    url: "#settings"
  }
];
