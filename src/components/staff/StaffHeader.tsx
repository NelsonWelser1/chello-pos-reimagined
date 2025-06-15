
import { Button } from "@/components/ui/button";
import { PlusCircle, Users } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface StaffHeaderProps {
  onAdd: () => void;
}

export default function StaffHeader({ onAdd }: StaffHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Users className="w-8 h-8" />
          Staff Management
        </h1>
      </div>
      <Button onClick={onAdd} className="flex items-center gap-2">
        <PlusCircle className="w-5 h-5" />
        Add Staff
      </Button>
    </div>
  );
}
