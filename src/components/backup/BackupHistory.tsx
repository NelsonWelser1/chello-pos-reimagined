
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Download, RotateCcw, Trash2, Database, CheckCircle, XCircle, Clock } from "lucide-react";
import { useState } from "react";

interface BackupRecord {
  id: string;
  name: string;
  type: "full" | "incremental" | "differential" | "manual";
  status: "completed" | "failed" | "in_progress";
  date: string;
  size: string;
  duration: string;
  location: "local" | "cloud";
  notes?: string;
}

export function BackupHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const [backups] = useState<BackupRecord[]>([
    {
      id: "1",
      name: "Daily Backup - June 14",
      type: "incremental",
      status: "completed",
      date: "2024-06-14 18:00:00",
      size: "125 MB",
      duration: "2m 15s",
      location: "cloud",
      notes: "Automated daily backup"
    },
    {
      id: "2",
      name: "Manual Full Backup",
      type: "manual",
      status: "completed",
      date: "2024-06-14 14:30:00",
      size: "2.1 GB",
      duration: "8m 42s",
      location: "local"
    },
    {
      id: "3",
      name: "Weekly System Backup",
      type: "full",
      status: "completed",
      date: "2024-06-09 02:00:00",
      size: "3.8 GB",
      duration: "15m 30s",
      location: "cloud",
      notes: "Weekly full system backup"
    },
    {
      id: "4",
      name: "Emergency Backup",
      type: "manual",
      status: "failed",
      date: "2024-06-08 16:45:00",
      size: "0 MB",
      duration: "0m 30s",
      location: "local",
      notes: "Failed due to insufficient storage space"
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return CheckCircle;
      case "failed": return XCircle;
      case "in_progress": return Clock;
      default: return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500";
      case "failed": return "bg-red-500";
      case "in_progress": return "bg-orange-500";
      default: return "bg-gray-500";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "full": return "bg-red-500";
      case "incremental": return "bg-blue-500";
      case "differential": return "bg-purple-500";
      case "manual": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const handleDownload = (backupId: string) => {
    console.log("Downloading backup:", backupId);
  };

  const handleRestore = (backupId: string) => {
    console.log("Initiating restore from backup:", backupId);
  };

  const handleDelete = (backupId: string) => {
    console.log("Deleting backup:", backupId);
  };

  const filteredBackups = backups.filter(backup => {
    const matchesSearch = backup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         backup.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || backup.status === statusFilter;
    const matchesType = typeFilter === "all" || backup.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Backup History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search backups..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="full">Full</SelectItem>
                <SelectItem value="incremental">Incremental</SelectItem>
                <SelectItem value="differential">Differential</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {filteredBackups.map((backup) => {
              const StatusIcon = getStatusIcon(backup.status);
              return (
                <div key={backup.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <StatusIcon className={`w-5 h-5 ${backup.status === 'completed' ? 'text-green-600' : backup.status === 'failed' ? 'text-red-600' : 'text-orange-600'}`} />
                      <h4 className="font-medium">{backup.name}</h4>
                      <Badge className={getStatusColor(backup.status)}>
                        {backup.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <Badge className={getTypeColor(backup.type)}>
                        {backup.type.toUpperCase()}
                      </Badge>
                      <Badge variant="outline">
                        {backup.location.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="grid md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Date:</span> {backup.date}
                      </div>
                      <div>
                        <span className="font-medium">Size:</span> {backup.size}
                      </div>
                      <div>
                        <span className="font-medium">Duration:</span> {backup.duration}
                      </div>
                      <div>
                        <span className="font-medium">Location:</span> {backup.location}
                      </div>
                    </div>
                    {backup.notes && (
                      <p className="text-sm text-gray-500 mt-2">{backup.notes}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {backup.status === "completed" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(backup.id)}
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRestore(backup.id)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <RotateCcw className="w-4 h-4 mr-1" />
                          Restore
                        </Button>
                      </>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(backup.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
