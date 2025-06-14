import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Sales from "./pages/Sales";
import POS from "./pages/POS";
import Kitchen from "./pages/Kitchen";
import Categories from "./pages/Categories";
import Items from "./pages/Items";
import Modifiers from "./pages/Modifiers";
import NotFound from "./pages/NotFound";
import Ingredients from "./pages/Ingredients";
import Expenses from "./pages/Expenses";
import ExpenseTypes from "./pages/ExpenseTypes";
import OverallReports from "./pages/OverallReports";
import TaxReports from "./pages/TaxReports";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/pos" element={<POS />} />
          <Route path="/kitchen" element={<Kitchen />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/items" element={<Items />} />
          <Route path="/modifiers" element={<Modifiers />} />
          <Route path="/ingredients" element={<Ingredients />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/expense-types" element={<ExpenseTypes />} />
          <Route path="/overall-reports" element={<OverallReports />} />
          <Route path="/tax-reports" element={<TaxReports />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
