
import { Package } from "lucide-react";

export default function ItemsHeader() {
  return (
    <div className="text-center mb-8">
      <h1 className="text-5xl font-black bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent flex items-center justify-center gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-xl">
          <Package className="w-10 h-10 text-white" />
        </div>
        Metric Cafe Menu Management
      </h1>
      <p className="text-xl text-slate-600 mt-4 font-medium">Manage your authentic Metric Cafe menu items</p>
    </div>
  );
}
