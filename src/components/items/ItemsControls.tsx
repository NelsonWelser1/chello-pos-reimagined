
import { Search, Plus, Package, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ItemsControlsProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: string[];
  viewMode: 'grid' | 'table';
  setViewMode: (mode: 'grid' | 'table') => void;
  onAddItem: () => void;
}

export default function ItemsControls({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  categories,
  viewMode,
  setViewMode,
  onAddItem
}: ItemsControlsProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 mb-8">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
        <Input
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-12 text-lg bg-white/90 backdrop-blur-sm border-2 focus:border-blue-400"
        />
      </div>
      
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => setSelectedCategory(category)}
            className="h-12"
          >
            {category}
          </Button>
        ))}
      </div>

      <div className="flex gap-2">
        <Button
          variant={viewMode === 'grid' ? "default" : "outline"}
          onClick={() => setViewMode('grid')}
          className="h-12 px-4"
        >
          <Package className="w-4 h-4" />
        </Button>
        <Button
          variant={viewMode === 'table' ? "default" : "outline"}
          onClick={() => setViewMode('table')}
          className="h-12 px-4"
        >
          <Archive className="w-4 h-4" />
        </Button>
      </div>
      
      <Button 
        className="h-12 px-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 font-bold text-lg"
        onClick={onAddItem}
      >
        <Plus className="w-5 h-5 mr-2" />
        Add Item
      </Button>
    </div>
  );
}
