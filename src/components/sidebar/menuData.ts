
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
  Database,
  UsersRound
} from "lucide-react";

export const menuItems = [
  { icon: Home, title: "Dashboard", url: "/" },
  { icon: Calculator, title: "POS", url: "/pos" },
  { icon: ChefHat, title: "Kitchen", url: "/kitchen" },
];

export const portalsItems = [
  { icon: ShoppingCart, title: "Sales", url: "/sales" },
  { icon: Table, title: "Service Tables", url: "/service-tables" },
  { icon: CreditCard, title: "Payment Methods", url: "/payment-methods" },
  { icon: MapPin, title: "Pickup Points", url: "/pickup-points" },
];

export const foodsItems = [
  { icon: Package, title: "Items", url: "/items" },
  { icon: Package, title: "Ingredients", url: "/ingredients" },
  { icon: FileText, title: "Categories", url: "/categories" },
  { icon: Settings, title: "Modifiers", url: "/modifiers" },
];

export const expensesItems = [
  { icon: FileText, title: "Expense Types", url: "/expense-types" },
  { icon: CreditCard, title: "Expenses", url: "/expenses" },
];

export const peopleItems = [
  { icon: UsersRound, title: "Customers", url: "/customers" },
  { icon: Users, title: "Staff", url: "/staff" },
];

export const reportsItems = [
  { icon: FileText, title: "Tax Reports", url: "/tax-reports" },
  { icon: BarChart3, title: "Overall Reports", url: "/overall-reports" },
];

export const advanceItems = [
  { icon: AlertTriangle, title: "Stock Alert", url: "/stock-alert" },
  { icon: Upload, title: "Imports/Exports", url: "/imports-exports" },
  { icon: Database, title: "Backup", url: "/backup" },
];
