import { useState, useMemo } from "react";
import { Settings, Plus, Search, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ModifierStats from "@/components/modifiers/ModifierStats";
import ModifierCard from "@/components/modifiers/ModifierCard";
import ModifierTable from "@/components/modifiers/ModifierTable";
import ModifierForm from "@/components/modifiers/ModifierForm";
import { useModifiers, Modifier } from "@/hooks/useModifiers";

const categories = ['All', 'Add-ons', 'Removals', 'Substitutions', 'Customization'];

export default function Modifiers() {
  const { 
    modifiers, 
    addModifier, 
    updateModifier, 
    deleteModifier, 
    toggleModifierActive 
  } = useModifiers();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingModifier, setEditingModifier] = useState<Modifier | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: 'Add-ons',
    isActive: true,
    applicableItems: [] as string[],
    modifierType: 'addon' as 'addon' | 'substitute' | 'removal',
    maxQuantity: 1,
    isRequired: false,
    sortOrder: 0
  });

  const filteredModifiers = useMemo(() => modifiers.filter(modifier => {
    const nameMatch = modifier.name.toLowerCase().includes(searchTerm.toLowerCase());
    const descMatch = modifier.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false;
    const matchesSearch = nameMatch || descMatch;
    const matchesCategory = selectedCategory === 'All' || modifier.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }), [modifiers, searchTerm, selectedCategory]);

  const handleSave = () => {
    const modifierData = {
      name: formData.name,
      description: formData.description,
      price: formData.price,
      category: formData.category,
      is_active: formData.isActive,
      applicable_items: formData.applicableItems,
      modifier_type: formData.modifierType,
      max_quantity: formData.maxQuantity,
      is_required: formData.isRequired,
      sort_order: formData.sortOrder,
    };

    if (editingModifier) {
      updateModifier(editingModifier.id, modifierData);
    } else {
      addModifier(modifierData);
    }

    handleCloseDialog();
  };

  const handleEdit = (modifier: Modifier) => {
    setEditingModifier(modifier);
    setFormData({
      name: modifier.name,
      description: modifier.description ?? '',
      price: modifier.price ?? 0,
      category: modifier.category,
      isActive: modifier.is_active ?? true,
      applicableItems: modifier.applicable_items ?? [],
      modifierType: modifier.modifier_type as 'addon' | 'substitute' | 'removal',
      maxQuantity: modifier.max_quantity ?? 1,
      isRequired: modifier.is_required ?? false,
      sortOrder: modifier.sort_order ?? 0
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteModifier(id);
  };

  const toggleActive = (id: string) => {
    const modifier = modifiers.find(m => m.id === id);
    if(modifier) {
      toggleModifierActive(modifier.id, modifier.is_active ?? true);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingModifier(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      category: 'Add-ons',
      isActive: true,
      applicableItems: [],
      modifierType: 'addon',
      maxQuantity: 1,
      isRequired: false,
      sortOrder: 0
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center justify-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
              <Settings className="w-10 h-10 text-white" />
            </div>
            Modifier Management
          </h1>
          <p className="text-xl text-slate-600 mt-4 font-medium">Manage menu item modifiers and customizations</p>
        </div>

        {/* Controls */}
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
            onClick={() => {
              setEditingModifier(null);
              setIsDialogOpen(true);
            }}
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Modifier
          </Button>
        </div>

        {/* Statistics */}
        <ModifierStats modifiers={modifiers} />

        {/* Modifiers Display */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModifiers.map(modifier => (
              <ModifierCard
                key={modifier.id}
                modifier={modifier}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleActive={toggleActive}
              />
            ))}
          </div>
        ) : (
          <ModifierTable
            modifiers={filteredModifiers}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleActive={toggleActive}
          />
        )}

        {filteredModifiers.length === 0 && (
          <div className="text-center py-12">
            <Settings className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-600 mb-2">No modifiers found</h3>
            <p className="text-slate-500">
              {searchTerm || selectedCategory !== 'All' 
                ? 'Try adjusting your search or filter' 
                : 'Create your first modifier to get started'}
            </p>
          </div>
        )}

        <ModifierForm
          isOpen={isDialogOpen}
          onClose={handleCloseDialog}
          editingModifier={editingModifier}
          formData={formData}
          setFormData={setFormData}
          onSave={handleSave}
          categories={categories}
        />
      </div>
    </div>
  );
}
