
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
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
import StockAlert from "./pages/StockAlert";
import PaymentMethods from "./pages/PaymentMethods";
import ServiceTables from "./pages/ServiceTables";

import Backup from "./pages/Backup";
import ImportsExports from "./pages/ImportsExports";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
          <Route path="/items" element={<ProtectedRoute><Items /></ProtectedRoute>} />
          <Route path="/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
          <Route path="/ingredients" element={<ProtectedRoute><Ingredients /></ProtectedRoute>} />
          <Route path="/modifiers" element={<ProtectedRoute><Modifiers /></ProtectedRoute>} />
          <Route path="/staff" element={<ProtectedRoute><Staff /></ProtectedRoute>} />
          <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
          <Route path="/pos" element={<ProtectedRoute><POS /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/kitchen" element={<ProtectedRoute><Kitchen /></ProtectedRoute>} />
          <Route path="/sales" element={<ProtectedRoute><Sales /></ProtectedRoute>} />
          <Route path="/expense-types" element={<ProtectedRoute><ExpenseTypes /></ProtectedRoute>} />
          <Route path="/expenses" element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
          <Route path="/stock-alert" element={<ProtectedRoute><StockAlert /></ProtectedRoute>} />
          <Route path="/payment-methods" element={<ProtectedRoute><PaymentMethods /></ProtectedRoute>} />
          <Route path="/service-tables" element={<ProtectedRoute><ServiceTables /></ProtectedRoute>} />
          
          <Route path="/backup" element={<ProtectedRoute><Backup /></ProtectedRoute>} />
          <Route path="/imports-exports" element={<ProtectedRoute><ImportsExports /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
