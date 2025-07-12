import { useState, useEffect } from "react";
import { AlertTriangle, Package, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMenuItems } from "@/hooks/useMenuItems";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function StockMonitor() {
  const { items: menuItems, loading } = useMenuItems();
  const [lowStockItems, setLowStockItems] = useState<any[]>([]);
  const [outOfStockItems, setOutOfStockItems] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && menuItems.length > 0) {
      const lowStock = menuItems.filter(item => 
        item.stock_count > 0 && item.stock_count <= item.low_stock_alert
      );
      const outOfStock = menuItems.filter(item => item.stock_count <= 0);
      
      setLowStockItems(lowStock);
      setOutOfStockItems(outOfStock);
    }
  }, [menuItems, loading]);

  if (loading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Package className="w-5 h-5" />
            Stock Monitor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-slate-600">Loading stock data...</div>
        </CardContent>
      </Card>
    );
  }

  const totalCriticalItems = lowStockItems.length + outOfStockItems.length;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Package className="w-5 h-5" />
          Stock Monitor
          {totalCriticalItems > 0 && (
            <Badge variant="destructive" className="ml-2">
              {totalCriticalItems} alerts
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Critical Alerts */}
        {outOfStockItems.length > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>{outOfStockItems.length} items</strong> are out of stock and unavailable for ordering.
            </AlertDescription>
          </Alert>
        )}

        {lowStockItems.length > 0 && (
          <Alert>
            <TrendingDown className="h-4 w-4" />
            <AlertDescription>
              <strong>{lowStockItems.length} items</strong> are running low on stock.
            </AlertDescription>
          </Alert>
        )}

        {/* Stock Status Summary */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-green-50 p-2 rounded">
            <div className="text-lg font-bold text-green-700">
              {menuItems.filter(item => item.stock_count > item.low_stock_alert).length}
            </div>
            <div className="text-xs text-green-600">In Stock</div>
          </div>
          <div className="bg-yellow-50 p-2 rounded">
            <div className="text-lg font-bold text-yellow-700">{lowStockItems.length}</div>
            <div className="text-xs text-yellow-600">Low Stock</div>
          </div>
          <div className="bg-red-50 p-2 rounded">
            <div className="text-lg font-bold text-red-700">{outOfStockItems.length}</div>
            <div className="text-xs text-red-600">Out of Stock</div>
          </div>
        </div>

        {/* Detailed Lists */}
        {outOfStockItems.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-red-700 text-sm">Out of Stock Items:</h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {outOfStockItems.map(item => (
                <div key={item.id} className="flex items-center justify-between text-xs p-2 bg-red-50 rounded">
                  <span className="font-medium">{item.name}</span>
                  <Badge variant="destructive" className="text-xs">0 left</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {lowStockItems.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-yellow-700 text-sm">Low Stock Items:</h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {lowStockItems.map(item => (
                <div key={item.id} className="flex items-center justify-between text-xs p-2 bg-yellow-50 rounded">
                  <span className="font-medium">{item.name}</span>
                  <Badge variant="outline" className="text-yellow-700 border-yellow-400">
                    {item.stock_count} left
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {totalCriticalItems === 0 && (
          <div className="text-center py-4 text-green-600">
            All items are well stocked! ✅
          </div>
        )}
      </CardContent>
    </Card>
  );
}