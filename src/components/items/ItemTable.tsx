
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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

interface ItemTableProps {
  items: Item[];
  onEdit: (item: Item) => void;
  onDelete: (id: string) => void;
  onToggleAvailability: (id: string) => void;
}

export default function ItemTable({ items, onEdit, onDelete, onToggleAvailability }: ItemTableProps) {
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map(item => (
            <TableRow key={item.id}>
              <TableCell>
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                ) : (
                  <div className="w-12 h-12 bg-slate-200 rounded flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-slate-400" />
                  </div>
                )}
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-bold">{item.name}</p>
                  <p className="text-sm text-slate-500">{item.description.substring(0, 50)}...</p>
                </div>
              </TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell className="font-bold text-green-600">${item.price}</TableCell>
              <TableCell>
                <Badge 
                  variant={item.stockCount <= item.lowStockAlert ? "destructive" : "outline"}
                >
                  {item.stockCount}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge 
                  variant={item.isAvailable ? "default" : "secondary"}
                  className={item.isAvailable ? "bg-green-500" : "bg-red-500"}
                >
                  {item.isAvailable ? 'Available' : 'Unavailable'}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" onClick={() => onEdit(item)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant={item.isAvailable ? "secondary" : "default"}
                    onClick={() => onToggleAvailability(item.id)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => onDelete(item.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
