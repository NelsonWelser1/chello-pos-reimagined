
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStaff } from "@/hooks/useStaff";
import { User } from "lucide-react";

interface StaffSelectorProps {
  selectedStaffId: string | null;
  onStaffSelect: (staffId: string | null) => void;
}

export default function StaffSelector({ selectedStaffId, onStaffSelect }: StaffSelectorProps) {
  const { staff } = useStaff();

  const handleStaffSelect = (staffId: string) => {
    if (staffId === "none") {
      onStaffSelect(null);
    } else {
      onStaffSelect(staffId);
    }
  };

  const getDisplayValue = () => {
    if (!selectedStaffId) return "";
    
    const selectedStaff = staff.find(s => s.id === selectedStaffId);
    return selectedStaff ? `${selectedStaff.name} (${selectedStaff.role})` : "";
  };

  return (
    <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-purple-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-bold">
          <User className="w-5 h-5 text-purple-600" />
          Staff Member
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Select 
          value={selectedStaffId || "none"} 
          onValueChange={handleStaffSelect}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select staff member">
              {getDisplayValue() || "Select staff member"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                No Staff Selected
              </div>
            </SelectItem>
            {staff
              .filter(member => member && member.id && member.name && member.is_active) // Filter out invalid staff
              .map((member) => (
                <SelectItem key={member.id} value={member.id}>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{member.name} ({member.role})</span>
                  </div>
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        
        {selectedStaffId && (
          <div className="mt-3 p-2 bg-purple-50 rounded-lg">
            <div className="text-sm text-purple-800">
              {(() => {
                const member = staff.find(s => s.id === selectedStaffId);
                return member ? `Selected: ${member.name} (${member.role})` : 'Staff member selected';
              })()}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
