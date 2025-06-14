
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Shield, Search, Filter, Eye, Download, FileText, 
  Clock, User, Edit, Trash2, Archive
} from "lucide-react";
import { useState } from "react";

interface TaxReportsAuditProps {
  selectedPeriod: string;
}

export default function TaxReportsAudit({ selectedPeriod }: TaxReportsAuditProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const auditTrail = [
    {
      id: "AUD-2024-001",
      timestamp: "2024-06-14T15:30:00Z",
      action: "Tax Filing Submitted",
      type: "filing",
      user: "John Manager",
      description: "Monthly Sales Tax Return for June 2024 submitted electronically",
      amount: 3890,
      referenceId: "FIL-2024-001",
      ipAddress: "192.168.1.100",
      status: "success"
    },
    {
      id: "AUD-2024-002",
      timestamp: "2024-06-14T10:15:00Z",
      action: "Deduction Recorded",
      type: "deduction",
      user: "Sarah Accountant",
      description: "Equipment maintenance expense added to tax deductions",
      amount: 1250,
      referenceId: "EXP-2024-145",
      ipAddress: "192.168.1.101",
      status: "success"
    },
    {
      id: "AUD-2024-003",
      timestamp: "2024-06-13T16:45:00Z",
      action: "Tax Calculation Updated",
      type: "calculation",
      user: "System Auto",
      description: "Quarterly tax liability recalculated due to expense adjustment",
      amount: 12450,
      referenceId: "CALC-2024-Q2",
      ipAddress: "127.0.0.1",
      status: "success"
    },
    {
      id: "AUD-2024-004",
      timestamp: "2024-06-13T14:20:00Z",
      action: "Document Upload",
      type: "document",
      user: "Mike Assistant",
      description: "Receipt uploaded for marketing expense deduction",
      amount: 450,
      referenceId: "DOC-2024-089",
      ipAddress: "192.168.1.102",
      status: "success"
    },
    {
      id: "AUD-2024-005",
      timestamp: "2024-06-12T11:30:00Z",
      action: "Tax Payment Processed",
      type: "payment",
      user: "John Manager",
      description: "Electronic payment for quarterly estimated tax",
      amount: 8900,
      referenceId: "PAY-2024-034",
      ipAddress: "192.168.1.100",
      status: "success"
    },
    {
      id: "AUD-2024-006",
      timestamp: "2024-06-12T09:15:00Z",
      action: "Failed Login Attempt",
      type: "security",
      user: "Unknown",
      description: "Multiple failed login attempts to tax filing system",
      amount: 0,
      referenceId: "SEC-2024-012",
      ipAddress: "203.45.67.89",
      status: "failed"
    },
    {
      id: "AUD-2024-007",
      timestamp: "2024-06-11T13:45:00Z",
      action: "Report Generated",
      type: "report",
      user: "Sarah Accountant",
      description: "Tax deduction summary report generated for Q2 2024",
      amount: 0,
      referenceId: "RPT-2024-023",
      ipAddress: "192.168.1.101",
      status: "success"
    },
    {
      id: "AUD-2024-008",
      timestamp: "2024-06-10T16:00:00Z",
      action: "Compliance Check",
      type: "compliance",
      user: "System Auto",
      description: "Automated compliance verification completed successfully",
      amount: 0,
      referenceId: "COMP-2024-156",
      ipAddress: "127.0.0.1",
      status: "success"
    }
  ];

  const getActionIcon = (type: string) => {
    switch (type) {
      case "filing":
        return <FileText className="w-5 h-5 text-blue-600" />;
      case "deduction":
        return <Edit className="w-5 h-5 text-green-600" />;
      case "calculation":
        return <Shield className="w-5 h-5 text-purple-600" />;
      case "document":
        return <Archive className="w-5 h-5 text-orange-600" />;
      case "payment":
        return <Clock className="w-5 h-5 text-emerald-600" />;
      case "security":
        return <Shield className="w-5 h-5 text-red-600" />;
      case "report":
        return <Download className="w-5 h-5 text-indigo-600" />;
      case "compliance":
        return <Shield className="w-5 h-5 text-cyan-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-800">Success</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const filteredAuditTrail = auditTrail.filter(entry => {
    const matchesSearch = entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.action.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || entry.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Audit Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Activities</p>
                <p className="text-2xl font-bold text-blue-600">{auditTrail.length}</p>
              </div>
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Security Events</p>
                <p className="text-2xl font-bold text-red-600">
                  {auditTrail.filter(a => a.type === "security").length}
                </p>
              </div>
              <Shield className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold text-green-600">
                  {new Set(auditTrail.filter(a => a.user !== "System Auto").map(a => a.user)).size}
                </p>
              </div>
              <User className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold text-purple-600">
                  {((auditTrail.filter(a => a.status === "success").length / auditTrail.length) * 100).toFixed(1)}%
                </p>
              </div>
              <FileText className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audit Trail */}
      <Card className="shadow-xl border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-blue-600" />
              Tax Activity Audit Trail
            </CardTitle>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600">
              <Download className="w-4 h-4 mr-2" />
              Export Audit Log
            </Button>
          </div>
          
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search audit trail..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Activities</SelectItem>
                <SelectItem value="filing">Tax Filings</SelectItem>
                <SelectItem value="deduction">Deductions</SelectItem>
                <SelectItem value="payment">Payments</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="compliance">Compliance</SelectItem>
                <SelectItem value="document">Documents</SelectItem>
                <SelectItem value="report">Reports</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAuditTrail.map((entry, index) => (
              <div key={index} className={`p-4 border rounded-lg hover:shadow-md transition-shadow ${
                entry.status === "failed" ? "border-red-200 bg-red-50" : ""
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {getActionIcon(entry.type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{entry.action}</h4>
                        {getStatusBadge(entry.status)}
                        <Badge variant="outline">{entry.type}</Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">{entry.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-muted-foreground">
                        <div>
                          <span className="font-medium">Time:</span>
                          <p>{formatTimestamp(entry.timestamp)}</p>
                        </div>
                        <div>
                          <span className="font-medium">User:</span>
                          <p>{entry.user}</p>
                        </div>
                        <div>
                          <span className="font-medium">Reference:</span>
                          <p>{entry.referenceId}</p>
                        </div>
                        <div>
                          <span className="font-medium">IP Address:</span>
                          <p>{entry.ipAddress}</p>
                        </div>
                      </div>
                      
                      {entry.amount > 0 && (
                        <div className="mt-2">
                          <Badge variant="outline">Amount: ${entry.amount.toLocaleString()}</Badge>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredAuditTrail.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No audit entries found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
