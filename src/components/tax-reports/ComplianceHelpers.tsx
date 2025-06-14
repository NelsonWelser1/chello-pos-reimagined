
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, AlertTriangle, XCircle, Clock
} from "lucide-react";

export const getRiskLevelBadgeVariant = (risk: "Low" | "Medium" | "High") => {
  switch (risk) {
    case "Low":
      return "default";
    case "Medium":
      return "secondary";
    case "High":
      return "destructive";
    default:
      return "secondary";
  }
};

export const getStatusIcon = (status: string) => {
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

export const getStatusBadge = (status: string) => {
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

export interface ComplianceItem {
  requirement: string;
  status: string;
  lastUpdate: string;
  nextDeadline: string;
  description: string;
  risk: string;
}

export interface AuditRecord {
  year: string;
  type: string;
  status: string;
  outcome: string;
  amount: number;
  date: string;
}
