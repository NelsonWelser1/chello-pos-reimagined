
import { useState, useMemo } from 'react';
import { useMenuItems, type MenuItem, type MenuItemFormData } from '@/hooks/useMenuItems';
import { useDataSynchronization } from '@/hooks/useDataSynchronization';
import { Toaster } from '@/components/ui/toaster';
import ItemsHeader from '@/components/items/ItemsHeader';
import ItemsControls from '@/components/items/ItemsControls';
import ItemsDisplay from '@/components/items/ItemsDisplay';
import ItemForm from '@/components/items/ItemForm';
import { useCategories } from '@/hooks/useCategories';
import { type Category } from '@/types/category';

export default function Items() {
  const { items, loading, createItem, updateItem, deleteItem, toggleAvailability, refetch: refetchItems } = useMenuItems();

  const { categories: categoryObjects, loading: categoriesLoading, refetch: refetchCategories } = useCategories();

  // Setup comprehensive data synchronization
  const { isConnected, syncStatus } = useDataSynchronization({
    onMenuUpdate: refetchItems,
    onStockUpdate: refetchItems,
    onOrderUpdate: () => {
      // Orders may affect stock levels
      refetchItems();
    },
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState<MenuItemFormData>({
    name: '',
    description: '',
    price: 0,
    category: 'Coffee',
    image: '',
    stockCount: 0,
    lowStockAlert: 5,
    allergens: [],
    modifiers: [],
    preparationTime: 5,
    calories: 0,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
  });

  // Now get unique category names from the fetched category objects
  const categories = useMemo(() => {
    if (!categoryObjects || categoryObjects.length === 0) return ['All'];
    const catNames = categoryObjects.map(c => c.name);
    return ['All', ...catNames.sort()];
  }, [categoryObjects]);

  // Filter items based on search and category
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [items, searchTerm, selectedCategory]);

  const handleAddItem = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      category: categories.includes('Coffee') ? 'Coffee' : (categories[1] || ''),
      image: '',
      stockCount: 0,
      lowStockAlert: 5,
      allergens: [],
      modifiers: [],
      preparationTime: 5,
      calories: 0,
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false,
    });
    setIsFormOpen(true);
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image: item.image,
      stockCount: item.stock_count,
      lowStockAlert: item.low_stock_alert,
      allergens: item.allergens,
      modifiers: item.modifiers,
      preparationTime: item.preparation_time,
      calories: item.calories,
      isVegetarian: item.is_vegetarian,
      isVegan: item.is_vegan,
      isGlutenFree: item.is_gluten_free,
    });
    setIsFormOpen(true);
  };

  const handleSave = async () => {
    let success = false;

    if (editingItem) {
      success = await updateItem(editingItem.id, formData);
    } else {
      success = await createItem(formData);
    }

    if (success) {
      setIsFormOpen(false);
      setEditingItem(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      await deleteItem(id);
    }
  };

  const handleToggleAvailability = async (id: string) => {
    await toggleAvailability(id);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingItem(null);
  };

  if (loading || categoriesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 p-6">
        <div className="max-w-7xl mx-auto">
          <ItemsHeader />
          <div className="flex items-center justify-center py-12">
            <div className="text-xl text-slate-600">Loading menu items...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        <ItemsHeader />

        {/* Pass down the categories (names) for filter buttons */}
        <ItemsControls
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onAddItem={handleAddItem}
        />

        <ItemsDisplay
          viewMode={viewMode}
          filteredItems={filteredItems}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleAvailability={handleToggleAvailability}
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
        />

        {/* For the ItemForm dropdown, send only actual categories (without 'All') */}
        <ItemForm
          isOpen={isFormOpen}
          onClose={handleFormClose}
          editingItem={editingItem}
          formData={formData}
          setFormData={setFormData}
          onSave={handleSave}
          categories={categoryObjects.filter(c => c.is_active).map(c => c.name)}
        />
      </div>
      <Toaster />
    </div>
  );
}
