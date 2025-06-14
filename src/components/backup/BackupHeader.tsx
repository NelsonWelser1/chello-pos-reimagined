
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Archive, Clock, Database, Settings, History, RotateCcw, Shield, CheckCircle } from "lucide-react";

interface BackupHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function BackupHeader({ activeTab, setActiveTab }: BackupHeaderProps) {
  const tabs = [
    { id: "overview", label: "Overview", icon: Archive },
    { id: "scheduler", label: "Scheduler", icon: Clock },
    { id: "history", label: "History", icon: History },
    { id: "restore", label: "Restore", icon: RotateCcw },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Backup</h1>
          <p className="text-gray-600 mt-1">Secure your data with automated backups and easy restore options</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium">Last Backup:</span>
            <Badge className="bg-green-500">2 hours ago</Badge>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium">Status:</span>
            <Badge className="bg-blue-500">Active</Badge>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2"
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
