import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import { Target, Plus, TrendingUp, Calendar, DollarSign, Trophy, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useSalesTargets } from "@/hooks/useSalesTargets";

interface SalesTarget {
  id: string;
  target_name: string;
  target_type: string;
  target_amount: number;
  current_amount: number;
  target_date: string;
  achieved: boolean;
  staff_id?: string;
  created_at: string;
  updated_at: string;
}

export function SalesTargetManager() {
  const { targets, loading, createTarget, updateTarget, refetch } = useSalesTargets();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTarget, setNewTarget] = useState({
    target_name: '',
    target_type: 'daily',
    target_amount: 0,
    target_date: new Date().toISOString().split('T')[0]
  });

  const handleCreateTarget = async () => {
    if (!newTarget.target_name || newTarget.target_amount <= 0) {
      toast.error("Please fill in all fields correctly");
      return;
    }

    try {
      await createTarget(newTarget);
      toast.success("Sales target created successfully!");
      setIsDialogOpen(false);
      setNewTarget({
        target_name: '',
        target_type: 'daily',
        target_amount: 0,
        target_date: new Date().toISOString().split('T')[0]
      });
      refetch();
    } catch (error) {
      toast.error("Failed to create sales target");
    }
  };

  const getTargetProgress = (target: SalesTarget) => {
    return Math.min((target.current_amount / target.target_amount) * 100, 100);
  };

  const getTargetStatus = (target: SalesTarget) => {
    const progress = getTargetProgress(target);
    if (target.achieved) return { label: "Achieved", color: "bg-green-500", textColor: "text-green-700" };
    if (progress >= 80) return { label: "On Track", color: "bg-blue-500", textColor: "text-blue-700" };
    if (progress >= 50) return { label: "In Progress", color: "bg-yellow-500", textColor: "text-yellow-700" };
    return { label: "Behind", color: "bg-red-500", textColor: "text-red-700" };
  };

  if (loading) {
    return (
      <Card className="shadow-xl border-0">
        <CardContent className="p-8 text-center">
          <div className="text-lg text-slate-600">Loading sales targets...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-indigo-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-2xl font-black text-slate-800">
              <Target className="w-7 h-7 text-indigo-600" />
              Sales Targets
            </CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 font-bold">
                  <Plus className="w-5 h-5 mr-2" />
                  Add Target
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Sales Target</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Target Name</label>
                    <Input
                      placeholder="e.g., Daily Revenue Goal"
                      value={newTarget.target_name}
                      onChange={(e) => setNewTarget({ ...newTarget, target_name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Target Type</label>
                    <Select value={newTarget.target_type} onValueChange={(value) => setNewTarget({ ...newTarget, target_type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Target Amount (UGX)</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={newTarget.target_amount}
                      onChange={(e) => setNewTarget({ ...newTarget, target_amount: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Target Date</label>
                    <Input
                      type="date"
                      value={newTarget.target_date}
                      onChange={(e) => setNewTarget({ ...newTarget, target_date: e.target.value })}
                    />
                  </div>
                  <Button onClick={handleCreateTarget} className="w-full">
                    Create Target
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {targets.map((target) => {
          const progress = getTargetProgress(target);
          const status = getTargetStatus(target);
          
          return (
            <Card key={target.id} className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-black text-slate-800 mb-1">{target.target_name}</h3>
                    <Badge className={`${status.color} text-white font-bold`}>
                      {status.label}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-indigo-600">
                      {progress.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600 font-medium">
                      {target.target_type}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <Progress value={progress} className="h-3" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-600">Current</span>
                    <span className="font-black text-green-600">
                      UGX {target.current_amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-600">Target</span>
                    <span className="font-black text-blue-600">
                      UGX {target.target_amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-600">Remaining</span>
                    <span className="font-black text-orange-600">
                      UGX {Math.max(0, target.target_amount - target.current_amount).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-600">Due Date</span>
                    <span className="font-bold text-slate-700">
                      {new Date(target.target_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {target.achieved && (
                  <div className="mt-4 p-3 bg-green-100 rounded-xl flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-green-600" />
                    <span className="font-bold text-green-700">Target Achieved!</span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {targets.length === 0 && (
        <Card className="shadow-xl border-0">
          <CardContent className="p-12 text-center">
            <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-black text-slate-800 mb-2">No Sales Targets</h3>
            <p className="text-gray-600 mb-6">Create your first sales target to start tracking performance</p>
            <Button onClick={() => setIsDialogOpen(true)} className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 font-bold">
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Target
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}