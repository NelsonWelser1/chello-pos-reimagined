
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Eye, Trash2, Plus, Minus, RotateCcw, Settings } from "lucide-react";
import type { Modifier } from '@/hooks/useModifiers';

interface ModifierTableProps {
  modifiers: Modifier[];
  onEdit: (modifier: Modifier) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string) => void;
}

const getModifierIcon = (type: string) => {
  switch (type) {
    case 'addon': return <Plus className="w-4 h-4 text-green-600" />;
    case 'substitute': return <RotateCcw className="w-4 h-4 text-blue-600" />;
    case 'removal': return <Minus className="w-4 h-4 text-red-600" />;
    default: return <Settings className="w-4 h-4 text-gray-600" />;
  }
};

export default function ModifierTable({ modifiers, onEdit, onDelete, onToggleActive }: ModifierTableProps) {
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Max Qty</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Applicable Items</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {modifiers.map(modifier => (
            <TableRow key={modifier.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getModifierIcon(modifier.modifier_type)}
                  <span className="capitalize text-sm">{modifier.modifier_type}</span>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-bold">{modifier.name}</p>
                  <p className="text-sm text-slate-500">{(modifier.description ?? '').substring(0, 40)}...</p>
                  {modifier.is_required && (
                    <Badge variant="outline" className="border-orange-400 text-orange-600 text-xs mt-1">
                      Required
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>{modifier.category}</TableCell>
              <TableCell className="font-bold text-green-600">
                {(modifier.price ?? 0) > 0 ? `$${(modifier.price ?? 0).toFixed(2)}` : 'Free'}
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {modifier.max_quantity}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge 
                  variant={modifier.is_active ? "default" : "secondary"}
                  className={modifier.is_active ? "bg-green-500" : "bg-red-500"}
                >
                  {modifier.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1 max-w-32">
                  {(modifier.applicable_items ?? []).slice(0, 2).map(item => (
                    <Badge key={item} variant="outline" className="text-xs">
                      {item}
                    </Badge>
                  ))}
                  {(modifier.applicable_items?.length ?? 0) > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{(modifier.applicable_items?.length ?? 0) - 2}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" onClick={() => onEdit(modifier)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant={modifier.is_active ? "secondary" : "default"}
                    onClick={() => onToggleActive(modifier.id)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => onDelete(modifier.id)}>
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
