import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, Clock, Phone, Users, Plus, Edit, Trash2, CheckCircle } from "lucide-react";
import { useReservations } from "@/hooks/useReservations";
import { useTables } from "@/hooks/useTables";

interface Reservation {
  id: string;
  customer_name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  party_size: number;
  table?: { number: number };
  status: "confirmed" | "pending" | "seated" | "cancelled" | "completed";
  special_requests: string;
  duration_minutes: number;
}

export function ReservationManager() {
  const { reservations, loading: reservationsLoading, createReservation, updateReservation, deleteReservation } = useReservations();
  const { tables } = useTables();
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const [isAddingReservation, setIsAddingReservation] = useState(false);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-blue-500";
      case "pending": return "bg-yellow-500";
      case "seated": return "bg-green-500";
      case "cancelled": return "bg-red-500";
      case "completed": return "bg-gray-500";
      default: return "bg-gray-400";
    }
  };

  const handleAddReservation = async () => {
    if (!newReservation.customer_name || !newReservation.phone || !newReservation.date || !newReservation.time || !newReservation.party_size) {
      return;
    }

    await createReservation({
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
    setIsAddingReservation(false);
  };

  const updateReservationStatus = async (reservationId: string, newStatus: string) => {
    await updateReservation(reservationId, { status: newStatus as any });
  };

  const handleDeleteReservation = async (reservationId: string) => {
    await deleteReservation(reservationId);
  };

  const todaysReservations = reservations.filter(r => r.date === new Date().toISOString().split('T')[0]);

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
                <Button variant="outline" onClick={() => setIsAddingReservation(false)} className="flex-1">Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Today's Reservations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todaysReservations.map((reservation) => (
                <div key={reservation.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{reservation.customer_name}</span>
                    <Badge className={getStatusColor(reservation.status)}>
                      {reservation.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {reservation.time}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {reservation.party_size} guests
                    </div>
                    {reservation.table && (
                      <div>Table #{reservation.table.number}</div>
                    )}
                  </div>
                  <div className="flex gap-1 mt-2">
                    <Button size="sm" variant="outline" onClick={() => setSelectedReservation(reservation)}>
                      <Edit className="w-3 h-3" />
                    </Button>
                    {reservation.status === "confirmed" && (
                      <Button size="sm" onClick={() => updateReservationStatus(reservation.id, "seated")}>
                        <CheckCircle className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>All Reservations</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Party</TableHead>
                  <TableHead>Table</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservations.map((reservation) => (
                  <TableRow key={reservation.id}>
                    <TableCell className="font-medium">{reservation.customer_name}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {reservation.phone}
                        </div>
                        {reservation.email && <div>{reservation.email}</div>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{reservation.date}</div>
                        <div className="text-gray-500">{reservation.time}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{reservation.party_size} guests</Badge>
                    </TableCell>
                    <TableCell>
                      {reservation.table ? `#${reservation.table.number}` : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(reservation.status)}>
                        {reservation.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" onClick={() => setSelectedReservation(reservation)}>
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteReservation(reservation.id)}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
