
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { FileText, Calculator, Shield, History, DollarSign } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import TaxReportsOverview from "@/components/tax-reports/TaxReportsOverview";
import TaxReportsFilings from "@/components/tax-reports/TaxReportsFilings";
import TaxReportsDeductions from "@/components/tax-reports/TaxReportsDeductions";
import TaxReportsCompliance from "@/components/tax-reports/TaxReportsCompliance";
import TaxReportsAudit from "@/components/tax-reports/TaxReportsAudit";
import ExpenseReport from "@/components/tax-reports/ExpenseReport";

export default function TaxReports() {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Default props for the tax report components
  const selectedPeriod = "2024-Q2";
  const selectedTaxType = "sales-tax";

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  🧾 Tax Reports & Compliance
                </h1>
                <p className="text-muted-foreground mt-2">
                  Comprehensive tax reporting, compliance monitoring, and expense analytics
                </p>
              </div>
              <SidebarTrigger />
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="filings" className="flex items-center gap-2">
                  <Calculator className="w-4 h-4" />
                  Tax Filings
                </TabsTrigger>
                <TabsTrigger value="deductions" className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Deductions
                </TabsTrigger>
                <TabsTrigger value="compliance" className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Compliance
                </TabsTrigger>
                <TabsTrigger value="audit" className="flex items-center gap-2">
                  <History className="w-4 h-4" />
                  Audit Trail
                </TabsTrigger>
                <TabsTrigger value="expense-report" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Expense Report
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <TaxReportsOverview selectedPeriod={selectedPeriod} selectedTaxType={selectedTaxType} />
              </TabsContent>

              <TabsContent value="filings">
                <TaxReportsFilings selectedPeriod={selectedPeriod} />
              </TabsContent>

              <TabsContent value="deductions">
                <TaxReportsDeductions selectedPeriod={selectedPeriod} />
              </TabsContent>

              <TabsContent value="compliance">
                <TaxReportsCompliance selectedPeriod={selectedPeriod} />
              </TabsContent>

              <TabsContent value="audit">
                <TaxReportsAudit selectedPeriod={selectedPeriod} />
              </TabsContent>

              <TabsContent value="expense-report">
                <ExpenseReport />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
