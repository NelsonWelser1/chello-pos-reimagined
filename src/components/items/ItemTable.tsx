
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Eye, Trash2, ImageIcon, ChefHat } from "lucide-react";
import { type MenuItem } from '@/hooks/useMenuItems';

interface ItemTableProps {
  items: MenuItem[];
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
  onToggleAvailability: (id: string) => void;
  onManageRecipe?: (item: MenuItem) => void;
}

export default function ItemTable({ items, onEdit, onDelete, onToggleAvailability, onManageRecipe }: ItemTableProps) {
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
                  <p className="text-sm text-slate-500">{item.description?.substring(0, 50)}...</p>
                </div>
              </TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell className="font-bold text-green-600">${item.price}</TableCell>
              <TableCell>
                <Badge 
                  variant={item.stock_count <= item.low_stock_alert ? "destructive" : "outline"}
                >
                  {item.stock_count}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge 
                  variant={item.is_available ? "default" : "secondary"}
                  className={item.is_available ? "bg-green-500" : "bg-red-500"}
                >
                  {item.is_available ? 'Available' : 'Unavailable'}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" onClick={() => onEdit(item)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  {onManageRecipe && (
                    <Button size="sm" variant="outline" onClick={() => onManageRecipe(item)}>
                      <ChefHat className="w-4 h-4" />
                    </Button>
                  )}
                  <Button 
                    size="sm" 
                    variant={item.is_available ? "secondary" : "default"}
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
