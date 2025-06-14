import { useState } from "react";
import { Package, Plus, Search, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import ItemStats from "@/components/items/ItemStats";
import ItemCard from "@/components/items/ItemCard";
import ItemTable from "@/components/items/ItemTable";
import ItemForm from "@/components/items/ItemForm";

interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isAvailable: boolean;
  stockCount: number;
  lowStockAlert: number;
  allergens: string[];
  modifiers: string[];
  preparationTime: number;
  calories: number;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  createdAt: string;
  updatedAt: string;
}

const initialItems: Item[] = [
  {
    id: '1',
    name: 'Classic Beef Burger',
    description: 'Juicy beef patty with lettuce, tomato, onion, and our special sauce',
    price: 12.99,
    category: 'Burgers',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300',
    isAvailable: true,
    stockCount: 25,
    lowStockAlert: 5,
    allergens: ['Gluten', 'Dairy'],
    modifiers: ['Extra Cheese', 'Bacon', 'No Onion'],
    preparationTime: 8,
    calories: 650,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20'
  },
  {
    id: '2',
    name: 'Margherita Pizza',
    description: 'Fresh mozzarella, tomato sauce, and basil on a crispy crust',
    price: 14.50,
    category: 'Pizza',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300',
    isAvailable: true,
    stockCount: 18,
    lowStockAlert: 3,
    allergens: ['Gluten', 'Dairy'],
    modifiers: ['Extra Cheese', 'Olives', 'Pepperoni'],
    preparationTime: 12,
    calories: 580,
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false,
    createdAt: '2024-01-16',
    updatedAt: '2024-01-18'
  },
  {
    id: '3',
    name: 'Caesar Salad',
    description: 'Crisp romaine lettuce, croutons, parmesan cheese, and caesar dressing',
    price: 9.99,
    category: 'Salads',
    image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=300',
    isAvailable: true,
    stockCount: 12,
    lowStockAlert: 2,
    allergens: ['Dairy', 'Anchovies'],
    modifiers: ['Grilled Chicken', 'Extra Croutons', 'No Anchovies'],
    preparationTime: 5,
    calories: 320,
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false,
    createdAt: '2024-01-17',
    updatedAt: '2024-01-19'
  },
  {
    id: '4',
    name: 'Fresh Orange Juice',
    description: 'Freshly squeezed orange juice served chilled',
    price: 4.99,
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=300',
    isAvailable: true,
    stockCount: 30,
    lowStockAlert: 8,
    allergens: [],
    modifiers: ['Large Size', 'Extra Pulp', 'No Ice'],
    preparationTime: 2,
    calories: 110,
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
    createdAt: '2024-01-18',
    updatedAt: '2024-01-21'
  },
  {
    id: '5',
    name: 'Chocolate Brownie',
    description: 'Rich chocolate brownie served warm with vanilla ice cream',
    price: 7.50,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300',
    isAvailable: false,
    stockCount: 0,
    lowStockAlert: 5,
    allergens: ['Gluten', 'Dairy', 'Eggs', 'Nuts'],
    modifiers: ['Extra Ice Cream', 'Whipped Cream', 'No Nuts'],
    preparationTime: 6,
    calories: 450,
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false,
    createdAt: '2024-01-19',
    updatedAt: '2024-01-22'
  },
  {
    id: '6',
    name: 'Grilled Salmon',
    description: 'Atlantic salmon grilled to perfection with lemon herbs',
    price: 22.99,
    category: 'Seafood',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=300',
    isAvailable: true,
    stockCount: 8,
    lowStockAlert: 3,
    allergens: ['Fish'],
    modifiers: ['Rice', 'Vegetables', 'Extra Lemon'],
    preparationTime: 15,
    calories: 380,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: true,
    createdAt: '2024-01-20',
    updatedAt: '2024-01-23'
  }
];

const categories = ['All', 'Burgers', 'Pizza', 'Salads', 'Beverages', 'Desserts', 'Seafood'];

export default function Items() {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: 'Burgers',
    image: '',
    stockCount: 0,
    lowStockAlert: 5,
    allergens: [] as string[],
    modifiers: [] as string[],
    preparationTime: 5,
    calories: 0,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false
  });
  const { toast } = useToast();

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Item name is required",
        variant: "destructive"
      });
      return;
    }

    if (formData.price <= 0) {
      toast({
        title: "Validation Error",
        description: "Price must be greater than 0",
        variant: "destructive"
      });
      return;
    }

    if (editingItem) {
      setItems(prev => prev.map(item => 
        item.id === editingItem.id 
          ? { 
              ...item, 
              ...formData,
              isAvailable: formData.stockCount > 0,
              updatedAt: new Date().toISOString().split('T')[0] 
            }
          : item
      ));
      toast({
        title: "Item Updated",
        description: `${formData.name} has been updated successfully`
      });
    } else {
      const newItem: Item = {
        id: Date.now().toString(),
        ...formData,
        isAvailable: formData.stockCount > 0,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };
      setItems(prev => [...prev, newItem]);
      toast({
        title: "Item Created",
        description: `${formData.name} has been created successfully`
      });
    }

    handleCloseDialog();
  };

  const handleEdit = (item: Item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image: item.image,
      stockCount: item.stockCount,
      lowStockAlert: item.lowStockAlert,
      allergens: item.allergens,
      modifiers: item.modifiers,
      preparationTime: item.preparationTime,
      calories: item.calories,
      isVegetarian: item.isVegetarian,
      isVegan: item.isVegan,
      isGlutenFree: item.isGlutenFree
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Item Deleted",
      description: "Item has been deleted successfully"
    });
  };

  const toggleAvailability = (id: string) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
    ));
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      category: 'Burgers',
      image: '',
      stockCount: 0,
      lowStockAlert: 5,
      allergens: [],
      modifiers: [],
      preparationTime: 5,
      calories: 0,
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent flex items-center justify-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-xl">
              <Package className="w-10 h-10 text-white" />
            </div>
            Item Management
          </h1>
          <p className="text-xl text-slate-600 mt-4 font-medium">Manage your menu items and inventory</p>
        </div>

        {/* Controls */}
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
            onClick={() => {
              setEditingItem(null);
              setIsDialogOpen(true);
            }}
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Item
          </Button>
        </div>

        {/* Statistics */}
        <ItemStats items={items} />

        {/* Items Display */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(item => (
              <ItemCard
                key={item.id}
                item={item}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleAvailability={toggleAvailability}
              />
            ))}
          </div>
        ) : (
          <ItemTable
            items={filteredItems}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleAvailability={toggleAvailability}
          />
        )}

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-600 mb-2">No items found</h3>
            <p className="text-slate-500">
              {searchTerm || selectedCategory !== 'All' 
                ? 'Try adjusting your search or filter' 
                : 'Create your first item to get started'}
            </p>
          </div>
        )}

        <ItemForm
          isOpen={isDialogOpen}
          onClose={handleCloseDialog}
          editingItem={editingItem}
          formData={formData}
          setFormData={setFormData}
          onSave={handleSave}
          categories={categories}
        />
      </div>
    </div>
  );
}
