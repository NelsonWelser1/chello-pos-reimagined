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
  // HOT STARTERS - SOUPS
  {
    id: '1',
    name: 'Vegetables Clear Soup',
    description: 'Fresh vegetables in clear broth',
    price: 15.00,
    category: 'Hot Starters',
    image: '/lovable-uploads/19d37793-8356-4039-8e0e-2c4ab8fb2710.png',
    isAvailable: true,
    stockCount: 25,
    lowStockAlert: 5,
    allergens: [],
    modifiers: ['Extra Vegetables', 'Spicy'],
    preparationTime: 10,
    calories: 85,
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20'
  },
  {
    id: '2',
    name: 'Vegetables Cream Soup',
    description: 'Creamy vegetable soup with herbs',
    price: 20.00,
    category: 'Hot Starters',
    image: '/lovable-uploads/19d37793-8356-4039-8e0e-2c4ab8fb2710.png',
    isAvailable: true,
    stockCount: 20,
    lowStockAlert: 3,
    allergens: ['Dairy'],
    modifiers: ['Extra Cream', 'Herbs'],
    preparationTime: 12,
    calories: 180,
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: true,
    createdAt: '2024-01-16',
    updatedAt: '2024-01-18'
  },
  {
    id: '3',
    name: 'Chicken Minestrone Soup',
    description: 'Hearty Italian soup with chicken and vegetables',
    price: 20.00,
    category: 'Hot Starters',
    image: '/lovable-uploads/19d37793-8356-4039-8e0e-2c4ab8fb2710.png',
    isAvailable: true,
    stockCount: 15,
    lowStockAlert: 3,
    allergens: ['Gluten'],
    modifiers: ['Extra Chicken', 'Spicy'],
    preparationTime: 15,
    calories: 220,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    createdAt: '2024-01-17',
    updatedAt: '2024-01-19'
  },
  // MAIN COURSE - VEGETARIAN
  {
    id: '4',
    name: 'Taawa Mushroom',
    description: 'Mixed berry peppers, whole Mushroom Cashew nuts, finished in cream, Sauce and Indian Spices - Served with Rice',
    price: 30.00,
    category: 'Main Course',
    image: '/lovable-uploads/19d37793-8356-4039-8e0e-2c4ab8fb2710.png',
    isAvailable: true,
    stockCount: 18,
    lowStockAlert: 4,
    allergens: ['Dairy', 'Nuts'],
    modifiers: ['Extra Mushrooms', 'Spicy', 'No Nuts'],
    preparationTime: 20,
    calories: 380,
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: true,
    createdAt: '2024-01-18',
    updatedAt: '2024-01-21'
  },
  {
    id: '5',
    name: 'Vegetables BBQ Balls',
    description: 'Seasoned mixed Vegetables, mixed with Aromatic Spices, Finished in BBQ Sauce, served with Rice and Chapati',
    price: 30.00,
    category: 'Main Course',
    image: '/lovable-uploads/19d37793-8356-4039-8e0e-2c4ab8fb2710.png',
    isAvailable: true,
    stockCount: 22,
    lowStockAlert: 5,
    allergens: ['Gluten'],
    modifiers: ['Extra BBQ Sauce', 'No Chapati'],
    preparationTime: 18,
    calories: 420,
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: false,
    createdAt: '2024-01-19',
    updatedAt: '2024-01-22'
  },
  // PIZZA CORNER
  {
    id: '6',
    name: 'Margherita Pizza',
    description: 'Tomato concasse, mozzarella cheese and oregano',
    price: 30.00,
    category: 'Pizza',
    image: '/lovable-uploads/d6676517-8dfb-4b06-8137-c48dd353c02d.png',
    isAvailable: true,
    stockCount: 15,
    lowStockAlert: 3,
    allergens: ['Gluten', 'Dairy'],
    modifiers: ['Large Size', 'Extra Cheese', 'Thin Crust'],
    preparationTime: 15,
    calories: 580,
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false,
    createdAt: '2024-01-20',
    updatedAt: '2024-01-23'
  },
  {
    id: '7',
    name: 'Metric Chello Pizza Large',
    description: 'A Grilled combo meat, beef, chicken, sausages, and vegetables, cheese, Oregano',
    price: 40.00,
    category: 'Pizza',
    image: '/lovable-uploads/d6676517-8dfb-4b06-8137-c48dd353c02d.png',
    isAvailable: true,
    stockCount: 10,
    lowStockAlert: 2,
    allergens: ['Gluten', 'Dairy'],
    modifiers: ['Medium Size', 'Extra Meat', 'Spicy'],
    preparationTime: 20,
    calories: 750,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    createdAt: '2024-01-21',
    updatedAt: '2024-01-24'
  },
  // MAIN COURSE - CHICKEN
  {
    id: '8',
    name: 'Oven Grilled Chicken',
    description: 'A Choice of Chicken part on bone either the Thigh or breast marinaded in a mild spices and oven Grilled to perfection',
    price: 36.00,
    category: 'Chicken',
    image: '/lovable-uploads/d6676517-8dfb-4b06-8137-c48dd353c02d.png',
    isAvailable: true,
    stockCount: 12,
    lowStockAlert: 3,
    allergens: [],
    modifiers: ['Thigh', 'Breast', 'Extra Spicy'],
    preparationTime: 25,
    calories: 480,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: true,
    createdAt: '2024-01-22',
    updatedAt: '2024-01-25'
  },
  {
    id: '9',
    name: 'Metric Whole Chicken',
    description: 'A choice of Grilled or fried whole chicken marinaded in mild spices served with brown rice and chips',
    price: 80.00,
    category: 'Chicken',
    image: '/lovable-uploads/d6676517-8dfb-4b06-8137-c48dd353c02d.png',
    isAvailable: true,
    stockCount: 8,
    lowStockAlert: 2,
    allergens: [],
    modifiers: ['Grilled', 'Fried', 'Extra Rice'],
    preparationTime: 35,
    calories: 1200,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: true,
    createdAt: '2024-01-23',
    updatedAt: '2024-01-26'
  },
  // BEEF TOLL
  {
    id: '10',
    name: 'Grilled Beef Steak',
    description: 'A tender beef fillet marinated with soy sauce, garlic, peppers served with mushroom sauce, Chips or rice',
    price: 30.00,
    category: 'Beef',
    image: '/lovable-uploads/78cd53f6-59c5-4e65-b665-25dd36239651.png',
    isAvailable: true,
    stockCount: 14,
    lowStockAlert: 3,
    allergens: ['Soy'],
    modifiers: ['Medium Rare', 'Well Done', 'Extra Sauce'],
    preparationTime: 22,
    calories: 520,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: true,
    createdAt: '2024-01-24',
    updatedAt: '2024-01-27'
  },
  {
    id: '11',
    name: 'Beef Muchomo',
    description: 'Boneless tender beef cubes roasted with onions and skewered with tomatoes green berry paper served with banana fingers or chips',
    price: 29.00,
    category: 'Beef',
    image: '/lovable-uploads/78cd53f6-59c5-4e65-b665-25dd36239651.png',
    isAvailable: true,
    stockCount: 16,
    lowStockAlert: 4,
    allergens: [],
    modifiers: ['Banana Fingers', 'Chips', 'Extra Spicy'],
    preparationTime: 20,
    calories: 450,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: true,
    createdAt: '2024-01-25',
    updatedAt: '2024-01-28'
  },
  // FISH ROUND
  {
    id: '12',
    name: 'Grilled Fish Fillet',
    description: 'Garlic butter Marinated fish fillet grilled with paprika sauce, served with tartar sauce accompanied by rice, wedges',
    price: 35.00,
    category: 'Fish',
    image: '/lovable-uploads/78cd53f6-59c5-4e65-b665-25dd36239651.png',
    isAvailable: true,
    stockCount: 10,
    lowStockAlert: 2,
    allergens: ['Fish', 'Dairy'],
    modifiers: ['Extra Tartar Sauce', 'Lemon', 'Spicy'],
    preparationTime: 18,
    calories: 380,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: true,
    createdAt: '2024-01-26',
    updatedAt: '2024-01-29'
  },
  {
    id: '13',
    name: 'Metric Fried Whole Fish',
    description: 'A lake Victoria Whole fish seasoned with lemon juice and deep fried, served with topped vegetables, chips or wedges',
    price: 49.00,
    category: 'Fish',
    image: '/lovable-uploads/78cd53f6-59c5-4e65-b665-25dd36239651.png',
    isAvailable: true,
    stockCount: 6,
    lowStockAlert: 1,
    allergens: ['Fish'],
    modifiers: ['Chips', 'Wedges', 'Extra Vegetables'],
    preparationTime: 25,
    calories: 650,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: true,
    createdAt: '2024-01-27',
    updatedAt: '2024-01-30'
  },
  // INDIAN CORNER
  {
    id: '14',
    name: 'Chicken Tikka Masala',
    description: 'Boneless chicken cubes marinated in Indian home made spices and cooked with tomato gravy Served with Chapati or rice',
    price: 35.00,
    category: 'Indian',
    image: '/lovable-uploads/d2fddca9-8a5a-48c2-b950-2aa02db1232a.png',
    isAvailable: true,
    stockCount: 18,
    lowStockAlert: 4,
    allergens: ['Dairy', 'Gluten'],
    modifiers: ['Chapati', 'Rice', 'Extra Spicy'],
    preparationTime: 22,
    calories: 480,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    createdAt: '2024-01-28',
    updatedAt: '2024-01-31'
  },
  {
    id: '15',
    name: 'Butter Chicken',
    description: 'Spiced Chicken cubes marinated overnight and cooked in mild butter sauce served with rice',
    price: 37.00,
    category: 'Indian',
    image: '/lovable-uploads/d2fddca9-8a5a-48c2-b950-2aa02db1232a.png',
    isAvailable: true,
    stockCount: 15,
    lowStockAlert: 3,
    allergens: ['Dairy'],
    modifiers: ['Extra Butter', 'Mild', 'Medium Spicy'],
    preparationTime: 25,
    calories: 550,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: true,
    createdAt: '2024-01-29',
    updatedAt: '2024-02-01'
  },
  // GOAT
  {
    id: '16',
    name: 'Pan Fried Goat',
    description: 'Tender pieces of goats meat pan fried with all berry pepper in a think gravy, served with chips / rice',
    price: 38.00,
    category: 'Goat',
    image: '/lovable-uploads/d2fddca9-8a5a-48c2-b950-2aa02db1232a.png',
    isAvailable: true,
    stockCount: 12,
    lowStockAlert: 3,
    allergens: [],
    modifiers: ['Chips', 'Rice', 'Extra Gravy'],
    preparationTime: 30,
    calories: 580,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: true,
    createdAt: '2024-01-30',
    updatedAt: '2024-02-02'
  },
  {
    id: '17',
    name: 'Goat Muchomo Per Kg',
    description: 'ROASTED NYAMA CHOMA with Kachumbari. Served with baked matooke or Roasted potatoes',
    price: 60.00,
    category: 'Goat',
    image: '/lovable-uploads/d2fddca9-8a5a-48c2-b950-2aa02db1232a.png',
    isAvailable: true,
    stockCount: 8,
    lowStockAlert: 2,
    allergens: [],
    modifiers: ['Baked Matooke', 'Roasted Potatoes', 'Extra Kachumbari'],
    preparationTime: 40,
    calories: 720,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: true,
    createdAt: '2024-01-31',
    updatedAt: '2024-02-03'
  },
  // BURGERS
  {
    id: '18',
    name: 'Grilled Chicken Burger',
    description: 'Overnight marinated chicken breast sandwiched between a soft burger bun with fresh layers of vegetables and cheddar cheese, served with chips',
    price: 32.00,
    category: 'Burgers',
    image: '/lovable-uploads/ccd29f06-723a-44f2-972d-7bb895cf8a9e.png',
    isAvailable: true,
    stockCount: 20,
    lowStockAlert: 5,
    allergens: ['Gluten', 'Dairy'],
    modifiers: ['No Cheese', 'Extra Vegetables', 'Spicy'],
    preparationTime: 15,
    calories: 650,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    createdAt: '2024-02-01',
    updatedAt: '2024-02-04'
  },
  {
    id: '19',
    name: 'Metric Heavy Burger',
    description: 'Two meat parties with a choice of Beef or Chicken, sandwiched with creamy mushroom and fried eggs, served with chips',
    price: 35.00,
    category: 'Burgers',
    image: '/lovable-uploads/ccd29f06-723a-44f2-972d-7bb895cf8a9e.png',
    isAvailable: true,
    stockCount: 15,
    lowStockAlert: 3,
    allergens: ['Gluten', 'Dairy', 'Eggs'],
    modifiers: ['Beef', 'Chicken', 'No Mushroom'],
    preparationTime: 18,
    calories: 850,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    createdAt: '2024-02-02',
    updatedAt: '2024-02-05'
  },
  // SPAGHETTI
  {
    id: '20',
    name: 'Spaghetti Bolognaise',
    description: 'Italian spaghetti smoothened in savory and flavor full minced meat, topped with cheese',
    price: 30.00,
    category: 'Pasta',
    image: '/lovable-uploads/f71433c6-1ae3-42c4-b356-4cb6be6ed173.png',
    isAvailable: true,
    stockCount: 25,
    lowStockAlert: 5,
    allergens: ['Gluten', 'Dairy'],
    modifiers: ['Extra Cheese', 'Extra Meat', 'Vegetarian'],
    preparationTime: 20,
    calories: 680,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    createdAt: '2024-02-03',
    updatedAt: '2024-02-06'
  },
  // DESSERTS
  {
    id: '21',
    name: 'Fruit Sundae',
    description: 'American dessert with mixed fruits topped with a scoop of a cream, and chocolate syrup',
    price: 20.00,
    category: 'Desserts',
    image: '/lovable-uploads/f71433c6-1ae3-42c4-b356-4cb6be6ed173.png',
    isAvailable: true,
    stockCount: 30,
    lowStockAlert: 8,
    allergens: ['Dairy'],
    modifiers: ['Extra Cream', 'No Chocolate', 'Extra Fruits'],
    preparationTime: 8,
    calories: 320,
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: true,
    createdAt: '2024-02-04',
    updatedAt: '2024-02-07'
  },
  {
    id: '22',
    name: 'Banana Split',
    description: 'Caramelised banana served with ice cream and a chocolate syrup',
    price: 18.00,
    category: 'Desserts',
    image: '/lovable-uploads/f71433c6-1ae3-42c4-b356-4cb6be6ed173.png',
    isAvailable: true,
    stockCount: 25,
    lowStockAlert: 6,
    allergens: ['Dairy'],
    modifiers: ['Extra Ice Cream', 'No Chocolate', 'Vanilla'],
    preparationTime: 10,
    calories: 380,
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: true,
    createdAt: '2024-02-05',
    updatedAt: '2024-02-08'
  }
];

const categories = ['All', 'Hot Starters', 'Main Course', 'Pizza', 'Chicken', 'Beef', 'Fish', 'Indian', 'Goat', 'Burgers', 'Pasta', 'Desserts'];

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
    category: 'Hot Starters',
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
      category: 'Hot Starters',
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
            Metric Cafe Menu Management
          </h1>
          <p className="text-xl text-slate-600 mt-4 font-medium">Manage your authentic Metric Cafe menu items</p>
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
