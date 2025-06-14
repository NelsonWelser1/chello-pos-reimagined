
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
import { toast } from "sonner";

interface Reservation {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  partySize: number;
  tableNumber?: number;
  status: "confirmed" | "pending" | "seated" | "cancelled" | "completed";
  specialRequests: string;
  duration: number;
}

export function ReservationManager() {
  const [reservations, setReservations] = useState<Reservation[]>([
    {
      id: "1",
      customerName: "John Smith",
      phone: "+1-555-0123",
      email: "john@email.com",
      date: "2024-01-15",
      time: "19:00",
      partySize: 4,
      tableNumber: 3,
      status: "confirmed",
      specialRequests: "Window seat preferred",
      duration: 120
    },
    {
      id: "2",
      customerName: "Sarah Johnson",
      phone: "+1-555-0456",
      email: "sarah@email.com",
      date: "2024-01-15",
      time: "20:30",
      partySize: 2,
      status: "pending",
      specialRequests: "Anniversary dinner",
      duration: 90
    },
    {
      id: "3",
      customerName: "Mike Wilson",
      phone: "+1-555-0789",
      email: "mike@email.com",
      date: "2024-01-16",
      time: "18:00",
      partySize: 6,
      tableNumber: 5,
      status: "seated",
      specialRequests: "Business dinner",
      duration: 150
    }
  ]);

  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isAddingReservation, setIsAddingReservation] = useState(false);
  const [newReservation, setNewReservation] = useState({
    customerName: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    partySize: "",
    specialRequests: "",
    duration: "120"
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

  const handleAddReservation = () => {
    if (!newReservation.customerName || !newReservation.phone || !newReservation.date || !newReservation.time || !newReservation.partySize) {
      toast.error("Please fill in all required fields");
      return;
    }

    const reservation: Reservation = {
      id: Date.now().toString(),
      customerName: newReservation.customerName,
      phone: newReservation.phone,
      email: newReservation.email,
      date: newReservation.date,
      time: newReservation.time,
      partySize: parseInt(newReservation.partySize),
      status: "pending",
      specialRequests: newReservation.specialRequests,
      duration: parseInt(newReservation.duration)
    };

    setReservations(prev => [...prev, reservation]);
    setNewReservation({
      customerName: "",
      phone: "",
      email: "",
      date: "",
      time: "",
      partySize: "",
      specialRequests: "",
      duration: "120"
    });
    setIsAddingReservation(false);
    toast.success("Reservation added successfully");
  };

  const updateReservationStatus = (reservationId: string, newStatus: string) => {
    setReservations(prev => prev.map(reservation => 
      reservation.id === reservationId ? { ...reservation, status: newStatus as any } : reservation
    ));
    toast.success("Reservation status updated");
  };

  const deleteReservation = (reservationId: string) => {
    const reservation = reservations.find(r => r.id === reservationId);
    setReservations(prev => prev.filter(r => r.id !== reservationId));
    toast.success(`Reservation for ${reservation?.customerName} deleted`);
  };

  const todaysReservations = reservations.filter(r => r.date === "2024-01-15");
  const upcomingReservations = reservations.filter(r => r.date > "2024-01-15");

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
                  value={newReservation.customerName}
                  onChange={(e) => setNewReservation(prev => ({ ...prev, customerName: e.target.value }))}
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
                    value={newReservation.partySize}
                    onChange={(e) => setNewReservation(prev => ({ ...prev, partySize: e.target.value }))}
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
                <Select value={newReservation.duration} onValueChange={(value) => setNewReservation(prev => ({ ...prev, duration: value }))}>
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
                  value={newReservation.specialRequests}
                  onChange={(e) => setNewReservation(prev => ({ ...prev, specialRequests: e.target.value }))}
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
                    <span className="font-semibold">{reservation.customerName}</span>
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
                      {reservation.partySize} guests
                    </div>
                    {reservation.tableNumber && (
                      <div>Table #{reservation.tableNumber}</div>
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
                    <TableCell className="font-medium">{reservation.customerName}</TableCell>
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
                      <Badge variant="outline">{reservation.partySize} guests</Badge>
                    </TableCell>
                    <TableCell>
                      {reservation.tableNumber ? `#${reservation.tableNumber}` : "-"}
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
                        <Button size="sm" variant="destructive" onClick={() => deleteReservation(reservation.id)}>
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
