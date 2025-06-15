
import { ShoppingCart } from "lucide-react";

export default function POSHeader() {
  return (
    <div className="text-center mb-8">
      <h1 className="text-5xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center justify-center gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
          <ShoppingCart className="w-10 h-10 text-white" />
        </div>
        Point of Sale System
      </h1>
      <p className="text-xl text-slate-600 mt-4 font-medium">Fast and efficient order management</p>
    </div>
  );
}
