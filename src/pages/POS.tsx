
import { useState, useEffect } from "react";
import { ShoppingCart, Plus, Minus, CreditCard, DollarSign, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMenuItems } from "@/hooks/useMenuItems";
import { useCategories } from "@/hooks/useCategories";

interface CartItem {
  id: string;
  name: string;
  price: number;
  category: string;
  quantity: number;
  image?: string;
}

export default function POS() {
  const { items: menuItems, loading: menuLoading } = useMenuItems();
  const { categories: categoryObjects, loading: categoriesLoading } = useCategories();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('card');
  const { toast } = useToast();

  // Get available menu items only
  const availableItems = menuItems.filter(item => item.is_available && item.stock_count > 0);

  // Create categories list from database + All option
  const categories = ['All', ...categoryObjects.map(cat => cat.name).sort()];

  const filteredItems = selectedCategory === 'All' 
    ? availableItems 
    : availableItems.filter(item => item.category === selectedCategory);

  const addToCart = (item: typeof menuItems[0]) => {
    // Check if item is still in stock
    if (item.stock_count <= 0) {
      toast({
        title: "Out of Stock",
        description: `${item.name} is currently out of stock.`,
        variant: "destructive"
      });
      return;
    }

    setCart(prev => {
      const existing = prev.find(cartItem => cartItem.id === item.id);
      if (existing) {
        // Check if adding one more would exceed stock
        if (existing.quantity >= item.stock_count) {
          toast({
            title: "Stock Limit Reached",
            description: `Only ${item.stock_count} ${item.name}(s) available.`,
            variant: "destructive"
          });
          return prev;
        }
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { 
        id: item.id,
        name: item.name,
        price: item.price,
        category: item.category,
        quantity: 1,
        image: item.image
      }];
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

  const processPayment = async () => {
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to cart before processing payment.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Create order in database using any type to bypass TypeScript errors
      const orderData = {
        total_amount: getTotalAmount() * 1.085, // Including tax
        subtotal: getTotalAmount(),
        tax_amount: getTotalAmount() * 0.085,
        payment_method: paymentMethod,
        status: 'completed'
      };

      // Insert order
      const { data: order, error: orderError } = await (supabase as any)
        .from('orders')
        .insert([orderData])
        .select()
        .single();

      if (orderError) {
        console.error('Order creation error:', orderError);
        toast({
          title: "Order Failed",
          description: "Failed to create order. Please try again.",
          variant: "destructive"
        });
        return;
      }

      // Insert order items
      if (order) {
        const orderItems = cart.map(item => ({
          order_id: order.id,
          menu_item_id: item.id,
          quantity: item.quantity,
          unit_price: item.price,
          total_price: item.price * item.quantity
        }));

        const { error: itemsError } = await (supabase as any)
          .from('order_items')
          .insert(orderItems);

        if (itemsError) {
          console.error('Order items creation error:', itemsError);
          toast({
            title: "Order Items Failed",
            description: "Failed to save order items.",
            variant: "destructive"
          });
          return;
        }
      }

      // Update stock counts for purchased items
      for (const cartItem of cart) {
        const menuItem = menuItems.find(item => item.id === cartItem.id);
        if (menuItem) {
          const newStockCount = menuItem.stock_count - cartItem.quantity;
          await supabase
            .from('menu_items')
            .update({ stock_count: newStockCount })
            .eq('id', cartItem.id);
        }
      }

      toast({
        title: "Payment Processed",
        description: `Order #${order?.id?.slice(-8)} processed successfully via ${paymentMethod}`,
      });
      
      setCart([]);
    } catch (error) {
      console.error('Payment processing error:', error);
      toast({
        title: "Payment Failed",
        description: "An error occurred while processing payment.",
        variant: "destructive"
      });
    }
  };

  if (menuLoading || categoriesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="text-xl text-slate-600">Loading menu items...</div>
          </div>
        </div>
      </div>
    );
  }

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
                          {item.image && (
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                          )}
                          <div className="flex justify-between items-start">
                            <h3 className="font-bold text-lg text-slate-800">{item.name}</h3>
                            <Badge variant="secondary" className="bg-green-100 text-green-800 font-bold">
                              ${item.price.toFixed(2)}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600">{item.description}</p>
                          <div className="flex justify-between items-center text-xs text-slate-500">
                            <span>Stock: {item.stock_count}</span>
                            <span>{item.preparation_time}min</span>
                          </div>
                          <Button 
                            onClick={() => addToCart(item)}
                            disabled={item.stock_count <= 0}
                            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 font-bold disabled:opacity-50"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            {item.stock_count <= 0 ? 'Out of Stock' : 'Add to Cart'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredItems.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-slate-500 font-medium">No items available in this category</p>
                  </div>
                )}
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
                            onClick={() => {
                              const menuItem = menuItems.find(mi => mi.id === item.id);
                              if (menuItem) addToCart(menuItem);
                            }}
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
