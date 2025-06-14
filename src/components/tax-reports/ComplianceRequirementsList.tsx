
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { ComplianceItem, getStatusIcon, getStatusBadge } from "./ComplianceHelpers";

interface ComplianceRequirementsListProps {
  complianceItems: ComplianceItem[];
}

export default function ComplianceRequirementsList({ complianceItems }: ComplianceRequirementsListProps) {
  return (
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
  );
}
