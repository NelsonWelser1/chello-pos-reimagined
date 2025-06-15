
import { Search, Archive, Settings, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ModifiersControlsProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  viewMode: 'grid' | 'table';
  setViewMode: (mode: 'grid' | 'table') => void;
  onAdd: () => void;
}

export default function ModifiersControls({
  searchTerm,
  setSearchTerm,
  categories,
  selectedCategory,
  setSelectedCategory,
  viewMode,
  setViewMode,
  onAdd
}: ModifiersControlsProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 mb-8">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
        <Input
          placeholder="Search modifiers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-12 text-lg bg-white/90 backdrop-blur-sm border-2 focus:border-purple-400"
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
          <Settings className="w-4 h-4" />
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
        className="h-12 px-6 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 font-bold text-lg"
        onClick={onAdd}
      >
        <Plus className="w-5 h-5 mr-2" />
        Add Modifier
      </Button>
    </div>
  );
}
