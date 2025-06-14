
import { SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";

interface MenuItem {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
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
  return (
    <SidebarGroup>
      {title && (
        <SidebarGroupLabel className={`${textColor} text-sm font-black px-3 py-3 rounded-lg border ${labelBorderColor} ${labelBgColor}`}>
          {emoji} {title}
        </SidebarGroupLabel>
      )}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map(item => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild className={`text-white ${hoverGradient} hover:text-white border-2 border-transparent hover:border-blue-300/50 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg backdrop-blur-sm`}>
                <a href={item.url} className="flex items-center gap-3 p-4">
                  <item.icon className={`w-5 h-5 ${iconColor}`} />
                  <span className="font-black text-slate-950">{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
