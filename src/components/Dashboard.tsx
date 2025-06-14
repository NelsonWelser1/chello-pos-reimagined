
import { DashboardHeader } from "./dashboard/DashboardHeader";
import { KPICards } from "./dashboard/KPICards";
import { DashboardTabs } from "./dashboard/DashboardTabs";

export function Dashboard() {
  return (
    <div className="space-y-8 p-1">
      {/* Header */}
      <DashboardHeader />

      {/* Key Performance Indicators */}
      <KPICards />

      {/* Main Dashboard Tabs */}
      <DashboardTabs />
    </div>
  );
}
