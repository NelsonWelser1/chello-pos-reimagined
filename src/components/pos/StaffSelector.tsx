
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStaff } from "@/hooks/useStaff";
import { useAuth } from "@/hooks/useAuth";
import { User } from "lucide-react";
import { useEffect } from "react";

interface StaffSelectorProps {
  selectedStaffId: string | null;
  onStaffSelect: (staffId: string | null) => void;
}

export default function StaffSelector({ selectedStaffId, onStaffSelect }: StaffSelectorProps) {
  const { staff } = useStaff();
  const { user } = useAuth();

  // Auto-assign logged-in user as staff member
  useEffect(() => {
    if (user && staff.length > 0) {
      const currentStaff = staff.find(s => s.email === user.email);
      if (currentStaff && (!selectedStaffId || selectedStaffId !== currentStaff.id)) {
        onStaffSelect(currentStaff.id);
      }
    }
  }, [user, staff, selectedStaffId, onStaffSelect]);

  const currentStaff = selectedStaffId ? staff.find(s => s.id === selectedStaffId) : null;

  return (
    <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-purple-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-bold">
          <User className="w-5 h-5 text-purple-600" />
          Staff Member
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full p-3 bg-gray-50 rounded-lg border">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-purple-600" />
            <span className="font-medium">
              {currentStaff ? `${currentStaff.name} (${currentStaff.role})` : 'Loading...'}
            </span>
          </div>
          {user && (
            <div className="mt-1 text-xs text-gray-500">
              Auto-assigned from logged-in account
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
