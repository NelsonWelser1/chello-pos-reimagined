
import { useState } from "react";
import { useStaff } from "@/hooks/useStaff";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User } from "lucide-react";

interface StaffSelectorProps {
  selectedStaffId: string | null;
  onStaffSelect: (staffId: string | null) => void;
}

export default function StaffSelector({ selectedStaffId, onStaffSelect }: StaffSelectorProps) {
  const { staff, isLoading } = useStaff();
  const activeStaff = staff.filter(member => member.is_active);

  if (isLoading) {
    return (
      <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="text-sm text-slate-500">Loading staff...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <User className="w-5 h-5 text-blue-500" />
          Staff Member
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <Select value={selectedStaffId || ""} onValueChange={(value) => onStaffSelect(value || null)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select staff member" />
          </SelectTrigger>
          <SelectContent className="bg-white border shadow-lg z-50">
            <SelectItem value="">No staff selected</SelectItem>
            {activeStaff.map((member) => (
              <SelectItem key={member.id} value={member.id}>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{member.name}</span>
                  <span className="text-sm text-slate-500">({member.role})</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}
