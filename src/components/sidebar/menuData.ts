
import { 
  Home, 
  ShoppingCart, 
  Package, 
  Users, 
  Settings, 
  BarChart3, 
  Calculator, 
  FileText, 
  TrendingUp, 
  CreditCard, 
  ChefHat,
  AlertTriangle,
  Download,
  Upload,
  Table,
  MapPin,
  Database
} from "lucide-react";

export const menuItems = [
  { icon: Home, label: "Dashboard", href: "/" },
  { icon: Calculator, label: "POS", href: "/pos" },
  { icon: ChefHat, label: "Kitchen", href: "/kitchen" },
];

export const portalsItems = [
  { icon: ShoppingCart, label: "Sales", href: "/sales" },
  { icon: Table, label: "Service Tables", href: "/service-tables" },
  { icon: CreditCard, label: "Payment Methods", href: "/payment-methods" },
  { icon: MapPin, label: "Pickup Points", href: "/pickup-points" },
];

export const foodsItems = [
  { icon: Package, label: "Items", href: "/items" },
  { icon: Package, label: "Ingredients", href: "/ingredients" },
  { icon: FileText, label: "Categories", href: "/categories" },
  { icon: Settings, label: "Modifiers", href: "/modifiers" },
];

export const expensesItems = [
  { icon: FileText, label: "Expense Types", href: "/expense-types" },
  { icon: CreditCard, label: "Expenses", href: "/expenses" },
];

export const peopleItems = [
  { icon: Users, label: "Customers", href: "/customers" },
  { icon: Users, label: "Staff", href: "/staff" },
];

export const reportsItems = [
  { icon: FileText, label: "Tax Reports", href: "/tax-reports" },
  { icon: BarChart3, label: "Overall Reports", href: "/overall-reports" },
];

export const advanceItems = [
  { icon: AlertTriangle, label: "Stock Alert", href: "/stock-alert" },
  { icon: Upload, label: "Imports/Exports", href: "/imports-exports" },
  { icon: Database, label: "Backup", href: "/backup" },
];
