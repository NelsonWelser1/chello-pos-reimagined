
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMenuItems } from "@/hooks/useMenuItems";
import { useCategories } from "@/hooks/useCategories";
import { useOrders } from "@/hooks/useOrders";
import POSHeader from "@/components/pos/POSHeader";
import CategoryFilter from "@/components/pos/CategoryFilter";
import MenuGrid from "@/components/pos/MenuGrid";
import CartSummary from "@/components/pos/CartSummary";
import PaymentSection from "@/components/pos/PaymentSection";

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
  const { createOrder, createOrderItems } = useOrders();
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

  const handleItemIncrease = (id: string) => {
    const menuItem = menuItems.find(item => item.id === id);
    if (menuItem) {
      addToCart(menuItem);
    }
  };

  const handleItemDecrease = (id: string) => {
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
      const totalAmount = getTotalAmount();
      const orderData = {
        total_amount: totalAmount * 1.085,
        subtotal: totalAmount,
        tax_amount: totalAmount * 0.085,
        payment_method: paymentMethod,
        status: 'completed'
      };

      const order = await createOrder(orderData);

      if (!order) {
        toast({
          title: "Order Failed",
          description: "Failed to create order. Please try again.",
          variant: "destructive"
        });
        return;
      }

      const orderItems = cart.map(item => ({
        order_id: order.id,
        menu_item_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity
      }));

      const itemsSuccess = await createOrderItems(orderItems);

      if (!itemsSuccess) {
        toast({
          title: "Order Items Failed",
          description: "Failed to save order items.",
          variant: "destructive"
        });
        return;
      }

      // Update stock counts
      for (const cartItem of cart) {
        const menuItem = menuItems.find(item => item.id === cartItem.id);
        if (menuItem) {
          const newStockCount = menuItem.stock_count - cartItem.quantity;
          await supabase
            .from('menu_items' as any)
            .update({ stock_count: newStockCount })
            .eq('id', cartItem.id);
        }
      }

      toast({
        title: "Payment Processed",
        description: `Order #${order.id.slice(-8)} processed successfully via ${paymentMethod}`,
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
        <POSHeader />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu Section */}
          <div className="lg:col-span-2 space-y-6">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
            />
            <MenuGrid
              items={filteredItems}
              onAddToCart={addToCart}
            />
          </div>

          {/* Cart Section */}
          <div className="space-y-6">
            <CartSummary
              cart={cart}
              totalItems={getTotalItems()}
              onItemIncrease={handleItemIncrease}
              onItemDecrease={handleItemDecrease}
            />

            {/* Payment Section */}
            {cart.length > 0 && (
              <PaymentSection
                totalAmount={getTotalAmount()}
                paymentMethod={paymentMethod}
                onPaymentMethodChange={setPaymentMethod}
                onClearCart={clearCart}
                onProcessPayment={processPayment}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
