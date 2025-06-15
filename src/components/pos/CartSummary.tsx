
import { ShoppingCart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CartItem from "./CartItem";

interface CartItem {
  id: string;
  name: string;
  price: number;
  category: string;
  quantity: number;
  image?: string;
}

interface CartSummaryProps {
  cart: CartItem[];
  totalItems: number;
  onItemIncrease: (id: string) => void;
  onItemDecrease: (id: string) => void;
}

export default function CartSummary({ cart, totalItems, onItemIncrease, onItemDecrease }: CartSummaryProps) {
  return (
    <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-black text-slate-800 flex items-center justify-between">
          Current Order
          <Badge className="bg-blue-500 text-white font-bold text-lg px-3 py-1">
            {totalItems} items
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {cart.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingCart className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500 font-medium">Cart is empty</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map(item => (
              <CartItem
                key={item.id}
                item={item}
                onIncrease={() => onItemIncrease(item.id)}
                onDecrease={() => onItemDecrease(item.id)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
