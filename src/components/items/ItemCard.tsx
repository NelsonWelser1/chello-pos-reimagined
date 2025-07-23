
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Trash2, ImageIcon, ChefHat } from "lucide-react";
import { type MenuItem } from '@/hooks/useMenuItems';

interface ItemCardProps {
  item: MenuItem;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
  onToggleAvailability: (id: string) => void;
  onManageRecipe?: (item: MenuItem) => void;
}

export default function ItemCard({ item, onEdit, onDelete, onToggleAvailability, onManageRecipe }: ItemCardProps) {
  return (
    <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200 bg-white/90 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="relative">
          {item.image ? (
            <img 
              src={item.image} 
              alt={item.name}
              className="w-full h-48 object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-48 bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg flex items-center justify-center">
              <ImageIcon className="w-12 h-12 text-slate-400" />
            </div>
          )}
          <div className="absolute top-2 right-2 flex gap-1">
            {item.is_vegetarian && <Badge className="bg-green-500 text-xs">V</Badge>}
            {item.is_vegan && <Badge className="bg-green-600 text-xs">VG</Badge>}
            {item.is_gluten_free && <Badge className="bg-yellow-500 text-xs">GF</Badge>}
          </div>
        </div>
        
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-slate-800">{item.name}</CardTitle>
            <p className="text-2xl font-black text-green-600">${item.price}</p>
          </div>
          <div className="text-right">
            <Badge 
              variant={item.is_available ? "default" : "secondary"}
              className={item.is_available ? "bg-green-500" : "bg-red-500"}
            >
              {item.is_available ? 'Available' : 'Unavailable'}
            </Badge>
            <p className="text-sm text-slate-500 mt-1">{item.category}</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-slate-600 text-sm">{item.description}</p>
        
        <div className="flex justify-between text-sm">
          <span>Stock: <Badge variant="outline">{item.stock_count}</Badge></span>
          <span>Prep: {item.preparation_time}min</span>
          <span>{item.calories} cal</span>
        </div>
        
        {item.stock_count <= item.low_stock_alert && (
          <Badge variant="destructive" className="w-full justify-center">
            {item.stock_count === 0 ? 'Out of Stock' : 'Low Stock'}
          </Badge>
        )}
        
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(item)}
            className="flex-1"
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
          
          {onManageRecipe && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onManageRecipe(item)}
              className="flex-1"
            >
              <ChefHat className="w-4 h-4 mr-1" />
              Recipe
            </Button>
          )}
          
          <Button
            size="sm"
            variant={item.is_available ? "secondary" : "default"}
            onClick={() => onToggleAvailability(item.id)}
            className="flex-1"
          >
            <Eye className="w-4 h-4 mr-1" />
            {item.is_available ? 'Hide' : 'Show'}
          </Button>
          
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(item.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
