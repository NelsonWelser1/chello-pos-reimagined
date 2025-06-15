
import { Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CartItemProps {
  item: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  };
  onIncrease: () => void;
  onDecrease: () => void;
}

export default function CartItem({ item, onIncrease, onDecrease }: CartItemProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border">
      <div className="flex-1">
        <h4 className="font-bold text-slate-800">{item.name}</h4>
        <p className="text-sm text-slate-600">${item.price.toFixed(2)} each</p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={onDecrease}
          className="w-8 h-8 p-0"
        >
          <Minus className="w-4 h-4" />
        </Button>
        <span className="w-8 text-center font-bold">{item.quantity}</span>
        <Button
          size="sm"
          variant="outline"
          onClick={onIncrease}
          className="w-8 h-8 p-0"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
