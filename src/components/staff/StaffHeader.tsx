
import { Button } from "@/components/ui/button";
import { PlusCircle, Users, Sparkles } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface StaffHeaderProps {
  onAdd: () => void;
}

export default function StaffHeader({ onAdd }: StaffHeaderProps) {
  return (
    <div className="relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10 rounded-2xl blur-xl" />
      
      <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <SidebarTrigger className="hover:bg-blue-100/80 transition-colors" />
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Staff Management
                </h1>
                <p className="text-slate-600 mt-1 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Manage your team with real-time updates
                </p>
              </div>
            </div>
          </div>
          <Button 
            onClick={onAdd} 
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
            size="lg"
          >
            <PlusCircle className="w-5 h-5" />
            Add Staff Member
          </Button>
        </div>
      </div>
    </div>
  );
}
