
import ComplianceOverviewCards from "./ComplianceOverviewCards";
import ComplianceRequirementsList from "./ComplianceRequirementsList";
import AuditHistoryList from "./AuditHistoryList";

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
  const upcomingDeadlines = 3;

  return (
    <div className="space-y-6">
      {/* Compliance Overview */}
      <ComplianceOverviewCards 
        complianceScore={complianceScore}
        riskLevel={riskLevel}
        upcomingDeadlines={upcomingDeadlines}
      />

      {/* Compliance Requirements */}
      <ComplianceRequirementsList complianceItems={complianceItems} />

      {/* Audit History */}
      <AuditHistoryList auditHistory={auditHistory} />
    </div>
  );
}
