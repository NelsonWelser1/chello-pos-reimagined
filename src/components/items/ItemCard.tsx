
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Trash2, ImageIcon } from "lucide-react";

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

interface ItemCardProps {
  item: Item;
  onEdit: (item: Item) => void;
  onDelete: (id: string) => void;
  onToggleAvailability: (id: string) => void;
}

export default function ItemCard({ item, onEdit, onDelete, onToggleAvailability }: ItemCardProps) {
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
            {item.isVegetarian && <Badge className="bg-green-500 text-xs">V</Badge>}
            {item.isVegan && <Badge className="bg-green-600 text-xs">VG</Badge>}
            {item.isGlutenFree && <Badge className="bg-yellow-500 text-xs">GF</Badge>}
          </div>
        </div>
        
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-slate-800">{item.name}</CardTitle>
            <p className="text-2xl font-black text-green-600">${item.price}</p>
          </div>
          <div className="text-right">
            <Badge 
              variant={item.isAvailable ? "default" : "secondary"}
              className={item.isAvailable ? "bg-green-500" : "bg-red-500"}
            >
              {item.isAvailable ? 'Available' : 'Unavailable'}
            </Badge>
            <p className="text-sm text-slate-500 mt-1">{item.category}</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-slate-600 text-sm">{item.description}</p>
        
        <div className="flex justify-between text-sm">
          <span>Stock: <Badge variant="outline">{item.stockCount}</Badge></span>
          <span>Prep: {item.preparationTime}min</span>
          <span>{item.calories} cal</span>
        </div>
        
        {item.stockCount <= item.lowStockAlert && (
          <Badge variant="destructive" className="w-full justify-center">
            {item.stockCount === 0 ? 'Out of Stock' : 'Low Stock'}
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
          
          <Button
            size="sm"
            variant={item.isAvailable ? "secondary" : "default"}
            onClick={() => onToggleAvailability(item.id)}
            className="flex-1"
          >
            <Eye className="w-4 h-4 mr-1" />
            {item.isAvailable ? 'Hide' : 'Show'}
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
