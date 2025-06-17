
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, Plus, Settings, Mail, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";

interface ScheduledReport {
  id: string;
  name: string;
  type: string;
  frequency: string;
  time: string;
  recipients: string[];
  active: boolean;
  lastRun?: string;
  nextRun: string;
}

export function ScheduledReports() {
  const [scheduledReports, setScheduledReports] = useState<ScheduledReport[]>([
    {
      id: "1",
      name: "Daily Sales Summary",
      type: "sales-summary",
      frequency: "daily",
      time: "23:00",
      recipients: ["manager@restaurant.com"],
      active: true,
      lastRun: "2024-06-16",
      nextRun: "2024-06-17 23:00"
    },
    {
      id: "2",
      name: "Weekly Performance Report",
      type: "performance",
      frequency: "weekly",
      time: "09:00",
      recipients: ["owner@restaurant.com", "manager@restaurant.com"],
      active: true,
      lastRun: "2024-06-10",
      nextRun: "2024-06-17 09:00"
    },
    {
      id: "3",
      name: "Monthly Financial Analysis",
      type: "financial",
      frequency: "monthly",
      time: "08:00",
      recipients: ["accountant@restaurant.com"],
      active: false,
      nextRun: "2024-07-01 08:00"
    }
  ]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newReport, setNewReport] = useState({
    name: "",
    type: "sales-summary",
    frequency: "daily",
    time: "09:00",
    recipients: "",
    active: true
  });

  const toggleReportStatus = (id: string) => {
    setScheduledReports(prev => 
      prev.map(report => 
        report.id === id 
          ? { ...report, active: !report.active }
          : report
      )
    );
    toast.success("Report schedule updated");
  };

  const deleteReport = (id: string) => {
    setScheduledReports(prev => prev.filter(report => report.id !== id));
    toast.success("Scheduled report deleted");
  };

  const createNewReport = () => {
    if (!newReport.name || !newReport.recipients) {
      toast.error("Please fill in all required fields");
      return;
    }

    const report: ScheduledReport = {
      id: Date.now().toString(),
      name: newReport.name,
      type: newReport.type,
      frequency: newReport.frequency,
      time: newReport.time,
      recipients: newReport.recipients.split(',').map(email => email.trim()),
      active: newReport.active,
      nextRun: getNextRunTime(newReport.frequency, newReport.time)
    };

    setScheduledReports(prev => [...prev, report]);
    setNewReport({
      name: "",
      type: "sales-summary",
      frequency: "daily",
      time: "09:00",
      recipients: "",
      active: true
    });
    setIsCreateDialogOpen(false);
    toast.success("New scheduled report created");
  };

  const getNextRunTime = (frequency: string, time: string) => {
    const now = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    
    let nextRun = new Date(now);
    nextRun.setHours(hours, minutes, 0, 0);
    
    if (nextRun <= now) {
      switch (frequency) {
        case 'daily':
          nextRun.setDate(nextRun.getDate() + 1);
          break;
        case 'weekly':
          nextRun.setDate(nextRun.getDate() + 7);
          break;
        case 'monthly':
          nextRun.setMonth(nextRun.getMonth() + 1);
          break;
      }
    }
    
    return nextRun.toLocaleString();
  };

  const getFrequencyBadgeColor = (frequency: string) => {
    switch (frequency) {
      case 'daily': return 'bg-green-100 text-green-800';
      case 'weekly': return 'bg-blue-100 text-blue-800';
      case 'monthly': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-green-50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-xl font-black text-slate-800">
            <Calendar className="w-6 h-6 text-green-600" />
            Scheduled Reports
          </CardTitle>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                <Plus className="w-4 h-4 mr-2" />
                New Schedule
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create Scheduled Report</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Report Name</label>
                  <Input
                    value={newReport.name}
                    onChange={(e) => setNewReport(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Daily Sales Summary"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Report Type</label>
                    <Select value={newReport.type} onValueChange={(value) => setNewReport(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sales-summary">Sales Summary</SelectItem>
                        <SelectItem value="performance">Performance</SelectItem>
                        <SelectItem value="financial">Financial</SelectItem>
                        <SelectItem value="customer">Customer Analysis</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Frequency</label>
                    <Select value={newReport.frequency} onValueChange={(value) => setNewReport(prev => ({ ...prev, frequency: value }))}>
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
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Time</label>
                  <Input
                    type="time"
                    value={newReport.time}
                    onChange={(e) => setNewReport(prev => ({ ...prev, time: e.target.value }))}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Recipients (comma-separated emails)</label>
                  <Input
                    value={newReport.recipients}
                    onChange={(e) => setNewReport(prev => ({ ...prev, recipients: e.target.value }))}
                    placeholder="manager@restaurant.com, owner@restaurant.com"
                  />
                </div>
                
                <div className="flex items-center justify-between pt-4">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={createNewReport}>
                    Create Schedule
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {scheduledReports.map((report) => (
            <div key={report.id} className="p-6 bg-white/70 rounded-xl shadow-sm border-2 border-transparent hover:border-green-200 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-black text-lg text-slate-800">{report.name}</h4>
                    <Badge className={`font-bold ${getFrequencyBadgeColor(report.frequency)}`}>
                      {report.frequency}
                    </Badge>
                    <Switch
                      checked={report.active}
                      onCheckedChange={() => toggleReportStatus(report.id)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Recipients:</span> {report.recipients.length} email{report.recipients.length !== 1 ? 's' : ''}
                    </div>
                    <div>
                      <span className="font-medium">Time:</span> {report.time}
                    </div>
                    <div>
                      <span className="font-medium">Next Run:</span> {report.nextRun}
                    </div>
                    {report.lastRun && (
                      <div>
                        <span className="font-medium">Last Run:</span> {report.lastRun}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => deleteReport(report.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Mail className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg text-sm">
                <div className="font-medium text-gray-700 mb-1">Recipients:</div>
                <div className="text-gray-600">{report.recipients.join(', ')}</div>
              </div>
            </div>
          ))}
          
          {scheduledReports.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No scheduled reports yet</p>
              <p>Create your first scheduled report to automate your reporting workflow</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
