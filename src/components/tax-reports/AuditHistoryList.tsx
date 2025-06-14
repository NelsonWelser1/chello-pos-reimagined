
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";
import { AuditRecord } from "./ComplianceHelpers";

interface AuditHistoryListProps {
  auditHistory: AuditRecord[];
}

export default function AuditHistoryList({ auditHistory }: AuditHistoryListProps) {
  return (
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
  );
}
