
import { ChefHat } from "lucide-react";

export function SidebarHeader() {
  return (
    <div className="p-6 border-b border-white/20 bg-black/20 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
          <ChefHat className="w-7 h-7 text-white" />
        </div>
        <div>
          <h2 className="font-bold text-xl bg-gradient-to-r from-orange-300 to-yellow-300 bg-clip-text text-[#951400]">
            CHELLO
          </h2>
          <p className="text-sm font-medium text-slate-950">RESTAURANT POS</p>
        </div>
      </div>
    </div>
  );
}
