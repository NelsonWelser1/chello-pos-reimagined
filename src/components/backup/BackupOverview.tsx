
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Database, Cloud, HardDrive, Download, Upload, Play, Pause } from "lucide-react";
import { useState } from "react";

interface BackupStats {
  totalBackups: number;
  lastBackupDate: string;
  nextScheduled: string;
  storageUsed: number;
  storageLimit: number;
  autoBackupEnabled: boolean;
}

export function BackupOverview() {
  const [stats] = useState<BackupStats>({
    totalBackups: 45,
    lastBackupDate: "2024-06-14 14:30:00",
    nextScheduled: "2024-06-14 18:00:00",
    storageUsed: 2.4,
    storageLimit: 10,
    autoBackupEnabled: true
  });

  const [isBackingUp, setIsBackingUp] = useState(false);

  const handleCreateBackup = () => {
    setIsBackingUp(true);
    console.log("Creating manual backup...");
    // Simulate backup process
    setTimeout(() => {
      setIsBackingUp(false);
      console.log("Backup completed successfully");
    }, 3000);
  };

  const handleToggleAutoBackup = () => {
    console.log("Toggling auto backup:", !stats.autoBackupEnabled);
  };

  const storagePercentage = (stats.storageUsed / stats.storageLimit) * 100;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Backups</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBackups}</div>
            <p className="text-xs text-muted-foreground">All time backups</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Backup</CardTitle>
            <Cloud className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2h ago</div>
            <p className="text-xs text-muted-foreground">{stats.lastBackupDate}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Scheduled</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6:00 PM</div>
            <p className="text-xs text-muted-foreground">Today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Auto Backup</CardTitle>
            <Badge className={stats.autoBackupEnabled ? "bg-green-500" : "bg-red-500"}>
              {stats.autoBackupEnabled ? "Enabled" : "Disabled"}
            </Badge>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleToggleAutoBackup}
              className="w-full"
            >
              {stats.autoBackupEnabled ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {stats.autoBackupEnabled ? "Disable" : "Enable"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="w-5 h-5" />
              Storage Usage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Used: {stats.storageUsed} GB</span>
                <span>Available: {stats.storageLimit - stats.storageUsed} GB</span>
              </div>
              <Progress value={storagePercentage} className="h-2" />
              <p className="text-xs text-gray-500">
                {storagePercentage.toFixed(1)}% of {stats.storageLimit} GB used
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={handleCreateBackup} 
              disabled={isBackingUp}
              className="w-full"
            >
              <Upload className="w-4 h-4 mr-2" />
              {isBackingUp ? "Creating Backup..." : "Create Manual Backup"}
            </Button>
            <Button variant="outline" className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Download Latest Backup
            </Button>
            <Button variant="outline" className="w-full">
              <Cloud className="w-4 h-4 mr-2" />
              Sync to Cloud Storage
            </Button>
          </CardContent>
        </Card>
      </div>

      {isBackingUp && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <div>
                <p className="font-medium text-blue-900">Backup in Progress</p>
                <p className="text-sm text-blue-700">Creating backup of database and system files...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
