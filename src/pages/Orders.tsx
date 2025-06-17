
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { OrdersHeader } from "@/components/orders/OrdersHeader";
import { OrdersList } from "@/components/orders/OrdersList";

export default function Orders() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1 ml-80 bg-white">
          <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-6 py-4 shadow-sm">
            <SidebarTrigger className="hover:bg-blue-50 transition-colors rounded-md p-2" />
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
