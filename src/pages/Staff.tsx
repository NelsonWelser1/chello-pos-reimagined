
import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import StaffHeader from "@/components/staff/StaffHeader";
import StaffStats from "@/components/staff/StaffStats";
import StaffTable from "@/components/staff/StaffTable";
import StaffForm from "@/components/staff/StaffForm";
import { useGetStaff, useAddStaff, useUpdateStaff, useDeleteStaff, type Staff, type NewStaff, type UpdateStaff } from "@/hooks/useStaff";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function Staff() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

    const { data: staff = [], isLoading } = useGetStaff();
    const addStaffMutation = useAddStaff();
    const updateStaffMutation = useUpdateStaff();
    const deleteStaffMutation = useDeleteStaff();

    const handleAdd = () => {
        setSelectedStaff(null);
        setIsFormOpen(true);
    };

    const handleEdit = (staffMember: Staff) => {
        setSelectedStaff(staffMember);
        setIsFormOpen(true);
    };

    const handleDelete = (id: string) => {
        deleteStaffMutation.mutate(id, {
            onSuccess: () => toast.success("Staff member deleted successfully."),
            onError: (error) => toast.error(error.message),
        });
    };

    const handleFormSubmit = (data: NewStaff | UpdateStaff) => {
        if (selectedStaff) {
            updateStaffMutation.mutate({ ...data, id: selectedStaff.id }, {
                onSuccess: () => {
                    toast.success("Staff member updated successfully.");
                    setIsFormOpen(false);
                    setSelectedStaff(null);
                },
                onError: (error) => toast.error(error.message),
            });
        } else {
            addStaffMutation.mutate(data as NewStaff, {
                onSuccess: () => {
                    toast.success("Staff member added successfully.");
                    setIsFormOpen(false);
                },
                onError: (error) => toast.error(error.message),
            });
        }
    };
    
    return (
        <div className="flex min-h-screen bg-gray-50/50">
            <AppSidebar />
            <main className="flex-1 p-6 md:p-8">
                <StaffHeader onAdd={handleAdd} />

                {isLoading ? (
                    <div className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Skeleton className="h-28 rounded-lg" />
                            <Skeleton className="h-28 rounded-lg" />
                            <Skeleton className="h-28 rounded-lg" />
                            <Skeleton className="h-28 rounded-lg" />
                        </div>
                        <Skeleton className="h-96 rounded-lg" />
                    </div>
                ) : (
                    <div className="space-y-6">
                        <StaffStats staff={staff} />
                        <StaffTable staff={staff} onEdit={handleEdit} onDelete={handleDelete} />
                    </div>
                )}
                
                {isFormOpen && (
                    <StaffForm 
                        staffMember={selectedStaff}
                        onSubmit={handleFormSubmit}
                        onCancel={() => {
                            setIsFormOpen(false);
                            setSelectedStaff(null);
                        }}
                    />
                )}
            </main>
        </div>
    );
}

