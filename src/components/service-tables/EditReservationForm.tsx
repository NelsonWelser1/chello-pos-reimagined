
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Reservation } from "@/hooks/useReservations";

interface EditReservationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reservationId: string, updates: Partial<Reservation>) => Promise<void>;
  reservation: Reservation | null;
}

export function EditReservationForm({ isOpen, onClose, onSubmit, reservation }: EditReservationFormProps) {
  const [editData, setEditData] = useState({
    customer_name: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    party_size: "",
    status: "pending",
    special_requests: "",
    duration_minutes: "120"
  });

  useEffect(() => {
    if (reservation) {
      setEditData({
        customer_name: reservation.customer_name || "",
        phone: reservation.phone || "",
        email: reservation.email || "",
        date: reservation.date || "",
        time: reservation.time || "",
        party_size: reservation.party_size?.toString() || "",
        status: reservation.status || "pending",
        special_requests: reservation.special_requests || "",
        duration_minutes: reservation.duration_minutes?.toString() || "120"
      });
    }
  }, [reservation]);

  const handleUpdateReservation = async () => {
    if (!reservation || !editData.customer_name || !editData.phone || !editData.date || !editData.time || !editData.party_size) {
      return;
    }

    await onSubmit(reservation.id, {
      customer_name: editData.customer_name,
      phone: editData.phone,
      email: editData.email || undefined,
      date: editData.date,
      time: editData.time,
      party_size: parseInt(editData.party_size),
      status: editData.status as any,
      special_requests: editData.special_requests || undefined,
      duration_minutes: parseInt(editData.duration_minutes)
    });

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Reservation</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Customer Name *</Label>
            <Input
              placeholder="Enter customer name"
              value={editData.customer_name}
              onChange={(e) => setEditData(prev => ({ ...prev, customer_name: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Phone *</Label>
              <Input
                placeholder="+1-555-0123"
                value={editData.phone}
                onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            <div>
              <Label>Party Size *</Label>
              <Input
                type="number"
                placeholder="4"
                value={editData.party_size}
                onChange={(e) => setEditData(prev => ({ ...prev, party_size: e.target.value }))}
              />
            </div>
          </div>
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="customer@email.com"
              value={editData.email}
              onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Date *</Label>
              <Input
                type="date"
                value={editData.date}
                onChange={(e) => setEditData(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
            <div>
              <Label>Time *</Label>
              <Input
                type="time"
                value={editData.time}
                onChange={(e) => setEditData(prev => ({ ...prev, time: e.target.value }))}
              />
            </div>
          </div>
          <div>
            <Label>Status</Label>
            <Select value={editData.status} onValueChange={(value) => setEditData(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="seated">Seated</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Duration (minutes)</Label>
            <Select value={editData.duration_minutes} onValueChange={(value) => setEditData(prev => ({ ...prev, duration_minutes: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="90">1.5 hours</SelectItem>
                <SelectItem value="120">2 hours</SelectItem>
                <SelectItem value="150">2.5 hours</SelectItem>
                <SelectItem value="180">3 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Special Requests</Label>
            <Input
              placeholder="Any special requirements..."
              value={editData.special_requests}
              onChange={(e) => setEditData(prev => ({ ...prev, special_requests: e.target.value }))}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleUpdateReservation} className="flex-1">Update Reservation</Button>
            <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
