
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Items from "./pages/Items";
import Categories from "./pages/Categories";
import Ingredients from "./pages/Ingredients";
import Modifiers from "./pages/Modifiers";
import Staff from "./pages/Staff";
import Customers from "./pages/Customers";
import POS from "./pages/POS";
import Orders from "./pages/Orders";
import Kitchen from "./pages/Kitchen";
import Sales from "./pages/Sales";
import ExpenseTypes from "./pages/ExpenseTypes";
import Expenses from "./pages/Expenses";
import TaxReports from "./pages/TaxReports";
import OverallReports from "./pages/OverallReports";
import StockAlert from "./pages/StockAlert";
import PaymentMethods from "./pages/PaymentMethods";
import ServiceTables from "./pages/ServiceTables";
import PickupPoints from "./pages/PickupPoints";
import Backup from "./pages/Backup";
import ImportsExports from "./pages/ImportsExports";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/items" element={<Items />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/ingredients" element={<Ingredients />} />
          <Route path="/modifiers" element={<Modifiers />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/pos" element={<POS />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/kitchen" element={<Kitchen />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/expense-types" element={<ExpenseTypes />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/tax-reports" element={<TaxReports />} />
          <Route path="/overall-reports" element={<OverallReports />} />
          <Route path="/stock-alert" element={<StockAlert />} />
          <Route path="/payment-methods" element={<PaymentMethods />} />
          <Route path="/service-tables" element={<ServiceTables />} />
          <Route path="/pickup-points" element={<PickupPoints />} />
          <Route path="/backup" element={<Backup />} />
          <Route path="/imports-exports" element={<ImportsExports />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
