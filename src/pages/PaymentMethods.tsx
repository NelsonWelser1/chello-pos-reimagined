
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { PaymentMethodsHeader } from "@/components/payment-methods/PaymentMethodsHeader";
import { PaymentMethodsList } from "@/components/payment-methods/PaymentMethodsList";
import { PaymentConfiguration } from "@/components/payment-methods/PaymentConfiguration";
import { TransactionHistory } from "@/components/payment-methods/TransactionHistory";
import { PaymentAnalytics } from "@/components/payment-methods/PaymentAnalytics";
import { useState } from "react";

const PaymentMethods = () => {
  const [activeTab, setActiveTab] = useState("methods");

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="space-y-6">
            <PaymentMethodsHeader activeTab={activeTab} setActiveTab={setActiveTab} />
            
            {activeTab === "methods" && <PaymentMethodsList />}
            {activeTab === "configuration" && <PaymentConfiguration />}
            {activeTab === "transactions" && <TransactionHistory />}
            {activeTab === "analytics" && <PaymentAnalytics />}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default PaymentMethods;
