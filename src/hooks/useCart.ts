
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { type MenuItem } from "@/hooks/useMenuItems";

interface CartItem {
  id: string;
  name: string;
  price: number;
  category: string;
  quantity: number;
  image?: string;
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { toast } = useToast();

  const addToCart = (item: MenuItem) => {
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

  const handleItemIncrease = (id: string, menuItems: MenuItem[]) => {
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

  return {
    cart,
    addToCart,
    handleItemIncrease,
    handleItemDecrease,
    clearCart,
    getTotalAmount,
    getTotalItems,
    setCart
  };
}

export type { CartItem };
