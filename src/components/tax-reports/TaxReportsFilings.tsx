
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, FileText, Download, Eye, Clock, CheckCircle, 
  AlertTriangle, XCircle, Plus, Upload
} from "lucide-react";

interface TaxReportsFilingsProps {
  selectedPeriod: string;
}

export default function TaxReportsFilings({ selectedPeriod }: TaxReportsFilingsProps) {
  const filings = [
    {
      id: "FIL-2024-001",
      type: "Monthly Sales Tax Return",
      period: "June 2024",
      dueDate: "2024-07-15",
      filedDate: "2024-07-10",
      status: "filed",
      amount: 3890,
      method: "Electronic",
      confirmationNumber: "ST240710001"
    },
    {
      id: "FIL-2024-002",
      type: "Quarterly Payroll Tax",
      period: "Q2 2024",
      dueDate: "2024-07-31",
      filedDate: null,
      status: "pending",
      amount: 12450,
      method: "Electronic",
      confirmationNumber: null
    },
    {
      id: "FIL-2024-003",
      type: "Annual Property Tax",
      period: "2024",
      dueDate: "2024-08-31",
      filedDate: null,
      status: "draft",
      amount: 4850,
      method: "Mail",
      confirmationNumber: null
    },
    {
      id: "FIL-2024-004",
      type: "Monthly Sales Tax Return",
      period: "May 2024",
      dueDate: "2024-06-15",
      filedDate: "2024-06-12",
      status: "filed",
      amount: 4120,
      method: "Electronic",
      confirmationNumber: "ST240612001"
    },
    {
      id: "FIL-2024-005",
      type: "Quarterly Income Tax",
      period: "Q1 2024",
      dueDate: "2024-04-15",
      filedDate: "2024-04-10",
      status: "filed",
      amount: 8900,
      method: "Electronic",
      confirmationNumber: "IT240410001"
    },
    {
      id: "FIL-2024-006",
      type: "Worker Classification Report",
      period: "2024",
      dueDate: "2024-09-30",
      filedDate: null,
      status: "overdue",
      amount: 0,
      method: "Electronic",
      confirmationNumber: null
    }
  ];

  const upcomingFilings = [
    {
      type: "Monthly Sales Tax Return",
      period: "July 2024",
      dueDate: "2024-08-15",
      estimatedAmount: 4200,
      priority: "high"
    },
    {
      type: "Quarterly Payroll Tax",
      period: "Q3 2024",
      dueDate: "2024-10-31",
      estimatedAmount: 13200,
      priority: "medium"
    },
    {
      type: "Annual Business License Renewal",
      period: "2024",
      dueDate: "2024-12-31",
      estimatedAmount: 350,
      priority: "low"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "filed":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "pending":
        return <Clock className="w-5 h-5 text-blue-600" />;
      case "draft":
        return <FileText className="w-5 h-5 text-gray-600" />;
      case "overdue":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "filed":
        return <Badge className="bg-green-100 text-green-800">Filed</Badge>;
      case "pending":
        return <Badge className="bg-blue-100 text-blue-800">Pending</Badge>;
      case "draft":
        return <Badge variant="secondary">Draft</Badge>;
      case "overdue":
        return <Badge variant="destructive">Overdue</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const isOverdue = (dueDate: string, status: string) => {
    if (status === "filed") return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="space-y-6">
      {/* Filing Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Filed This Year</p>
                <p className="text-2xl font-bold text-green-600">
                  {filings.filter(f => f.status === "filed").length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-blue-600">
                  {filings.filter(f => f.status === "pending").length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold text-red-600">
                  {filings.filter(f => f.status === "overdue" || (f.status !== "filed" && isOverdue(f.dueDate, f.status))).length}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-2xl font-bold text-purple-600">
                  ${filings.reduce((sum, f) => sum + f.amount, 0).toLocaleString()}
                </p>
              </div>
              <FileText className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Filings */}
      <Card className="shadow-xl border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-blue-600" />
              Tax Filing History
            </CardTitle>
            <Button className="bg-gradient-to-r from-green-500 to-blue-600">
              <Plus className="w-4 h-4 mr-2" />
              New Filing
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filings.map((filing, index) => (
              <div key={index} className={`p-4 border rounded-lg hover:shadow-md transition-shadow ${
                filing.status === "overdue" || (filing.status !== "filed" && isOverdue(filing.dueDate, filing.status)) 
                  ? "border-red-200 bg-red-50" : ""
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {getStatusIcon(filing.status)}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{filing.type}</h4>
                        {getStatusBadge(filing.status)}
                        <Badge variant="outline">{filing.period}</Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground mb-2">
                        <div>
                          <span className="font-medium">Due Date:</span>
                          <p className={isOverdue(filing.dueDate, filing.status) && filing.status !== "filed" ? "text-red-600" : ""}>
                            {filing.dueDate}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium">Amount:</span>
                          <p>${filing.amount.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="font-medium">Method:</span>
                          <p>{filing.method}</p>
                        </div>
                        <div>
                          <span className="font-medium">Filed:</span>
                          <p>{filing.filedDate || "Not filed"}</p>
                        </div>
                      </div>
                      
                      {filing.confirmationNumber && (
                        <div className="text-xs text-muted-foreground">
                          Confirmation: {filing.confirmationNumber}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    {filing.status === "filed" && (
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    )}
                    {filing.status !== "filed" && (
                      <Button size="sm" className="bg-blue-600">
                        {filing.status === "draft" ? "Complete" : "File Now"}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Filings */}
      <Card className="shadow-xl border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-orange-600" />
            Upcoming Filing Requirements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingFilings.map((filing, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium">{filing.type}</h4>
                      <Badge variant="outline">{filing.period}</Badge>
                      <Badge variant={
                        filing.priority === "high" ? "destructive" :
                        filing.priority === "medium" ? "default" : "secondary"
                      }>
                        {filing.priority} priority
                      </Badge>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <span>Due: {filing.dueDate}</span>
                      <span>Est. Amount: ${filing.estimatedAmount.toLocaleString()}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-1" />
                    Prepare
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
