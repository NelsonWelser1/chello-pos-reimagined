
import { Receipt } from "lucide-react";

export function OrdersHeader() {
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center justify-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
          <Receipt className="w-7 h-7 text-white" />
        </div>
        Order History
      </h1>
      <p className="text-xl text-slate-600 mt-4 font-medium">View all previous orders and transactions</p>
    </div>
  );
}
