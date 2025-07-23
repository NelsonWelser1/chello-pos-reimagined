
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type MenuItem } from "@/hooks/useMenuItems";

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

export default function MenuItemCard({ item, onAddToCart }: MenuItemCardProps) {
  const handleAddToCart = () => {
    try {
      console.log('Adding item to cart:', item.name);
      onAddToCart(item);
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-200 bg-gradient-to-br from-white to-slate-50">
      <CardContent className="p-4">
        <div className="space-y-3">
          {item.image && (
            <img 
              src={item.image} 
              alt={item.name}
              className="w-full h-32 object-cover rounded-lg"
            />
          )}
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-lg text-slate-800">{item.name}</h3>
            <Badge variant="secondary" className="bg-green-100 text-green-800 font-bold">
              ${item.price.toFixed(2)}
            </Badge>
          </div>
          <p className="text-sm text-slate-600">{item.description}</p>
          <div className="flex justify-between items-center text-xs text-slate-500">
            <span className={item.stock_count <= item.low_stock_alert ? "text-red-500 font-semibold" : ""}>
              Stock: {item.stock_count}
              {item.stock_count <= item.low_stock_alert && " ⚠️"}
            </span>
            <span>{item.preparation_time}min</span>
          </div>
          <Button 
            onClick={handleAddToCart}
            disabled={item.stock_count <= 0}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 font-bold disabled:opacity-50"
          >
            <Plus className="w-4 h-4 mr-2" />
            {item.stock_count <= 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
