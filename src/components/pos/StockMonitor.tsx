import { useState, useEffect } from "react";
import { AlertTriangle, Package, TrendingDown, Clock, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMenuItems } from "@/hooks/useMenuItems";
import { useStockManagement } from "@/hooks/useStockManagement";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import StockAdjustmentForm from "@/components/stock/StockAdjustmentForm";

export default function StockMonitor() {
  const { items: menuItems, loading } = useMenuItems();
  const { ingredients, alerts, createAdjustment, fetchAlerts } = useStockManagement();
  const [lowStockItems, setLowStockItems] = useState<any[]>([]);
  const [outOfStockItems, setOutOfStockItems] = useState<any[]>([]);
  const [showAdjustmentForm, setShowAdjustmentForm] = useState(false);

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

  const handleAdjustmentSubmit = async (adjustment: any) => {
    const success = await createAdjustment(adjustment);
    if (success) {
      await fetchAlerts();
    }
    return success;
  };

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
  const criticalIngredients = ingredients.filter(ing => 
    ing.currentStock <= ing.minimumStock || ing.currentStock === 0
  );
  const totalCriticalAlerts = totalCriticalItems + criticalIngredients.length;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Stock Monitor
            {totalCriticalAlerts > 0 && (
              <Badge variant="destructive" className="ml-2">
                {totalCriticalAlerts} alerts
              </Badge>
            )}
          </div>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => setShowAdjustmentForm(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Adjust Stock
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Total Items Summary */}
        <div className="text-center text-sm text-slate-600 mb-4">
          Monitoring {menuItems.length} menu items & {ingredients.length} ingredients
        </div>

        {/* Critical Alerts */}
        {(outOfStockItems.length > 0 || criticalIngredients.filter(ing => ing.currentStock === 0).length > 0) && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                {outOfStockItems.length > 0 && (
                  <div><strong>{outOfStockItems.length} menu items</strong> are completely out of stock.</div>
                )}
                {criticalIngredients.filter(ing => ing.currentStock === 0).length > 0 && (
                  <div><strong>{criticalIngredients.filter(ing => ing.currentStock === 0).length} ingredients</strong> are out of stock.</div>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {(lowStockItems.length > 0 || criticalIngredients.filter(ing => ing.currentStock > 0 && ing.currentStock <= ing.minimumStock).length > 0) && (
          <Alert>
            <TrendingDown className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                {lowStockItems.length > 0 && (
                  <div><strong>{lowStockItems.length} menu items</strong> are running low.</div>
                )}
                {criticalIngredients.filter(ing => ing.currentStock > 0 && ing.currentStock <= ing.minimumStock).length > 0 && (
                  <div><strong>{criticalIngredients.filter(ing => ing.currentStock > 0 && ing.currentStock <= ing.minimumStock).length} ingredients</strong> need restocking.</div>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Stock Status Summary */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
            <div className="text-xl font-bold text-green-700">
              {menuItems.filter(item => item.stock_count > item.low_stock_alert).length}
            </div>
            <div className="text-xs text-green-600 font-medium">Well Stocked</div>
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            <div className="text-xl font-bold text-yellow-700">{lowStockItems.length}</div>
            <div className="text-xs text-yellow-600 font-medium">Low Stock</div>
          </div>
          <div className="bg-red-50 p-3 rounded-lg border border-red-200">
            <div className="text-xl font-bold text-red-700">{outOfStockItems.length}</div>
            <div className="text-xs text-red-600 font-medium">Out of Stock</div>
          </div>
        </div>

        {/* Detailed Stock Information */}
        {outOfStockItems.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-red-700 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Critical - Out of Stock:
            </h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {outOfStockItems.map(item => (
                <div key={item.id} className="flex items-center justify-between text-sm p-2 bg-red-50 rounded border border-red-200">
                  <div className="flex flex-col">
                    <span className="font-medium text-red-800">{item.name}</span>
                    <span className="text-xs text-red-600">{item.category}</span>
                  </div>
                  <div className="text-right">
                    <Badge variant="destructive" className="text-xs">0 units</Badge>
                    <div className="text-xs text-red-600 mt-1">Alert at: {item.low_stock_alert}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {lowStockItems.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-yellow-700 text-sm flex items-center gap-2">
              <TrendingDown className="w-4 h-4" />
              Warning - Low Stock:
            </h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {lowStockItems.map(item => (
                <div key={item.id} className="flex items-center justify-between text-sm p-2 bg-yellow-50 rounded border border-yellow-200">
                  <div className="flex flex-col">
                    <span className="font-medium text-yellow-800">{item.name}</span>
                    <span className="text-xs text-yellow-600">{item.category}</span>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        item.stock_count <= 2 ? 'border-red-400 text-red-700' : 'border-yellow-400 text-yellow-700'
                      }`}
                    >
                      {item.stock_count} units left
                    </Badge>
                    <div className="text-xs text-yellow-600 mt-1">Alert at: {item.low_stock_alert}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Healthy Stock Items Preview */}
        {menuItems.filter(item => item.stock_count > item.low_stock_alert).length > 0 && totalCriticalItems === 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-green-700 text-sm flex items-center gap-2">
              <Package className="w-4 h-4" />
              Well Stocked Items:
            </h4>
            <div className="space-y-1 max-h-24 overflow-y-auto">
              {menuItems
                .filter(item => item.stock_count > item.low_stock_alert)
                .slice(0, 3)
                .map(item => (
                  <div key={item.id} className="flex items-center justify-between text-sm p-2 bg-green-50 rounded border border-green-200">
                    <span className="font-medium text-green-800">{item.name}</span>
                    <Badge variant="outline" className="text-green-700 border-green-400 text-xs">
                      {item.stock_count} units
                    </Badge>
                  </div>
                ))}
              {menuItems.filter(item => item.stock_count > item.low_stock_alert).length > 3 && (
                <div className="text-center text-xs text-green-600 py-1">
                  ...and {menuItems.filter(item => item.stock_count > item.low_stock_alert).length - 3} more items
                </div>
              )}
            </div>
          </div>
        )}

        {/* Ingredient Stock Alerts */}
        {criticalIngredients.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-orange-700 text-sm flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Ingredient Stock Issues:
            </h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {criticalIngredients.slice(0, 5).map(ingredient => (
                <div key={ingredient.id} className="flex items-center justify-between text-sm p-2 bg-orange-50 rounded border border-orange-200">
                  <div className="flex flex-col">
                    <span className="font-medium text-orange-800">{ingredient.name}</span>
                    <span className="text-xs text-orange-600">{ingredient.category}</span>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={ingredient.currentStock === 0 ? "destructive" : "outline"}
                      className="text-xs"
                    >
                      {ingredient.currentStock} {ingredient.unit}
                    </Badge>
                    <div className="text-xs text-orange-600 mt-1">Min: {ingredient.minimumStock}</div>
                  </div>
                </div>
              ))}
              {criticalIngredients.length > 5 && (
                <div className="text-center text-xs text-orange-600 py-1">
                  ...and {criticalIngredients.length - 5} more ingredients
                </div>
              )}
            </div>
          </div>
        )}

        {totalCriticalAlerts === 0 && (
          <div className="text-center py-6 text-green-600 bg-green-50 rounded-lg border border-green-200">
            <Package className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <div className="font-semibold">All items are well stocked!</div>
            <div className="text-sm text-green-500 mt-1">No immediate restocking needed</div>
          </div>
        )}
      </CardContent>

      {/* Stock Adjustment Dialog */}
      <Dialog open={showAdjustmentForm} onOpenChange={setShowAdjustmentForm}>
        <DialogContent className="max-w-3xl">
          <StockAdjustmentForm
            onSubmit={handleAdjustmentSubmit}
            onClose={() => setShowAdjustmentForm(false)}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
}