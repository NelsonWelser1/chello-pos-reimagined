
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner";
import Index from './pages/Index';
import Sales from './pages/Sales';
import Items from './pages/Items';
import Ingredients from './pages/Ingredients';
import Categories from './pages/Categories';
import Modifiers from './pages/Modifiers';
import ExpenseTypes from './pages/ExpenseTypes';
import Expenses from './pages/Expenses';
import TaxReports from './pages/TaxReports';
import OverallReports from './pages/OverallReports';
import POS from './pages/POS';
import Kitchen from './pages/Kitchen';
import StockAlert from './pages/StockAlert';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/items" element={<Items />} />
          <Route path="/ingredients" element={<Ingredients />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/modifiers" element={<Modifiers />} />
          <Route path="/expense-types" element={<ExpenseTypes />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/tax-reports" element={<TaxReports />} />
          <Route path="/overall-reports" element={<OverallReports />} />
          <Route path="/pos" element={<POS />} />
          <Route path="/kitchen" element={<Kitchen />} />
          <Route path="/stock-alert" element={<StockAlert />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
