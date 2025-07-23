
import { Package } from "lucide-react";
import ItemCard from "@/components/items/ItemCard";
import ItemTable from "@/components/items/ItemTable";
import { type MenuItem } from '@/hooks/useMenuItems';

interface ItemsDisplayProps {
  viewMode: 'grid' | 'table';
  filteredItems: MenuItem[];
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
  onToggleAvailability: (id: string) => void;
  onManageRecipe?: (item: MenuItem) => void;
  searchTerm: string;
  selectedCategory: string;
}

export default function ItemsDisplay({
  viewMode,
  filteredItems,
  onEdit,
  onDelete,
  onToggleAvailability,
  onManageRecipe,
  searchTerm,
  selectedCategory
}: ItemsDisplayProps) {
  if (filteredItems.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 mx-auto text-slate-300 mb-4" />
        <h3 className="text-xl font-bold text-slate-600 mb-2">No items found</h3>
        <p className="text-slate-500">
          {searchTerm || selectedCategory !== 'All' 
            ? 'Try adjusting your search or filter' 
            : 'Create your first item to get started'}
        </p>
      </div>
    );
  }

  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <ItemCard
            key={item.id}
            item={item}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleAvailability={onToggleAvailability}
            onManageRecipe={onManageRecipe}
          />
        ))}
      </div>
    );
  }

  return (
    <ItemTable
      items={filteredItems}
      onEdit={onEdit}
      onDelete={onDelete}
      onToggleAvailability={onToggleAvailability}
      onManageRecipe={onManageRecipe}
    />
  );
}
