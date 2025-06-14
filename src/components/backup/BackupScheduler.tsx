
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Clock, Save, Plus, Trash2, Edit } from "lucide-react";
import { useState } from "react";

interface BackupSchedule {
  id: string;
  name: string;
  frequency: "daily" | "weekly" | "monthly";
  time: string;
  enabled: boolean;
  lastRun?: string;
  nextRun: string;
  backupType: "full" | "incremental" | "differential";
}

export function BackupScheduler() {
  const [schedules, setSchedules] = useState<BackupSchedule[]>([
    {
      id: "1",
      name: "Daily Database Backup",
      frequency: "daily",
      time: "18:00",
      enabled: true,
      lastRun: "2024-06-14 18:00",
      nextRun: "2024-06-15 18:00",
      backupType: "incremental"
    },
    {
      id: "2",
      name: "Weekly Full System Backup",
      frequency: "weekly",
      time: "02:00",
      enabled: true,
      lastRun: "2024-06-09 02:00",
      nextRun: "2024-06-16 02:00",
      backupType: "full"
    }
  ]);

  const [newSchedule, setNewSchedule] = useState<Partial<BackupSchedule>>({
    name: "",
    frequency: "daily",
    time: "00:00",
    enabled: true,
    backupType: "incremental"
  });

  const handleAddSchedule = () => {
    if (newSchedule.name && newSchedule.frequency && newSchedule.time) {
      const schedule: BackupSchedule = {
        id: Date.now().toString(),
        name: newSchedule.name,
        frequency: newSchedule.frequency as any,
        time: newSchedule.time,
        enabled: newSchedule.enabled || true,
        nextRun: calculateNextRun(newSchedule.frequency as any, newSchedule.time),
        backupType: newSchedule.backupType as any
      };
      setSchedules([...schedules, schedule]);
      setNewSchedule({ name: "", frequency: "daily", time: "00:00", enabled: true, backupType: "incremental" });
      console.log("Added new backup schedule:", schedule);
    }
  };

  const handleToggleSchedule = (id: string) => {
    setSchedules(schedules.map(schedule => 
      schedule.id === id ? { ...schedule, enabled: !schedule.enabled } : schedule
    ));
  };

  const handleDeleteSchedule = (id: string) => {
    setSchedules(schedules.filter(schedule => schedule.id !== id));
    console.log("Deleted schedule:", id);
  };

  const calculateNextRun = (frequency: string, time: string): string => {
    const now = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    const nextRun = new Date(now);
    nextRun.setHours(hours, minutes, 0, 0);
    
    if (frequency === 'daily') {
      if (nextRun <= now) nextRun.setDate(nextRun.getDate() + 1);
    } else if (frequency === 'weekly') {
      nextRun.setDate(nextRun.getDate() + (7 - nextRun.getDay()));
    } else if (frequency === 'monthly') {
      nextRun.setMonth(nextRun.getMonth() + 1, 1);
    }
    
    return nextRun.toISOString().slice(0, 16).replace('T', ' ');
  };

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'daily': return 'bg-green-500';
      case 'weekly': return 'bg-blue-500';
      case 'monthly': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getBackupTypeColor = (type: string) => {
    switch (type) {
      case 'full': return 'bg-red-500';
      case 'incremental': return 'bg-orange-500';
      case 'differential': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create New Schedule
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="scheduleName">Schedule Name</Label>
              <Input
                id="scheduleName"
                value={newSchedule.name || ""}
                onChange={(e) => setNewSchedule({ ...newSchedule, name: e.target.value })}
                placeholder="Enter schedule name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="scheduleTime">Time</Label>
              <Input
                id="scheduleTime"
                type="time"
                value={newSchedule.time || "00:00"}
                onChange={(e) => setNewSchedule({ ...newSchedule, time: e.target.value })}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Frequency</Label>
              <Select value={newSchedule.frequency || "daily"} onValueChange={(value) => setNewSchedule({ ...newSchedule, frequency: value as any })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Backup Type</Label>
              <Select value={newSchedule.backupType || "incremental"} onValueChange={(value) => setNewSchedule({ ...newSchedule, backupType: value as any })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">Full Backup</SelectItem>
                  <SelectItem value="incremental">Incremental</SelectItem>
                  <SelectItem value="differential">Differential</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={handleAddSchedule} className="w-full">
            <Save className="w-4 h-4 mr-2" />
            Create Schedule
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Active Schedules
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {schedules.map((schedule) => (
              <div key={schedule.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium">{schedule.name}</h4>
                    <Badge className={getFrequencyColor(schedule.frequency)}>
                      {schedule.frequency}
                    </Badge>
                    <Badge className={getBackupTypeColor(schedule.backupType)}>
                      {schedule.backupType}
                    </Badge>
                    <Badge variant={schedule.enabled ? "default" : "secondary"}>
                      {schedule.enabled ? "Active" : "Disabled"}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Time: {schedule.time}</p>
                    <p>Next Run: {schedule.nextRun}</p>
                    {schedule.lastRun && <p>Last Run: {schedule.lastRun}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={schedule.enabled}
                    onCheckedChange={() => handleToggleSchedule(schedule.id)}
                  />
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteSchedule(schedule.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
