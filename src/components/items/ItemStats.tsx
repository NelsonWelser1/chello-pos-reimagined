
import { Card, CardContent } from "@/components/ui/card";
import { Package, Eye, Star, Archive, DollarSign } from "lucide-react";

interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isAvailable: boolean;
  stockCount: number;
  lowStockAlert: number;
  allergens: string[];
  modifiers: string[];
  preparationTime: number;
  calories: number;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ItemStatsProps {
  items: Item[];
}

export default function ItemStats({ items }: ItemStatsProps) {
  const lowStockItems = items.filter(item => item.stockCount <= item.lowStockAlert);
  const outOfStockItems = items.filter(item => item.stockCount === 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
      <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Items</p>
              <p className="text-3xl font-black">{items.length}</p>
            </div>
            <Package className="w-12 h-12 text-blue-200" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Available Items</p>
              <p className="text-3xl font-black">{items.filter(i => i.isAvailable).length}</p>
            </div>
            <Eye className="w-12 h-12 text-green-200" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100">Low Stock</p>
              <p className="text-3xl font-black">{lowStockItems.length}</p>
            </div>
            <Star className="w-12 h-12 text-yellow-200" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100">Out of Stock</p>
              <p className="text-3xl font-black">{outOfStockItems.length}</p>
            </div>
            <Archive className="w-12 h-12 text-red-200" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Avg Price</p>
              <p className="text-3xl font-black">
                ${items.length > 0 ? (items.reduce((sum, item) => sum + item.price, 0) / items.length).toFixed(2) : '0.00'}
              </p>
            </div>
            <DollarSign className="w-12 h-12 text-purple-200" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
