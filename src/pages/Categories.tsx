
import { useState } from "react";
import { Grid3X3, Plus, Search, Edit, Trash2, Eye, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  itemCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const initialCategories: Category[] = [
  {
    id: '1',
    name: 'Burgers',
    description: 'Delicious beef, chicken, and veggie burgers with various toppings',
    color: '#ef4444',
    itemCount: 12,
    isActive: true,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20'
  },
  {
    id: '2',
    name: 'Pizza',
    description: 'Fresh baked pizzas with authentic Italian flavors',
    color: '#f97316',
    itemCount: 8,
    isActive: true,
    createdAt: '2024-01-16',
    updatedAt: '2024-01-18'
  },
  {
    id: '3',
    name: 'Salads',
    description: 'Fresh and healthy salad options with premium ingredients',
    color: '#22c55e',
    itemCount: 6,
    isActive: true,
    createdAt: '2024-01-17',
    updatedAt: '2024-01-19'
  },
  {
    id: '4',
    name: 'Beverages',
    description: 'Refreshing drinks, sodas, juices, and specialty beverages',
    color: '#3b82f6',
    itemCount: 15,
    isActive: true,
    createdAt: '2024-01-18',
    updatedAt: '2024-01-21'
  },
  {
    id: '5',
    name: 'Desserts',
    description: 'Sweet treats and desserts to end your meal perfectly',
    color: '#a855f7',
    itemCount: 7,
    isActive: true,
    createdAt: '2024-01-19',
    updatedAt: '2024-01-22'
  },
  {
    id: '6',
    name: 'Seafood',
    description: 'Fresh seafood dishes prepared with the finest ingredients',
    color: '#06b6d4',
    itemCount: 9,
    isActive: false,
    createdAt: '2024-01-20',
    updatedAt: '2024-01-23'
  }
];

const colorOptions = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
  '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
  '#ec4899', '#f43f5e'
];

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3b82f6'
  });
  const { toast } = useToast();

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Category name is required",
        variant: "destructive"
      });
      return;
    }

    if (editingCategory) {
      setCategories(prev => prev.map(cat => 
        cat.id === editingCategory.id 
          ? { ...cat, ...formData, updatedAt: new Date().toISOString().split('T')[0] }
          : cat
      ));
      toast({
        title: "Category Updated",
        description: `${formData.name} has been updated successfully`
      });
    } else {
      const newCategory: Category = {
        id: Date.now().toString(),
        ...formData,
        itemCount: 0,
        isActive: true,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };
      setCategories(prev => [...prev, newCategory]);
      toast({
        title: "Category Created",
        description: `${formData.name} has been created successfully`
      });
    }

    handleCloseDialog();
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      color: category.color
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    const category = categories.find(cat => cat.id === id);
    if (category && category.itemCount > 0) {
      toast({
        title: "Cannot Delete Category",
        description: "This category contains items. Please remove all items first.",
        variant: "destructive"
      });
      return;
    }

    setCategories(prev => prev.filter(cat => cat.id !== id));
    toast({
      title: "Category Deleted",
      description: "Category has been deleted successfully"
    });
  };

  const toggleStatus = (id: string) => {
    setCategories(prev => prev.map(cat =>
      cat.id === id ? { ...cat, isActive: !cat.isActive } : cat
    ));
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingCategory(null);
    setFormData({ name: '', description: '', color: '#3b82f6' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center justify-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
              <Grid3X3 className="w-10 h-10 text-white" />
            </div>
            Category Management
          </h1>
          <p className="text-xl text-slate-600 mt-4 font-medium">Organize and manage your menu categories</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-lg bg-white/90 backdrop-blur-sm border-2 focus:border-blue-400"
            />
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="h-12 px-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 font-bold text-lg"
                onClick={() => setEditingCategory(null)}
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">
                  {editingCategory ? 'Edit Category' : 'Create New Category'}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-bold">Category Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter category name"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description" className="text-sm font-bold">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter category description"
                    className="mt-1"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label className="text-sm font-bold">Color</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {colorOptions.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, color }))}
                        className={`w-8 h-8 rounded-full border-2 ${
                          formData.color === color ? 'border-slate-800' : 'border-slate-300'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" onClick={handleCloseDialog} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={handleSave} className="flex-1 bg-blue-500 hover:bg-blue-600">
                    {editingCategory ? 'Update' : 'Create'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Total Categories</p>
                  <p className="text-3xl font-black">{categories.length}</p>
                </div>
                <Grid3X3 className="w-12 h-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Active Categories</p>
                  <p className="text-3xl font-black">{categories.filter(c => c.isActive).length}</p>
                </div>
                <Eye className="w-12 h-12 text-green-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Total Items</p>
                  <p className="text-3xl font-black">{categories.reduce((sum, cat) => sum + cat.itemCount, 0)}</p>
                </div>
                <Package className="w-12 h-12 text-purple-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Avg Items/Category</p>
                  <p className="text-3xl font-black">
                    {categories.length > 0 ? Math.round(categories.reduce((sum, cat) => sum + cat.itemCount, 0) / categories.length) : 0}
                  </p>
                </div>
                <Grid3X3 className="w-12 h-12 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map(category => (
            <Card key={category.id} className="hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200 bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full border-2 border-white shadow-md"
                      style={{ backgroundColor: category.color }}
                    />
                    <div>
                      <CardTitle className="text-xl font-bold text-slate-800">{category.name}</CardTitle>
                      <Badge 
                        variant={category.isActive ? "default" : "secondary"}
                        className={category.isActive ? "bg-green-500" : "bg-gray-400"}
                      >
                        {category.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                  <Badge variant="outline" className="font-bold">
                    {category.itemCount} items
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-slate-600 text-sm">{category.description}</p>
                
                <div className="text-xs text-slate-500 space-y-1">
                  <p>Created: {category.createdAt}</p>
                  <p>Updated: {category.updatedAt}</p>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(category)}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  
                  <Button
                    size="sm"
                    variant={category.isActive ? "secondary" : "default"}
                    onClick={() => toggleStatus(category.id)}
                    className="flex-1"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    {category.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(category.id)}
                    disabled={category.itemCount > 0}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <Grid3X3 className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-600 mb-2">No categories found</h3>
            <p className="text-slate-500">
              {searchTerm ? 'Try adjusting your search terms' : 'Create your first category to get started'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
