
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Download, FileText, Calendar, AlertTriangle, Receipt, 
  DollarSign, Calculator, BookOpen, Target, TrendingUp
} from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import TaxReportsOverview from "@/components/tax-reports/TaxReportsOverview";
import TaxReportsCompliance from "@/components/tax-reports/TaxReportsCompliance";
import TaxReportsDeductions from "@/components/tax-reports/TaxReportsDeductions";
import TaxReportsFilings from "@/components/tax-reports/TaxReportsFilings";
import TaxReportsAudit from "@/components/tax-reports/TaxReportsAudit";

export default function TaxReports() {
  const [selectedPeriod, setSelectedPeriod] = useState("current-year");
  const [selectedTaxType, setSelectedTaxType] = useState("all");

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  📊 Tax Reports & Compliance
                </h1>
                <p className="text-muted-foreground mt-2">
                  Comprehensive tax reporting, compliance tracking, and audit preparation
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current-year">Current Year</SelectItem>
                    <SelectItem value="previous-year">Previous Year</SelectItem>
                    <SelectItem value="q1">Q1 2024</SelectItem>
                    <SelectItem value="q2">Q2 2024</SelectItem>
                    <SelectItem value="q3">Q3 2024</SelectItem>
                    <SelectItem value="q4">Q4 2024</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedTaxType} onValueChange={setSelectedTaxType}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Tax type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Taxes</SelectItem>
                    <SelectItem value="sales">Sales Tax</SelectItem>
                    <SelectItem value="income">Income Tax</SelectItem>
                    <SelectItem value="payroll">Payroll Tax</SelectItem>
                    <SelectItem value="property">Property Tax</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="bg-gradient-to-r from-green-500 to-blue-600">
                  <Download className="w-4 h-4 mr-2" />
                  Export Tax Report
                </Button>
                <SidebarTrigger />
              </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="compliance" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Compliance
                </TabsTrigger>
                <TabsTrigger value="deductions" className="flex items-center gap-2">
                  <Calculator className="w-4 h-4" />
                  Deductions
                </TabsTrigger>
                <TabsTrigger value="filings" className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Filings
                </TabsTrigger>
                <TabsTrigger value="audit" className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Audit Trail
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <TaxReportsOverview selectedPeriod={selectedPeriod} selectedTaxType={selectedTaxType} />
              </TabsContent>

              <TabsContent value="compliance" className="space-y-6">
                <TaxReportsCompliance selectedPeriod={selectedPeriod} />
              </TabsContent>

              <TabsContent value="deductions" className="space-y-6">
                <TaxReportsDeductions selectedPeriod={selectedPeriod} />
              </TabsContent>

              <TabsContent value="filings" className="space-y-6">
                <TaxReportsFilings selectedPeriod={selectedPeriod} />
              </TabsContent>

              <TabsContent value="audit" className="space-y-6">
                <TaxReportsAudit selectedPeriod={selectedPeriod} />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
