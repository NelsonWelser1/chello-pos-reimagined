
import { SalesDashboard } from "@/components/sales/SalesDashboard";
import { SalesTransactions } from "@/components/sales/SalesTransactions";
import { SalesReports } from "@/components/sales/SalesReports";
import { SalesAnalytics } from "@/components/sales/SalesAnalytics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, TrendingUp, Receipt, BarChart3 } from "lucide-react";

export default function Sales() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-5xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center justify-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
              <DollarSign className="w-10 h-10 text-white" />
            </div>
            Sales Management Center
          </h1>
          <p className="text-xl text-slate-600 mt-4 font-medium">Complete sales analytics, transactions, and reporting</p>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="dashboard" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm border shadow-xl h-16">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white flex items-center gap-2 text-base font-bold">
              <TrendingUp className="w-5 h-5" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="transactions" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-teal-600 data-[state=active]:text-white flex items-center gap-2 text-base font-bold">
              <Receipt className="w-5 h-5" />
              Transactions
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-600 data-[state=active]:text-white flex items-center gap-2 text-base font-bold">
              <BarChart3 className="w-5 h-5" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white flex items-center gap-2 text-base font-bold">
              <DollarSign className="w-5 h-5" />
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <SalesDashboard />
          </TabsContent>

          <TabsContent value="transactions">
            <SalesTransactions />
          </TabsContent>

          <TabsContent value="analytics">
            <SalesAnalytics />
          </TabsContent>

          <TabsContent value="reports">
            <SalesReports />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
