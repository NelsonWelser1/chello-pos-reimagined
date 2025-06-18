
import { useState } from "react";
import { useMenuItems } from "@/hooks/useMenuItems";
import { useCategories } from "@/hooks/useCategories";
import { useCart } from "@/hooks/useCart";
import CategoryFilter from "./CategoryFilter";
import MenuGrid from "./MenuGrid";
import CartSummary from "./CartSummary";
import StaffSelector from "./StaffSelector";
import TableSelector from "./TableSelector";
import POSPaymentHandler from "./POSPaymentHandler";

export default function POSContainer() {
  const { items: menuItems, loading: menuLoading } = useMenuItems();
  const { categories: categoryObjects, loading: categoriesLoading } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('card');
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [selectedTableSession, setSelectedTableSession] = useState<string | null>(null);
  
  const {
    cart,
    addToCart,
    handleItemIncrease,
    handleItemDecrease,
    clearCart,
    getTotalAmount,
    getTotalItems,
    setCart
  } = useCart();

  // Get available menu items only
  const availableItems = menuItems.filter(item => item.is_available && item.stock_count > 0);

  // Create categories list from database + All option
  const categories = ['All', ...categoryObjects.map(cat => cat.name).sort()];

  const filteredItems = selectedCategory === 'All' 
    ? availableItems 
    : availableItems.filter(item => item.category === selectedCategory);

  if (menuLoading || categoriesLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-12">
          <div className="text-xl text-slate-600">Loading menu items...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
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
          <StaffSelector
            selectedStaffId={selectedStaffId}
            onStaffSelect={setSelectedStaffId}
          />
          
          <TableSelector
            selectedTableSession={selectedTableSession}
            onTableSessionSelect={setSelectedTableSession}
          />
          
          <CartSummary
            cart={cart}
            totalItems={getTotalItems()}
            onItemIncrease={(id) => handleItemIncrease(id, menuItems)}
            onItemDecrease={handleItemDecrease}
          />

          {/* Payment Section */}
          {cart.length > 0 && (
            <POSPaymentHandler
              cart={cart}
              menuItems={menuItems}
              totalAmount={getTotalAmount()}
              paymentMethod={paymentMethod}
              selectedStaffId={selectedStaffId}
              selectedTableSession={selectedTableSession}
              onPaymentMethodChange={setPaymentMethod}
              onClearCart={clearCart}
              onCartClear={() => setCart([])}
            />
          )}
        </div>
      </div>
    </div>
  );
}
