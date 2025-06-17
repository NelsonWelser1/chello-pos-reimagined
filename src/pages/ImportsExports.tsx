
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ImportsExportsHeader } from "@/components/imports-exports/ImportsExportsHeader";
import { ImportSection } from "@/components/imports-exports/ImportSection";
import { ExportSection } from "@/components/imports-exports/ExportSection";
import { ImportExportHistory } from "@/components/imports-exports/ImportExportHistory";

const ImportsExports = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1 ml-80 bg-white">
          <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-6 py-4 shadow-sm">
            <SidebarTrigger className="hover:bg-blue-50 transition-colors rounded-md p-2" />
          </div>
          
          <div className="p-6">
            <div className="space-y-8">
              <ImportsExportsHeader />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ImportSection />
                <ExportSection />
              </div>
              
              <ImportExportHistory />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default ImportsExports;
