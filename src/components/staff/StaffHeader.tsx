
import { Button } from "@/components/ui/button";
import { PlusCircle, Users } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface StaffHeaderProps {
  onAdd: () => void;
}

export default function StaffHeader({ onAdd }: StaffHeaderProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="hover:bg-gray-100" />
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
              <p className="text-gray-600">Manage your team members</p>
            </div>
          </div>
        </div>
        <Button 
          onClick={onAdd} 
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <PlusCircle className="w-4 h-4" />
          Add Staff Member
        </Button>
      </div>
    </div>
  );
}
