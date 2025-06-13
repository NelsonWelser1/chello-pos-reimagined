import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarGroup, SidebarGroupLabel, SidebarGroupContent } from "@/components/ui/sidebar";
import { LayoutDashboard, DollarSign, ShoppingCart, ChefHat, Grid3X3, Package, Settings, Layers, Receipt, CreditCard, Users, UserCog } from "lucide-react";
const menuItems = [{
  title: "Dashboard",
  icon: LayoutDashboard,
  url: "#dashboard"
}, {
  title: "Sales",
  icon: DollarSign,
  url: "#sales"
}];
const portalsItems = [{
  title: "POS",
  icon: ShoppingCart,
  url: "#pos"
}, {
  title: "Kitchen",
  icon: ChefHat,
  url: "#kitchen"
}];
const foodsItems = [{
  title: "Categories",
  icon: Grid3X3,
  url: "#categories"
}, {
  title: "Items",
  icon: Package,
  url: "#items"
}, {
  title: "Modifiers",
  icon: Settings,
  url: "#modifiers"
}, {
  title: "Ingredients",
  icon: Layers,
  url: "#ingredients"
}];
const expensesItems = [{
  title: "Expense Types",
  icon: Receipt,
  url: "#expense-types"
}, {
  title: "Expenses",
  icon: CreditCard,
  url: "#expenses"
}];
const peopleItems = [{
  title: "Users",
  icon: Users,
  url: "#users"
}, {
  title: "User Roles",
  icon: UserCog,
  url: "#user-roles"
}];
export function AppSidebar() {
  return <Sidebar className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white border-r-0 shadow-2xl">
      <SidebarHeader className="p-6 border-b border-white/20 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
            <ChefHat className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-xl bg-gradient-to-r from-orange-300 to-yellow-300 bg-clip-text text-[#951400]">
              CHELLO
            </h2>
            <p className="text-sm font-medium text-slate-950">RESTAURANT POS</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-4 space-y-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map(item => <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="text-white hover:bg-gradient-to-r hover:from-blue-500/30 hover:to-purple-500/30 hover:text-white border-2 border-transparent hover:border-blue-300/50 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg backdrop-blur-sm">
                    <a href={item.url} className="flex items-center gap-3 p-4">
                      <item.icon className="w-5 h-5 text-blue-200" />
                      <span className="font-medium text-slate-950">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-orange-300 text-sm font-bold px-3 py-3 rounded-lg border border-orange-400/30 bg-slate-50">
            🚀 Portals
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {portalsItems.map(item => <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="text-white hover:bg-gradient-to-r hover:from-green-500/30 hover:to-teal-500/30 hover:text-white border-2 border-transparent hover:border-green-300/50 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg backdrop-blur-sm">
                    <a href={item.url} className="flex items-center gap-3 p-4">
                      <item.icon className="w-5 h-5 text-green-200" />
                      <span className="font-medium text-slate-950">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-yellow-300 text-sm font-bold px-3 py-3 bg-yellow-500/20 rounded-lg border border-yellow-400/30">
            🍽️ Foods
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {foodsItems.map(item => <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="text-white hover:bg-gradient-to-r hover:from-yellow-500/30 hover:to-orange-500/30 hover:text-white border-2 border-transparent hover:border-yellow-300/50 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg backdrop-blur-sm">
                    <a href={item.url} className="flex items-center gap-3 p-4">
                      <item.icon className="w-5 h-5 text-yellow-200" />
                      <span className="font-medium text-slate-950">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-red-300 text-sm font-bold px-3 py-3 bg-red-500/20 rounded-lg border border-red-400/30">
            💰 Expenses
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {expensesItems.map(item => <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="text-white hover:bg-gradient-to-r hover:from-red-500/30 hover:to-pink-500/30 hover:text-white border-2 border-transparent hover:border-red-300/50 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg backdrop-blur-sm">
                    <a href={item.url} className="flex items-center gap-3 p-4">
                      <item.icon className="w-5 h-5 text-red-200" />
                      <span className="font-medium text-gray-950">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-cyan-300 text-sm font-bold px-3 py-3 bg-cyan-500/20 rounded-lg border border-cyan-400/30">
            👥 People
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {peopleItems.map(item => <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="text-white hover:bg-gradient-to-r hover:from-cyan-500/30 hover:to-blue-500/30 hover:text-white border-2 border-transparent hover:border-cyan-300/50 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg backdrop-blur-sm">
                    <a href={item.url} className="flex items-center gap-3 p-4">
                      <item.icon className="w-5 h-5 text-cyan-200" />
                      <span className="font-medium text-slate-950">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>;
}