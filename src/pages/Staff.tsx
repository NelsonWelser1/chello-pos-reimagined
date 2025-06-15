import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import StaffHeader from "@/components/staff/StaffHeader";
import StaffStats from "@/components/staff/StaffStats";
import StaffTable from "@/components/staff/StaffTable";
import StaffForm from "@/components/staff/StaffForm";
import { useGetStaff, useAddStaff, useUpdateStaff, useDeleteStaff, type Staff, type NewStaff, type UpdateStaff } from "@/hooks/useStaff";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function Staff() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
    const [highlightedId, setHighlightedId] = useState<string | null>(null);

    const queryClient = useQueryClient();

    const { data: staff = [], isLoading } = useGetStaff();
    const addStaffMutation = useAddStaff();
    const updateStaffMutation = useUpdateStaff();
    const deleteStaffMutation = useDeleteStaff();

    useEffect(() => {
        const handleDbChange = (payload: any) => {
            queryClient.invalidateQueries({ queryKey: ['staff'] });

            if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
                const newRecord = payload.new as Staff;
                if (newRecord.id) {
                    setHighlightedId(newRecord.id);
                    setTimeout(() => setHighlightedId(null), 2000);
                }
            }
        };

        const channel = supabase
            .channel('db-staff-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'staff' }, handleDbChange)
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [queryClient]);

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
        <SidebarProvider>
            <div className="min-h-screen flex w-full bg-gray-50">
                <AppSidebar />
                <main className="flex-1 p-6">
                    <div className="max-w-7xl mx-auto space-y-6">
                        <StaffHeader onAdd={handleAdd} />

                        {isLoading ? (
                            <div className="space-y-6">
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                    <Skeleton className="h-24 rounded-lg" />
                                    <Skeleton className="h-24 rounded-lg" />
                                    <Skeleton className="h-24 rounded-lg" />
                                    <Skeleton className="h-24 rounded-lg" />
                                </div>
                                <Skeleton className="h-96 rounded-lg" />
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <StaffStats staff={staff} />
                                <div className="bg-white rounded-lg shadow-sm border">
                                    <StaffTable staff={staff} onEdit={handleEdit} onDelete={handleDelete} highlightedId={highlightedId} />
                                </div>
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
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
}
