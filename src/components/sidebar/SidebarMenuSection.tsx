import { SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
interface MenuItem {
  title: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
  url: string;
}
interface SidebarMenuSectionProps {
  title?: string;
  items: MenuItem[];
  emoji?: string;
  hoverGradient: string;
  iconColor: string;
  textColor: string;
  labelBgColor?: string;
  labelBorderColor?: string;
}
export function SidebarMenuSection({
  title,
  items,
  emoji,
  hoverGradient,
  iconColor,
  textColor,
  labelBgColor,
  labelBorderColor
}: SidebarMenuSectionProps) {
  return <SidebarGroup className="bg-slate-950">
      {title && <SidebarGroupLabel className={`${textColor} text-base font-black px-4 py-4 rounded-lg border ${labelBorderColor} ${labelBgColor}`}>
          {emoji} {title}
        </SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map(item => <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild className={`text-white ${hoverGradient} hover:text-white border-2 border-transparent hover:border-blue-300/50 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg backdrop-blur-sm`}>
                <Link to={item.url} className="flex items-center gap-4 p-5">
                  <item.icon className={`w-6 h-6 ${iconColor}`} />
                  <span className="font-black text-slate-950 text-base">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>)}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>;
}