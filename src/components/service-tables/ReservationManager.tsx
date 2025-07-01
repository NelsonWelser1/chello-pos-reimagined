
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useReservations, Reservation } from "@/hooks/useReservations";
import { ReservationForm } from "./ReservationForm";
import { EditReservationForm } from "./EditReservationForm";
import { TodaysReservations } from "./TodaysReservations";
import { AllReservationsTable } from "./AllReservationsTable";

export function ReservationManager() {
  const { reservations, loading: reservationsLoading, createReservation, updateReservation, deleteReservation } = useReservations();
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isAddingReservation, setIsAddingReservation] = useState(false);
  const [isEditingReservation, setIsEditingReservation] = useState(false);

  const handleAddReservation = async (reservationData: any) => {
    await createReservation(reservationData);
  };

  const handleEditReservation = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsEditingReservation(true);
  };

  const handleUpdateReservation = async (reservationId: string, updates: Partial<Reservation>) => {
    await updateReservation(reservationId, updates);
    setIsEditingReservation(false);
    setSelectedReservation(null);
  };

  const updateReservationStatus = async (reservationId: string, newStatus: string) => {
    await updateReservation(reservationId, { status: newStatus as any });
  };

  const handleDeleteReservation = async (reservationId: string) => {
    await deleteReservation(reservationId);
  };

  if (reservationsLoading) {
    return (
      <div className="text-center py-12">
        <div className="text-xl text-slate-600">Loading reservations...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Reservation Manager</h2>
        <Dialog open={isAddingReservation} onOpenChange={setIsAddingReservation}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Reservation
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TodaysReservations
          reservations={reservations}
          onEdit={handleEditReservation}
          onUpdateStatus={updateReservationStatus}
        />

        <AllReservationsTable
          reservations={reservations}
          onEdit={handleEditReservation}
          onDelete={handleDeleteReservation}
        />
      </div>

      <ReservationForm
        isOpen={isAddingReservation}
        onClose={() => setIsAddingReservation(false)}
        onSubmit={handleAddReservation}
      />

      <EditReservationForm
        isOpen={isEditingReservation}
        onClose={() => {
          setIsEditingReservation(false);
          setSelectedReservation(null);
        }}
        onSubmit={handleUpdateReservation}
        reservation={selectedReservation}
      />
    </div>
  );
}
