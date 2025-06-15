
import { Card, CardContent } from "@/components/ui/card";
import MenuItemCard from "./MenuItemCard";
import { type MenuItem } from "@/hooks/useMenuItems";

interface MenuGridProps {
  items: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
}

export default function MenuGrid({ items, onAddToCart }: MenuGridProps) {
  return (
    <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map(item => (
            <MenuItemCard
              key={item.id}
              item={item}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>

        {items.length === 0 && (
          <div className="text-center py-8">
            <p className="text-slate-500 font-medium">No items available in this category</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
