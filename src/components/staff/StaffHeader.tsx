
import { Button } from "@/components/ui/button";
import { Plus, Users, TrendingUp } from "lucide-react";

interface StaffHeaderProps {
  onAddStaff: () => void;
}

export function StaffHeader({ onAddStaff }: StaffHeaderProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-black tracking-tight">Staff Management</h1>
                <p className="text-blue-100 text-lg font-medium mt-2">
                  Manage your team with precision and care
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-blue-100">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                <span className="font-medium">Team Performance</span>
              </div>
              <div className="w-px h-4 bg-blue-300"></div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span className="font-medium">Active Members</span>
              </div>
            </div>
          </div>
          
          <Button
            onClick={onAddStaff}
            size="lg"
            className="bg-white text-blue-600 hover:bg-blue-50 font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Staff
          </Button>
        </div>
      </div>
    </div>
  );
}
