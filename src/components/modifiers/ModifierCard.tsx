
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Trash2, Settings, Plus, Minus, RotateCcw } from "lucide-react";

interface Modifier {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isActive: boolean;
  applicableItems: string[];
  modifierType: 'addon' | 'substitute' | 'removal';
  maxQuantity: number;
  isRequired: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

interface ModifierCardProps {
  modifier: Modifier;
  onEdit: (modifier: Modifier) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string) => void;
}

const getModifierIcon = (type: string) => {
  switch (type) {
    case 'addon': return <Plus className="w-4 h-4" />;
    case 'substitute': return <RotateCcw className="w-4 h-4" />;
    case 'removal': return <Minus className="w-4 h-4" />;
    default: return <Settings className="w-4 h-4" />;
  }
};

const getModifierColor = (type: string) => {
  switch (type) {
    case 'addon': return 'bg-green-500';
    case 'substitute': return 'bg-blue-500';
    case 'removal': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

export default function ModifierCard({ modifier, onEdit, onDelete, onToggleActive }: ModifierCardProps) {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-2 border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 ${getModifierColor(modifier.modifierType)} rounded-xl flex items-center justify-center shadow-lg`}>
              {getModifierIcon(modifier.modifierType)}
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800">{modifier.name}</h3>
              <Badge variant="outline" className="mt-1">
                {modifier.category}
              </Badge>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge 
              variant={modifier.isActive ? "default" : "secondary"}
              className={modifier.isActive ? "bg-green-500" : "bg-red-500"}
            >
              {modifier.isActive ? 'Active' : 'Inactive'}
            </Badge>
            {modifier.isRequired && (
              <Badge variant="outline" className="border-orange-400 text-orange-600">
                Required
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-slate-600 text-base leading-relaxed">{modifier.description}</p>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-slate-500">Price:</span>
              <span className="font-bold text-green-600">
                {modifier.price > 0 ? `$${modifier.price.toFixed(2)}` : 'Free'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-slate-500">Max Qty:</span>
              <span className="font-bold text-slate-700">{modifier.maxQuantity}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-slate-500">Type:</span>
              <span className="font-bold text-slate-700 capitalize">{modifier.modifierType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-slate-500">Order:</span>
              <span className="font-bold text-slate-700">{modifier.sortOrder}</span>
            </div>
          </div>
        </div>

        {modifier.applicableItems.length > 0 && (
          <div>
            <p className="text-sm font-medium text-slate-500 mb-2">Applicable to:</p>
            <div className="flex flex-wrap gap-1">
              {modifier.applicableItems.slice(0, 3).map(item => (
                <Badge key={item} variant="outline" className="text-xs">
                  {item}
                </Badge>
              ))}
              {modifier.applicableItems.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{modifier.applicableItems.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
        
        <div className="flex gap-2 pt-2">
          <Button size="sm" variant="outline" onClick={() => onEdit(modifier)} className="flex-1">
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
          <Button 
            size="sm" 
            variant={modifier.isActive ? "secondary" : "default"}
            onClick={() => onToggleActive(modifier.id)}
            className="flex-1"
          >
            <Eye className="w-4 h-4 mr-1" />
            {modifier.isActive ? 'Deactivate' : 'Activate'}
          </Button>
          <Button size="sm" variant="destructive" onClick={() => onDelete(modifier.id)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
