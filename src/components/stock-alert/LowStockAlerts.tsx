
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, Package, ShoppingCart, Search, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Ingredient {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minimumStock: number;
  unit: string;
  costPerUnit: number;
  supplier: string;
  leadTime: number;
  dailyUsage: number;
}

interface LowStockAlertsProps {
  lowStockItems: Ingredient[];
  alertSettings: {
    lowStockThreshold: number;
    autoReorderEnabled: boolean;
  };
}

export default function LowStockAlerts({ lowStockItems, alertSettings }: LowStockAlertsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedUrgency, setSelectedUrgency] = useState("all");

  const getUrgencyLevel = (item: Ingredient) => {
    const stockRatio = item.currentStock / item.minimumStock;
    if (stockRatio <= 0.2) return 'critical';
    if (stockRatio <= 0.5) return 'high';
    return 'medium';
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredItems = lowStockItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const urgency = getUrgencyLevel(item);
    const matchesUrgency = selectedUrgency === 'all' || urgency === selectedUrgency;
    
    return matchesSearch && matchesCategory && matchesUrgency;
  });

  const categories = [...new Set(lowStockItems.map(item => item.category))];

  const calculateReorderQuantity = (item: Ingredient) => {
    const safetyStock = item.dailyUsage * item.leadTime * 1.5;
    const targetStock = item.minimumStock + safetyStock;
    return Math.max(targetStock - item.currentStock, item.minimumStock);
  };

  return (
    <div className="space-y-6">
      {/* Summary Header */}
      <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3">
            <AlertTriangle className="w-8 h-8" />
            Low Stock Alert Management
          </CardTitle>
          <p className="text-orange-100">
            {lowStockItems.length} items below minimum stock levels require attention
          </p>
        </CardHeader>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search items or suppliers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedUrgency} onValueChange={setSelectedUrgency}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Urgency Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Urgency Levels</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Low Stock Items Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Low Stock Items ({filteredItems.length})
            </CardTitle>
            <div className="flex gap-2">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Bulk Reorder
              </Button>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Export List
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Minimum Stock</TableHead>
                  <TableHead>Urgency</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Lead Time</TableHead>
                  <TableHead>Suggested Reorder</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map(item => {
                  const urgency = getUrgencyLevel(item);
                  const reorderQty = calculateReorderQuantity(item);
                  
                  return (
                    <TableRow key={item.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-gray-500">
                            ${item.costPerUnit.toFixed(2)} per {item.unit}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getUrgencyColor(urgency)}`}></div>
                          <span className="font-medium">{item.currentStock} {item.unit}</span>
                        </div>
                      </TableCell>
                      <TableCell>{item.minimumStock} {item.unit}</TableCell>
                      <TableCell>
                        <Badge 
                          className={`text-white ${getUrgencyColor(urgency)}`}
                        >
                          {urgency.charAt(0).toUpperCase() + urgency.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{item.supplier}</div>
                          <div className="text-sm text-gray-500">
                            Daily usage: {item.dailyUsage} {item.unit}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{item.leadTime} days</TableCell>
                      <TableCell>
                        <div className="font-medium text-green-600">
                          {reorderQty.toFixed(1)} {item.unit}
                        </div>
                        <div className="text-sm text-gray-500">
                          ~${(reorderQty * item.costPerUnit).toFixed(2)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            Reorder
                          </Button>
                          <Button size="sm" variant="outline">
                            Details
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Auto-reorder Status */}
      {alertSettings.autoReorderEnabled && (
        <Card className="border-green-300 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <h4 className="font-bold text-green-800">Auto-reorder Enabled</h4>
                <p className="text-green-700">
                  Critical items will be automatically reordered when stock levels reach the minimum threshold.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
