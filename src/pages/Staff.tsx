
import { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { StaffHeader } from "@/components/staff/StaffHeader";
import { StaffStats } from "@/components/staff/StaffStats";
import { StaffTable } from "@/components/staff/StaffTable";
import { StaffForm } from "@/components/staff/StaffForm";
import { useStaff } from "@/hooks/useStaff";

export default function Staff() {
  const [showForm, setShowForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const { staff, isLoading, refetch } = useStaff();

  const handleAddStaff = () => {
    setEditingStaff(null);
    setShowForm(true);
  };

  const handleEditStaff = (staffMember) => {
    setEditingStaff(staffMember);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingStaff(null);
    refetch();
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1 ml-80 bg-white">
          <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-6 py-4 shadow-sm">
            <SidebarTrigger className="hover:bg-blue-50 transition-colors rounded-md p-2" />
          </div>
          
          <div className="container mx-auto px-6 py-8 space-y-8">
            <StaffHeader onAddStaff={handleAddStaff} />
            
            <StaffStats staff={staff} isLoading={isLoading} />
            
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm">👥</span>
                  </div>
                  Staff Directory
                </h2>
                <p className="text-slate-600 mt-2">Manage your team members and their roles</p>
              </div>
              
              <StaffTable 
                staff={staff} 
                isLoading={isLoading} 
                onEdit={handleEditStaff}
                onRefresh={refetch}
              />
            </div>
          </div>

          {showForm && (
            <StaffForm
              staff={editingStaff}
              onClose={handleCloseForm}
            />
          )}
        </main>
      </div>
    </SidebarProvider>
  );
}
