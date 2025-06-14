import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, AlertTriangle, XCircle, Clock, FileText, 
  Shield, Target, Calendar, BookOpen
} from "lucide-react";

interface TaxReportsComplianceProps {
  selectedPeriod: string;
}

export default function TaxReportsCompliance({ selectedPeriod }: TaxReportsComplianceProps) {
  const complianceItems = [
    {
      requirement: "Sales Tax Registration",
      status: "compliant",
      lastUpdate: "2024-01-15",
      nextDeadline: "2025-01-15",
      description: "Valid sales tax permit and registration",
      risk: "low"
    },
    {
      requirement: "Monthly Sales Tax Filing",
      status: "compliant",
      lastUpdate: "2024-06-15",
      nextDeadline: "2024-07-15",
      description: "Timely monthly sales tax returns",
      risk: "low"
    },
    {
      requirement: "Quarterly Payroll Tax",
      status: "warning",
      lastUpdate: "2024-03-15",
      nextDeadline: "2024-06-15",
      description: "Quarterly payroll tax filings - due soon",
      risk: "medium"
    },
    {
      requirement: "Worker Classification Review",
      status: "non-compliant",
      lastUpdate: "2023-12-01",
      nextDeadline: "2024-07-01",
      description: "Annual review of employee vs contractor classification",
      risk: "high"
    },
    {
      requirement: "Business License Renewal",
      status: "pending",
      lastUpdate: "2024-05-01",
      nextDeadline: "2024-08-31",
      description: "Annual business license renewal required",
      risk: "medium"
    }
  ];

  const auditHistory = [
    {
      year: "2023",
      type: "Sales Tax Audit",
      status: "completed",
      outcome: "No adjustments",
      amount: 0,
      date: "2023-11-15"
    },
    {
      year: "2022",
      type: "Payroll Tax Review",
      status: "completed",
      outcome: "Minor adjustment",
      amount: 450,
      date: "2022-09-20"
    },
    {
      year: "2021",
      type: "Income Tax Audit",
      status: "completed",
      outcome: "Refund issued",
      amount: -1200,
      date: "2021-12-10"
    }
  ];

  const complianceScore = 82;
  const riskLevel: "Low" | "Medium" | "High" = "Medium";

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "compliant":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case "non-compliant":
        return <XCircle className="w-5 h-5 text-red-600" />;
      case "pending":
        return <Clock className="w-5 h-5 text-blue-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "compliant":
        return <Badge variant="default" className="bg-green-100 text-green-800">Compliant</Badge>;
      case "warning":
        return <Badge variant="default" className="bg-orange-100 text-orange-800">Warning</Badge>;
      case "non-compliant":
        return <Badge variant="destructive">Non-Compliant</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Compliance Overview */}
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
              <Badge variant={riskLevel === "Low" ? "default" : riskLevel === "Medium" ? "secondary" : "destructive"} className="font-bold">
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
                3 Due
              </Badge>
            </div>
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Upcoming Deadlines</h3>
                <p className="text-3xl font-black text-slate-800">3</p>
              </div>
              <p className="text-xs text-muted-foreground">Next 30 days</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Requirements */}
      <Card className="shadow-xl border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-blue-600" />
            Tax Compliance Requirements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {complianceItems.map((item, index) => (
              <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {getStatusIcon(item.status)}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{item.requirement}</h4>
                        {getStatusBadge(item.status)}
                        <Badge variant={item.risk === "high" ? "destructive" : item.risk === "medium" ? "secondary" : "default"}>
                          {item.risk} risk
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Last Update: {item.lastUpdate}</span>
                        <span>Next Deadline: {item.nextDeadline}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Audit History */}
      <Card className="shadow-xl border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-purple-600" />
            Audit History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {auditHistory.map((audit, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <h4 className="font-medium">{audit.type} ({audit.year})</h4>
                    <Badge variant={audit.status === "completed" ? "default" : "secondary"}>
                      {audit.status}
                    </Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">{audit.date}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{audit.outcome}</span>
                  <div className={`font-bold ${audit.amount < 0 ? 'text-green-600' : audit.amount > 0 ? 'text-red-600' : 'text-gray-600'}`}>
                    {audit.amount === 0 ? 'No adjustment' : 
                     audit.amount < 0 ? `+$${Math.abs(audit.amount)}` : 
                     `$${audit.amount}`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
