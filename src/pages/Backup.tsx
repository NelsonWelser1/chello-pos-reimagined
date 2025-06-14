
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { BackupHeader } from "@/components/backup/BackupHeader";
import { BackupOverview } from "@/components/backup/BackupOverview";
import { BackupScheduler } from "@/components/backup/BackupScheduler";
import { BackupHistory } from "@/components/backup/BackupHistory";
import { RestoreManager } from "@/components/backup/RestoreManager";
import { BackupSettings } from "@/components/backup/BackupSettings";
import { useState } from "react";

const Backup = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="space-y-6">
            <BackupHeader activeTab={activeTab} setActiveTab={setActiveTab} />
            
            {activeTab === "overview" && <BackupOverview />}
            {activeTab === "scheduler" && <BackupScheduler />}
            {activeTab === "history" && <BackupHistory />}
            {activeTab === "restore" && <RestoreManager />}
            {activeTab === "settings" && <BackupSettings />}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Backup;
