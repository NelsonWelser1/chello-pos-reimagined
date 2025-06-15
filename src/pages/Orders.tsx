
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { OrdersHeader } from "@/components/orders/OrdersHeader";
import { OrdersList } from "@/components/orders/OrdersList";

export default function Orders() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 to-blue-50">
        <AppSidebar />
        <main className="flex-1">
          <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b px-4 py-3 shadow-sm">
            <SidebarTrigger className="hover:bg-blue-50 transition-colors" />
          </div>
          
          <div className="container mx-auto px-6 py-8 space-y-8">
            <OrdersHeader />
            <OrdersList />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
