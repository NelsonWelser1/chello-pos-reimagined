
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ReservationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reservationData: any) => Promise<void>;
}

export function ReservationForm({ isOpen, onClose, onSubmit }: ReservationFormProps) {
  const [newReservation, setNewReservation] = useState({
    customer_name: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    party_size: "",
    special_requests: "",
    duration_minutes: "120"
  });

  const handleAddReservation = async () => {
    if (!newReservation.customer_name || !newReservation.phone || !newReservation.date || !newReservation.time || !newReservation.party_size) {
      return;
    }

    await onSubmit({
      customer_name: newReservation.customer_name,
      phone: newReservation.phone,
      email: newReservation.email || undefined,
      date: newReservation.date,
      time: newReservation.time,
      party_size: parseInt(newReservation.party_size),
      status: 'pending',
      special_requests: newReservation.special_requests || undefined,
      duration_minutes: parseInt(newReservation.duration_minutes)
    });

    setNewReservation({
      customer_name: "",
      phone: "",
      email: "",
      date: "",
      time: "",
      party_size: "",
      special_requests: "",
      duration_minutes: "120"
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Reservation</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Customer Name *</Label>
            <Input
              placeholder="Enter customer name"
              value={newReservation.customer_name}
              onChange={(e) => setNewReservation(prev => ({ ...prev, customer_name: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Phone *</Label>
              <Input
                placeholder="+1-555-0123"
                value={newReservation.phone}
                onChange={(e) => setNewReservation(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            <div>
              <Label>Party Size *</Label>
              <Input
                type="number"
                placeholder="4"
                value={newReservation.party_size}
                onChange={(e) => setNewReservation(prev => ({ ...prev, party_size: e.target.value }))}
              />
            </div>
          </div>
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="customer@email.com"
              value={newReservation.email}
              onChange={(e) => setNewReservation(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Date *</Label>
              <Input
                type="date"
                value={newReservation.date}
                onChange={(e) => setNewReservation(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
            <div>
              <Label>Time *</Label>
              <Input
                type="time"
                value={newReservation.time}
                onChange={(e) => setNewReservation(prev => ({ ...prev, time: e.target.value }))}
              />
            </div>
          </div>
          <div>
            <Label>Duration (minutes)</Label>
            <Select value={newReservation.duration_minutes} onValueChange={(value) => setNewReservation(prev => ({ ...prev, duration_minutes: value }))}>
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
              value={newReservation.special_requests}
              onChange={(e) => setNewReservation(prev => ({ ...prev, special_requests: e.target.value }))}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleAddReservation} className="flex-1">Add Reservation</Button>
            <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
