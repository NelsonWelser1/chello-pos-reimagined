
import { SidebarProvider } from "@/components/ui/sidebar";
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
        <main className="flex-1 p-6">
          <div className="space-y-8">
            <ImportsExportsHeader />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ImportSection />
              <ExportSection />
            </div>
            
            <ImportExportHistory />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default ImportsExports;
