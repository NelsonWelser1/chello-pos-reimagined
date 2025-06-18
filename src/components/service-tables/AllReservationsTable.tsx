
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Phone, Edit, Trash2 } from "lucide-react";
import { Reservation } from "@/hooks/useReservations";

interface AllReservationsTableProps {
  reservations: Reservation[];
  onEdit: (reservation: Reservation) => void;
  onDelete: (reservationId: string) => Promise<void>;
}

export function AllReservationsTable({ reservations, onEdit, onDelete }: AllReservationsTableProps) {
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

  return (
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
                    <Button size="sm" variant="outline" onClick={() => onEdit(reservation)}>
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => onDelete(reservation.id)}>
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
  );
}
