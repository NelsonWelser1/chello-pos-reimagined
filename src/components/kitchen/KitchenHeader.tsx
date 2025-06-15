
import { ChefHat, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface KitchenHeaderProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export default function KitchenHeader({ soundEnabled, onToggleSound }: KitchenHeaderProps) {
  return (
    <>
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b px-4 py-3 shadow-sm flex justify-between items-center">
        <SidebarTrigger className="hover:bg-orange-50 transition-colors" />
        
        {/* Sound Control Button */}
        <Button
          onClick={onToggleSound}
          variant={soundEnabled ? "default" : "outline"}
          className="flex items-center gap-2 font-bold"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          Kitchen Alerts {soundEnabled ? 'ON' : 'OFF'}
        </Button>
      </div>
      
      <div className="bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-5xl font-black bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent flex items-center justify-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-xl">
                <ChefHat className="w-10 h-10 text-white" />
              </div>
              Kitchen Management System
            </h1>
            <p className="text-xl text-slate-600 mt-4 font-medium">Real-time order preparation and workflow management</p>
          </div>
        </div>
      </div>
    </>
  );
}
