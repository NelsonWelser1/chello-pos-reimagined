
import { useState } from "react";
import { ShoppingCart, Plus, Minus, CreditCard, DollarSign, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
  description?: string;
}

interface CartItem extends MenuItem {
  quantity: number;
}

const menuItems: MenuItem[] = [
  { id: '1', name: 'Classic Burger', price: 12.99, category: 'Burgers', description: 'Beef patty with lettuce, tomato, onion' },
  { id: '2', name: 'Chicken Caesar Salad', price: 10.99, category: 'Salads', description: 'Fresh romaine with grilled chicken' },
  { id: '3', name: 'Margherita Pizza', price: 14.99, category: 'Pizza', description: 'Fresh mozzarella, basil, marinara' },
  { id: '4', name: 'Fish & Chips', price: 15.99, category: 'Seafood', description: 'Beer battered cod with fries' },
  { id: '5', name: 'Chocolate Cake', price: 6.99, category: 'Desserts', description: 'Rich chocolate layer cake' },
  { id: '6', name: 'Coca Cola', price: 2.99, category: 'Beverages', description: 'Classic refreshing cola' },
  { id: '7', name: 'BBQ Ribs', price: 18.99, category: 'Main Course', description: 'Slow cooked pork ribs with BBQ sauce' },
  { id: '8', name: 'Greek Salad', price: 9.99, category: 'Salads', description: 'Feta, olives, cucumber, tomatoes' },
];

const categories = ['All', 'Burgers', 'Salads', 'Pizza', 'Seafood', 'Desserts', 'Beverages', 'Main Course'];

export default function POS() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('card');
  const { toast } = useToast();

  const filteredItems = selectedCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(cartItem => cartItem.id === item.id);
      if (existing) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => {
      const existing = prev.find(cartItem => cartItem.id === id);
      if (existing && existing.quantity > 1) {
        return prev.map(cartItem =>
          cartItem.id === id
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        );
      }
      return prev.filter(cartItem => cartItem.id !== id);
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const processPayment = () => {
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to cart before processing payment.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Payment Processed",
      description: `Order #${Date.now()} processed successfully via ${paymentMethod}`,
    });
    
    setCart([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center justify-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
              <ShoppingCart className="w-10 h-10 text-white" />
            </div>
            Point of Sale System
          </h1>
          <p className="text-xl text-slate-600 mt-4 font-medium">Fast and efficient order management</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-black text-slate-800">Menu Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-6">
                  {categories.map(category => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      onClick={() => setSelectedCategory(category)}
                      className={`font-bold ${selectedCategory === category 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                        : 'hover:bg-blue-50'}`}
                    >
                      {category}
                    </Button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredItems.map(item => (
                    <Card key={item.id} className="hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-200 bg-gradient-to-br from-white to-slate-50">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <h3 className="font-bold text-lg text-slate-800">{item.name}</h3>
                            <Badge variant="secondary" className="bg-green-100 text-green-800 font-bold">
                              ${item.price.toFixed(2)}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600">{item.description}</p>
                          <Button 
                            onClick={() => addToCart(item)}
                            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 font-bold"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add to Cart
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cart Section */}
          <div className="space-y-6">
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-black text-slate-800 flex items-center justify-between">
                  Current Order
                  <Badge className="bg-blue-500 text-white font-bold text-lg px-3 py-1">
                    {getTotalItems()} items
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                    <p className="text-slate-500 font-medium">Cart is empty</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border">
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-800">{item.name}</h4>
                          <p className="text-sm text-slate-600">${item.price.toFixed(2)} each</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeFromCart(item.id)}
                            className="w-8 h-8 p-0"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-8 text-center font-bold">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => addToCart(item)}
                            className="w-8 h-8 p-0"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Section */}
            {cart.length > 0 && (
              <Card className="shadow-xl border-0 bg-gradient-to-br from-green-50 to-emerald-50">
                <CardHeader>
                  <CardTitle className="text-2xl font-black text-slate-800">Payment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-bold">Subtotal:</span>
                    <span className="font-black">${getTotalAmount().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-bold">Tax (8.5%):</span>
                    <span className="font-black">${(getTotalAmount() * 0.085).toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center text-xl">
                    <span className="font-black">Total:</span>
                    <span className="font-black text-2xl text-green-600">
                      ${(getTotalAmount() * 1.085).toFixed(2)}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <p className="font-bold text-slate-700">Payment Method:</p>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant={paymentMethod === 'card' ? "default" : "outline"}
                        onClick={() => setPaymentMethod('card')}
                        className={paymentMethod === 'card' ? 'bg-blue-500 hover:bg-blue-600' : ''}
                      >
                        <CreditCard className="w-4 h-4 mr-2" />
                        Card
                      </Button>
                      <Button
                        variant={paymentMethod === 'cash' ? "default" : "outline"}
                        onClick={() => setPaymentMethod('cash')}
                        className={paymentMethod === 'cash' ? 'bg-green-500 hover:bg-green-600' : ''}
                      >
                        <DollarSign className="w-4 h-4 mr-2" />
                        Cash
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline" 
                      onClick={clearCart}
                      className="font-bold"
                    >
                      Clear Cart
                    </Button>
                    <Button 
                      onClick={processPayment}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 font-bold"
                    >
                      <Receipt className="w-4 h-4 mr-2" />
                      Process Payment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
