
export interface Ingredient {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minimumStock: number;
  maximumStock: number;
  unit: string;
  costPerUnit: number;
  supplier: string;
  expiryDate: string;
  lastRestocked: string;
  isPerishable: boolean;
  storageLocation: string;
  dailyUsage: number;
  leadTime: number;
}

export const mockIngredients: Ingredient[] = [
  {
    id: "1",
    name: "Fresh Tomatoes",
    category: "Vegetables",
    currentStock: 3,
    minimumStock: 10,
    maximumStock: 50,
    unit: "kg",
    costPerUnit: 3.50,
    supplier: "Fresh Farm Co",
    expiryDate: "2024-06-18",
    lastRestocked: "2024-06-15",
    isPerishable: true,
    storageLocation: "Cold Storage A",
    dailyUsage: 2.5,
    leadTime: 2
  },
  {
    id: "2",
    name: "Mozzarella Cheese",
    category: "Dairy",
    currentStock: 2,
    minimumStock: 5,
    maximumStock: 20,
    unit: "kg",
    costPerUnit: 12.99,
    supplier: "Dairy Excellence Ltd",
    expiryDate: "2024-06-19",
    lastRestocked: "2024-06-10",
    isPerishable: true,
    storageLocation: "Refrigerator B",
    dailyUsage: 1.8,
    leadTime: 1
  },
  {
    id: "3",
    name: "Olive Oil",
    category: "Oils & Fats",
    currentStock: 5,
    minimumStock: 8,
    maximumStock: 25,
    unit: "liters",
    costPerUnit: 8.75,
    supplier: "Mediterranean Oils",
    expiryDate: "2025-03-15",
    lastRestocked: "2024-05-20",
    isPerishable: false,
    storageLocation: "Pantry Shelf 3",
    dailyUsage: 0.8,
    leadTime: 3
  },
  {
    id: "4",
    name: "Whole Wheat Flour",
    category: "Grains & Flour",
    currentStock: 12,
    minimumStock: 20,
    maximumStock: 100,
    unit: "kg",
    costPerUnit: 2.25,
    supplier: "Golden Grain Mills",
    expiryDate: "2024-12-31",
    lastRestocked: "2024-06-01",
    isPerishable: false,
    storageLocation: "Dry Storage A",
    dailyUsage: 3.2,
    leadTime: 5
  },
  {
    id: "5",
    name: "Chicken Breast",
    category: "Meat & Poultry",
    currentStock: 1,
    minimumStock: 10,
    maximumStock: 30,
    unit: "kg",
    costPerUnit: 8.99,
    supplier: "Premium Poultry",
    expiryDate: "2024-06-17",
    lastRestocked: "2024-06-16",
    isPerishable: true,
    storageLocation: "Freezer A",
    dailyUsage: 4.1,
    leadTime: 1
  }
];
