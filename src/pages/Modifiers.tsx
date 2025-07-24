import { useState, useMemo } from "react";
import { Settings } from "lucide-react";
import ModifierStats from "@/components/modifiers/ModifierStats";
import ModifierCard from "@/components/modifiers/ModifierCard";
import ModifierTable from "@/components/modifiers/ModifierTable";
import ModifierForm from "@/components/modifiers/ModifierForm";
import { useModifiers, Modifier, NewModifier } from "@/hooks/useModifiers";
import ModifiersHeader from "@/components/modifiers/ModifiersHeader";
import ModifiersControls from "@/components/modifiers/ModifiersControls";

const categories = ['All', 'Add-ons', 'Removals', 'Substitutions', 'Customization'];

const initialFormData: NewModifier = {
  name: '',
  description: '',
  price: 0,
  category: 'Add-ons',
  isActive: true,
  applicableItems: [],
  modifierType: 'single',
  maxQuantity: 1,
  isRequired: false,
  sortOrder: 0
};

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
  const [formData, setFormData] = useState<NewModifier>(initialFormData);

  const filteredModifiers = useMemo(() => modifiers.filter(modifier => {
    const nameMatch = modifier.name.toLowerCase().includes(searchTerm.toLowerCase());
    const descMatch = modifier.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false;
    const matchesSearch = nameMatch || descMatch;
    const matchesCategory = selectedCategory === 'All' || modifier.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }), [modifiers, searchTerm, selectedCategory]);

  const handleSave = () => {
    if (editingModifier) {
      updateModifier(editingModifier.id, formData);
    } else {
      addModifier(formData);
    }

    handleCloseDialog();
  };

  const handleEdit = (modifier: Modifier) => {
    setEditingModifier(modifier);
    const { id, createdAt, updatedAt, ...formDataToEdit } = modifier;
    setFormData(formDataToEdit);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteModifier(id);
  };

  const toggleActive = (id: string) => {
    const modifier = modifiers.find(m => m.id === id);
    if(modifier) {
      toggleModifierActive(modifier.id, modifier.isActive);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingModifier(null);
    setFormData(initialFormData);
  };

  const handleAdd = () => {
    setEditingModifier(null);
    setFormData(initialFormData);
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
