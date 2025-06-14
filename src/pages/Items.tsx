
import { useState } from "react";
import { Package, Plus, Search, Edit, Trash2, Eye, ImageIcon, DollarSign, Star, Archive, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
const allergensList = ['Gluten', 'Dairy', 'Eggs', 'Nuts', 'Fish', 'Anchovies', 'Soy', 'Shellfish'];

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

  const lowStockItems = items.filter(item => item.stockCount <= item.lowStockAlert);
  const outOfStockItems = items.filter(item => item.stockCount === 0);

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
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="h-12 px-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 font-bold text-lg"
                onClick={() => setEditingItem(null)}
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">
                  {editingItem ? 'Edit Item' : 'Create New Item'}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-sm font-bold">Item Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter item name"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="price" className="text-sm font-bold">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                      placeholder="0.00"
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description" className="text-sm font-bold">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter item description"
                    className="mt-1"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category" className="text-sm font-bold">Category</Label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="mt-1 w-full h-10 px-3 rounded-md border border-input bg-background"
                    >
                      {categories.filter(cat => cat !== 'All').map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="image" className="text-sm font-bold">Image URL</Label>
                    <Input
                      id="image"
                      value={formData.image}
                      onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                      placeholder="https://..."
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="stockCount" className="text-sm font-bold">Stock Count</Label>
                    <Input
                      id="stockCount"
                      type="number"
                      value={formData.stockCount}
                      onChange={(e) => setFormData(prev => ({ ...prev, stockCount: parseInt(e.target.value) || 0 }))}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="lowStockAlert" className="text-sm font-bold">Low Stock Alert</Label>
                    <Input
                      id="lowStockAlert"
                      type="number"
                      value={formData.lowStockAlert}
                      onChange={(e) => setFormData(prev => ({ ...prev, lowStockAlert: parseInt(e.target.value) || 5 }))}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="preparationTime" className="text-sm font-bold">Prep Time (min)</Label>
                    <Input
                      id="preparationTime"
                      type="number"
                      value={formData.preparationTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, preparationTime: parseInt(e.target.value) || 5 }))}
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-bold">Dietary Options</Label>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.isVegetarian}
                        onChange={(e) => setFormData(prev => ({ ...prev, isVegetarian: e.target.checked }))}
                      />
                      <span className="text-sm">Vegetarian</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.isVegan}
                        onChange={(e) => setFormData(prev => ({ ...prev, isVegan: e.target.checked }))}
                      />
                      <span className="text-sm">Vegan</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.isGlutenFree}
                        onChange={(e) => setFormData(prev => ({ ...prev, isGlutenFree: e.target.checked }))}
                      />
                      <span className="text-sm">Gluten Free</span>
                    </label>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" onClick={handleCloseDialog} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={handleSave} className="flex-1 bg-blue-500 hover:bg-blue-600">
                    {editingItem ? 'Update' : 'Create'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Total Items</p>
                  <p className="text-3xl font-black">{items.length}</p>
                </div>
                <Package className="w-12 h-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Available Items</p>
                  <p className="text-3xl font-black">{items.filter(i => i.isAvailable).length}</p>
                </div>
                <Eye className="w-12 h-12 text-green-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100">Low Stock</p>
                  <p className="text-3xl font-black">{lowStockItems.length}</p>
                </div>
                <Star className="w-12 h-12 text-yellow-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100">Out of Stock</p>
                  <p className="text-3xl font-black">{outOfStockItems.length}</p>
                </div>
                <Archive className="w-12 h-12 text-red-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Avg Price</p>
                  <p className="text-3xl font-black">
                    ${items.length > 0 ? (items.reduce((sum, item) => sum + item.price, 0) / items.length).toFixed(2) : '0.00'}
                  </p>
                </div>
                <DollarSign className="w-12 h-12 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Items Display */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(item => (
              <Card key={item.id} className="hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200 bg-white/90 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="relative">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg flex items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-slate-400" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex gap-1">
                      {item.isVegetarian && <Badge className="bg-green-500 text-xs">V</Badge>}
                      {item.isVegan && <Badge className="bg-green-600 text-xs">VG</Badge>}
                      {item.isGlutenFree && <Badge className="bg-yellow-500 text-xs">GF</Badge>}
                    </div>
                  </div>
                  
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold text-slate-800">{item.name}</CardTitle>
                      <p className="text-2xl font-black text-green-600">${item.price}</p>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={item.isAvailable ? "default" : "secondary"}
                        className={item.isAvailable ? "bg-green-500" : "bg-red-500"}
                      >
                        {item.isAvailable ? 'Available' : 'Unavailable'}
                      </Badge>
                      <p className="text-sm text-slate-500 mt-1">{item.category}</p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-slate-600 text-sm">{item.description}</p>
                  
                  <div className="flex justify-between text-sm">
                    <span>Stock: <Badge variant="outline">{item.stockCount}</Badge></span>
                    <span>Prep: {item.preparationTime}min</span>
                    <span>{item.calories} cal</span>
                  </div>
                  
                  {item.stockCount <= item.lowStockAlert && (
                    <Badge variant="destructive" className="w-full justify-center">
                      {item.stockCount === 0 ? 'Out of Stock' : 'Low Stock'}
                    </Badge>
                  )}
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(item)}
                      className="flex-1"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    
                    <Button
                      size="sm"
                      variant={item.isAvailable ? "secondary" : "default"}
                      onClick={() => toggleAvailability(item.id)}
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      {item.isAvailable ? 'Hide' : 'Show'}
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                      ) : (
                        <div className="w-12 h-12 bg-slate-200 rounded flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-slate-400" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-bold">{item.name}</p>
                        <p className="text-sm text-slate-500">{item.description.substring(0, 50)}...</p>
                      </div>
                    </TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell className="font-bold text-green-600">${item.price}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={item.stockCount <= item.lowStockAlert ? "destructive" : "outline"}
                      >
                        {item.stockCount}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={item.isAvailable ? "default" : "secondary"}
                        className={item.isAvailable ? "bg-green-500" : "bg-red-500"}
                      >
                        {item.isAvailable ? 'Available' : 'Unavailable'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant={item.isAvailable ? "secondary" : "default"}
                          onClick={() => toggleAvailability(item.id)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
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
      </div>
    </div>
  );
}
