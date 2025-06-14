
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Clock, AlertTriangle, Trash2, Search, Calendar } from "lucide-react";

interface Ingredient {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  unit: string;
  costPerUnit: number;
  supplier: string;
  expiryDate: string;
  isPerishable: boolean;
  storageLocation: string;
}

interface ExpiryAlertsProps {
  expiringItems: Ingredient[];
  alertSettings: {
    expiryWarningDays: number;
  };
}

export default function ExpiryAlerts({ expiringItems, alertSettings }: ExpiryAlertsProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const getExpiryStatus = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) {
      return { status: 'expired', days: Math.abs(daysUntilExpiry), color: 'bg-red-600' };
    } else if (daysUntilExpiry === 0) {
      return { status: 'today', days: 0, color: 'bg-red-500' };
    } else if (daysUntilExpiry <= 2) {
      return { status: 'critical', days: daysUntilExpiry, color: 'bg-orange-500' };
    } else {
      return { status: 'warning', days: daysUntilExpiry, color: 'bg-yellow-500' };
    }
  };

  const filteredItems = expiringItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.storageLocation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedItems = filteredItems.sort((a, b) => {
    const aExpiry = new Date(a.expiryDate).getTime();
    const bExpiry = new Date(b.expiryDate).getTime();
    return aExpiry - bExpiry;
  });

  const expiredItems = sortedItems.filter(item => getExpiryStatus(item.expiryDate).status === 'expired');
  const criticalItems = sortedItems.filter(item => ['today', 'critical'].includes(getExpiryStatus(item.expiryDate).status));

  const calculateWasteCost = (items: Ingredient[]) => {
    return items.reduce((total, item) => total + (item.currentStock * item.costPerUnit), 0);
  };

  return (
    <div className="space-y-6">
      {/* Summary Header */}
      <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3">
            <Clock className="w-8 h-8" />
            Expiry Alert Management
          </CardTitle>
          <p className="text-yellow-100">
            {expiringItems.length} perishable items require immediate attention
          </p>
        </CardHeader>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-red-300 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 font-medium">Expired Items</p>
                <p className="text-2xl font-bold text-red-700">{expiredItems.length}</p>
                <p className="text-sm text-red-600">
                  Waste Cost: ${calculateWasteCost(expiredItems).toFixed(2)}
                </p>
              </div>
              <Trash2 className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-300 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 font-medium">Critical (≤2 days)</p>
                <p className="text-2xl font-bold text-orange-700">{criticalItems.length}</p>
                <p className="text-sm text-orange-600">
                  Value at Risk: ${calculateWasteCost(criticalItems).toFixed(2)}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-300 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-600 font-medium">Warning (≤7 days)</p>
                <p className="text-2xl font-bold text-yellow-700">{expiringItems.length}</p>
                <p className="text-sm text-yellow-600">
                  Total Value: ${calculateWasteCost(expiringItems).toFixed(2)}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search expiring items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Expiring Items Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Expiring Items ({sortedItems.length})
            </CardTitle>
            <div className="flex gap-2">
              <Button className="bg-orange-600 hover:bg-orange-700">
                Bulk Discount
              </Button>
              <Button variant="outline">
                Waste Report
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
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Storage Location</TableHead>
                  <TableHead>Value at Risk</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedItems.map(item => {
                  const expiryInfo = getExpiryStatus(item.expiryDate);
                  const valueAtRisk = item.currentStock * item.costPerUnit;
                  
                  return (
                    <TableRow key={item.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-gray-500">{item.supplier}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{item.currentStock} {item.unit}</span>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {new Date(item.expiryDate).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {expiryInfo.status === 'expired' ? `${expiryInfo.days} days ago` :
                             expiryInfo.status === 'today' ? 'Today' :
                             `${expiryInfo.days} days left`}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${expiryInfo.color} ${
                            expiryInfo.status === 'expired' || expiryInfo.status === 'today' ? 'animate-pulse' : ''
                          }`}></div>
                          <Badge className={`text-white ${expiryInfo.color}`}>
                            {expiryInfo.status === 'expired' ? 'EXPIRED' :
                             expiryInfo.status === 'today' ? 'EXPIRES TODAY' :
                             expiryInfo.status === 'critical' ? 'CRITICAL' : 'WARNING'}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{item.storageLocation}</span>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-red-600">
                          ${valueAtRisk.toFixed(2)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {expiryInfo.status === 'expired' ? (
                            <Button size="sm" variant="destructive">
                              <Trash2 className="w-3 h-3 mr-1" />
                              Dispose
                            </Button>
                          ) : (
                            <>
                              <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                                Discount
                              </Button>
                              <Button size="sm" variant="outline">
                                Use First
                              </Button>
                            </>
                          )}
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

      {/* Waste Prevention Tips */}
      <Card className="border-green-300 bg-green-50">
        <CardHeader>
          <CardTitle className="text-green-800">Waste Prevention Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-green-700">
            <div>
              <h4 className="font-bold mb-2">Immediate Actions:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Use expiring items in daily specials</li>
                <li>Offer discounts on items expiring within 2 days</li>
                <li>Implement FIFO (First In, First Out) rotation</li>
                <li>Check storage conditions and temperatures</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-2">Long-term Solutions:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Adjust ordering quantities based on usage patterns</li>
                <li>Negotiate shorter delivery cycles with suppliers</li>
                <li>Train staff on proper storage techniques</li>
                <li>Consider preservation methods for surplus items</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
