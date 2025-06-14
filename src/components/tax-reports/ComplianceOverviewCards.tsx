
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, Target, Calendar
} from "lucide-react";
import { getRiskLevelBadgeVariant } from "./ComplianceHelpers";

interface ComplianceOverviewCardsProps {
  complianceScore: number;
  riskLevel: "Low" | "Medium" | "High";
  upcomingDeadlines: number;
}

export default function ComplianceOverviewCards({ 
  complianceScore, 
  riskLevel, 
  upcomingDeadlines 
}: ComplianceOverviewCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="shadow-xl border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <Badge variant={complianceScore >= 85 ? "default" : "destructive"} className="font-bold">
              {complianceScore}%
            </Badge>
          </div>
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Compliance Score</h3>
              <p className="text-3xl font-black text-slate-800">{complianceScore}%</p>
            </div>
            <Progress value={complianceScore} className="h-2" />
            <p className="text-xs text-muted-foreground">Overall tax compliance rating</p>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-xl border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            <Badge variant={getRiskLevelBadgeVariant(riskLevel)} className="font-bold">
              {riskLevel}
            </Badge>
          </div>
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Risk Level</h3>
              <p className="text-3xl font-black text-slate-800">{riskLevel}</p>
            </div>
            <p className="text-xs text-muted-foreground">Based on compliance history and current status</p>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-xl border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <Badge variant="secondary" className="font-bold">
              {upcomingDeadlines} Due
            </Badge>
          </div>
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Upcoming Deadlines</h3>
              <p className="text-3xl font-black text-slate-800">{upcomingDeadlines}</p>
            </div>
            <p className="text-xs text-muted-foreground">Next 30 days</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
