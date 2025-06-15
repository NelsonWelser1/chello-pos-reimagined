
import { useState, useMemo } from "react";
import { Settings } from "lucide-react";
import ModifierStats from "@/components/modifiers/ModifierStats";
import ModifierCard from "@/components/modifiers/ModifierCard";
import ModifierTable from "@/components/modifiers/ModifierTable";
import ModifierForm from "@/components/modifiers/ModifierForm";
import { useModifiers, Modifier } from "@/hooks/useModifiers";
import ModifiersHeader from "@/components/modifiers/ModifiersHeader";
import ModifiersControls from "@/components/modifiers/ModifiersControls";

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

  const handleAdd = () => {
    setEditingModifier(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <ModifiersHeader />

        <ModifiersControls
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onAdd={handleAdd}
        />

        <ModifierStats modifiers={modifiers} />

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
