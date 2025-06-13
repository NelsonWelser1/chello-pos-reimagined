
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
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
  UserCog
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    url: "#dashboard",
  },
  {
    title: "Sales",
    icon: DollarSign,
    url: "#sales",
  },
];

const portalsItems = [
  {
    title: "POS",
    icon: ShoppingCart,
    url: "#pos",
  },
  {
    title: "Kitchen",
    icon: ChefHat,
    url: "#kitchen",
  },
];

const foodsItems = [
  {
    title: "Categories",
    icon: Grid3X3,
    url: "#categories",
  },
  {
    title: "Items",
    icon: Package,
    url: "#items",
  },
  {
    title: "Modifiers",
    icon: Settings,
    url: "#modifiers",
  },
  {
    title: "Ingredients",
    icon: Layers,
    url: "#ingredients",
  },
];

const expensesItems = [
  {
    title: "Expense Types",
    icon: Receipt,
    url: "#expense-types",
  },
  {
    title: "Expenses",
    icon: CreditCard,
    url: "#expenses",
  },
];

const peopleItems = [
  {
    title: "Users",
    icon: Users,
    url: "#users",
  },
  {
    title: "User Roles",
    icon: UserCog,
    url: "#user-roles",
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="bg-slate-800 text-white border-r-0">
      <SidebarHeader className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <ChefHat className="w-6 h-6 text-slate-800" />
          </div>
          <div>
            <h2 className="font-bold text-lg">CHELLO</h2>
            <p className="text-sm text-slate-300">RESTAURANT POS</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="text-white hover:bg-slate-700 hover:text-white">
                    <a href={item.url} className="flex items-center gap-3 p-3">
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-orange-400 text-sm font-medium px-3 py-2">
            Portals
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {portalsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="text-white hover:bg-slate-700 hover:text-white">
                    <a href={item.url} className="flex items-center gap-3 p-3">
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-orange-400 text-sm font-medium px-3 py-2">
            Foods
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {foodsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="text-white hover:bg-slate-700 hover:text-white">
                    <a href={item.url} className="flex items-center gap-3 p-3">
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-orange-400 text-sm font-medium px-3 py-2">
            Expenses
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {expensesItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="text-white hover:bg-slate-700 hover:text-white">
                    <a href={item.url} className="flex items-center gap-3 p-3">
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-orange-400 text-sm font-medium px-3 py-2">
            People
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {peopleItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="text-white hover:bg-slate-700 hover:text-white">
                    <a href={item.url} className="flex items-center gap-3 p-3">
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
