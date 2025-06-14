
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { RotateCcw, Upload, Download, CheckCircle, AlertTriangle, Clock } from "lucide-react";
import { useState } from "react";

interface RestorePoint {
  id: string;
  name: string;
  date: string;
  size: string;
  type: "full" | "incremental" | "differential";
  status: "available" | "corrupted" | "archived";
  location: "local" | "cloud";
}

export function RestoreManager() {
  const [selectedRestore, setSelectedRestore] = useState("");
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreProgress, setRestoreProgress] = useState(0);

  const [restorePoints] = useState<RestorePoint[]>([
    {
      id: "1",
      name: "Daily Backup - June 14",
      date: "2024-06-14 18:00:00",
      size: "125 MB",
      type: "incremental",
      status: "available",
      location: "cloud"
    },
    {
      id: "2",
      name: "Weekly Full Backup",
      date: "2024-06-09 02:00:00", 
      size: "3.8 GB",
      type: "full",
      status: "available",
      location: "cloud"
    },
    {
      id: "3",
      name: "Manual Backup",
      date: "2024-06-08 14:30:00",
      size: "2.1 GB", 
      type: "full",
      status: "available",
      location: "local"
    }
  ]);

  const handleRestore = () => {
    if (!selectedRestore) return;
    
    setIsRestoring(true);
    setRestoreProgress(0);
    console.log("Starting restore from backup:", selectedRestore);
    
    // Simulate restore progress
    const interval = setInterval(() => {
      setRestoreProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRestoring(false);
          console.log("Restore completed successfully");
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available": return CheckCircle;
      case "corrupted": return AlertTriangle;
      case "archived": return Clock;
      default: return CheckCircle;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "bg-green-500";
      case "corrupted": return "bg-red-500"; 
      case "archived": return "bg-orange-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RotateCcw className="w-5 h-5" />
            System Restore
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Select Restore Point</Label>
            <Select value={selectedRestore} onValueChange={setSelectedRestore}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a backup to restore from" />
              </SelectTrigger>
              <SelectContent>
                {restorePoints.map((point) => (
                  <SelectItem key={point.id} value={point.id}>
                    {point.name} - {point.date}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={handleRestore} 
            disabled={!selectedRestore || isRestoring}
            className="w-full"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            {isRestoring ? "Restoring..." : "Start Restore"}
          </Button>

          {isRestoring && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Restore Progress</span>
                <span>{restoreProgress}%</span>
              </div>
              <Progress value={restoreProgress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Restore Points</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {restorePoints.map((point) => {
              const StatusIcon = getStatusIcon(point.status);
              return (
                <div key={point.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <StatusIcon className={`w-5 h-5 ${point.status === 'available' ? 'text-green-600' : point.status === 'corrupted' ? 'text-red-600' : 'text-orange-600'}`} />
                      <h4 className="font-medium">{point.name}</h4>
                      <Badge className={getStatusColor(point.status)}>
                        {point.status.toUpperCase()}
                      </Badge>
                      <Badge variant="outline">
                        {point.type.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Date:</span> {point.date}
                      </div>
                      <div>
                        <span className="font-medium">Size:</span> {point.size}
                      </div>
                      <div>
                        <span className="font-medium">Location:</span> {point.location}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {point.status === "available" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedRestore(point.id)}
                      >
                        Select
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Restore from File</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="restore-file">Upload Backup File</Label>
            <Input id="restore-file" type="file" accept=".bak,.sql,.zip" />
          </div>
          <Button variant="outline" className="w-full">
            <Upload className="w-4 h-4 mr-2" />
            Restore from File
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
