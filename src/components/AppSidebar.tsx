
import { Sidebar, SidebarContent, SidebarFooter } from "@/components/ui/sidebar";
import { SidebarHeader } from "./sidebar/SidebarHeader";
import { SidebarMenuSection } from "./sidebar/SidebarMenuSection";
import { menuItems, portalsItems, foodsItems, expensesItems, peopleItems, reportsItems, advanceItems } from "./sidebar/menuData";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function AppSidebar() {
  const { signOut, user } = useAuth();

  return (
    <Sidebar className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white border-r border-gray-300 shadow-xl w-80 fixed left-0 top-0 h-full z-50">
      <SidebarHeader />
      
      <SidebarContent className="p-4 space-y-2 bg-slate-900 border-r border-gray-300">
        <SidebarMenuSection items={menuItems} hoverGradient="hover:bg-gradient-to-r hover:from-blue-500/30 hover:to-purple-500/30" iconColor="text-blue-200" textColor="text-white" />

        <SidebarMenuSection title="Portals" emoji="🚀" items={portalsItems} hoverGradient="hover:bg-gradient-to-r hover:from-green-500/30 hover:to-teal-500/30" iconColor="text-green-200" textColor="text-orange-300" labelBgColor="bg-slate-50" labelBorderColor="border-orange-400/30" />

        <SidebarMenuSection title="Foods" emoji="🍽️" items={foodsItems} hoverGradient="hover:bg-gradient-to-r hover:from-yellow-500/30 hover:to-orange-500/30" iconColor="text-yellow-200" textColor="text-yellow-300" labelBgColor="bg-yellow-500/20" labelBorderColor="border-yellow-400/30" />

        <SidebarMenuSection title="Expenses" emoji="💰" items={expensesItems} hoverGradient="hover:bg-gradient-to-r hover:from-red-500/30 hover:to-pink-500/30" iconColor="text-red-200" textColor="text-red-300" labelBgColor="bg-red-500/20" labelBorderColor="border-red-400/30" />

        <SidebarMenuSection title="People" emoji="👥" items={peopleItems} hoverGradient="hover:bg-gradient-to-r hover:from-cyan-500/30 hover:to-blue-500/30" iconColor="text-cyan-200" textColor="text-cyan-300" labelBgColor="bg-cyan-500/20" labelBorderColor="border-cyan-400/30" />

        <SidebarMenuSection title="Reports" emoji="📊" items={reportsItems} hoverGradient="hover:bg-gradient-to-r hover:from-blue-500/30 hover:to-indigo-500/30" iconColor="text-blue-200" textColor="text-blue-300" labelBgColor="bg-blue-500/20" labelBorderColor="border-blue-400/30" />

        <SidebarMenuSection title="Advance" emoji="⚡" items={advanceItems} hoverGradient="hover:bg-gradient-to-r hover:from-purple-500/30 hover:to-violet-500/30" iconColor="text-purple-200" textColor="text-purple-300" labelBgColor="bg-purple-500/20" labelBorderColor="border-purple-400/30" />
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-600 p-4 space-y-2">
        <div className="px-2 py-1 text-xs text-gray-300">
          {user?.email}
        </div>
        <Button
          variant="ghost"
          onClick={signOut}
          className="w-full justify-start text-red-300 hover:text-red-200 hover:bg-red-900/20"
          size="sm"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
