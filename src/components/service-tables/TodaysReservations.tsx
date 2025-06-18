
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Users, Edit, CheckCircle } from "lucide-react";
import { Reservation } from "@/hooks/useReservations";

interface TodaysReservationsProps {
  reservations: Reservation[];
  onEdit: (reservation: Reservation) => void;
  onUpdateStatus: (reservationId: string, status: string) => Promise<void>;
}

export function TodaysReservations({ reservations, onEdit, onUpdateStatus }: TodaysReservationsProps) {
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

  const todaysReservations = reservations.filter(r => r.date === new Date().toISOString().split('T')[0]);

  return (
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
                <Button size="sm" variant="outline" onClick={() => onEdit(reservation)}>
                  <Edit className="w-3 h-3" />
                </Button>
                {reservation.status === "confirmed" && (
                  <Button size="sm" onClick={() => onUpdateStatus(reservation.id, "seated")}>
                    <CheckCircle className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
