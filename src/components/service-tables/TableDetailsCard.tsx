
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Clock, MapPin } from "lucide-react";
import { Table } from "@/hooks/useTables";

interface TableDetailsCardProps {
  table: Table & {
    currentParty?: {
      guests: number;
      duration: number;
      customerName: string;
    };
  };
  onStartSession: () => void;
  onEndSession: () => void;
  onStatusChange: (status: Table['status']) => void;
}

export function TableDetailsCard({ 
  table, 
  onStartSession, 
  onEndSession, 
  onStatusChange 
}: TableDetailsCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "bg-green-500";
      case "occupied": return "bg-red-500";
      case "reserved": return "bg-yellow-500";
      case "cleaning": return "bg-gray-500";
      default: return "bg-gray-400";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Table {table.number} Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span className="text-sm">{table.seats} seats</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{table.location}</span>
          </div>
          <Badge className={getStatusColor(table.status)}>
            {table.status}
          </Badge>
        </div>

        {table.currentParty && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <h4 className="font-semibold text-sm mb-2">Current Party</h4>
            <div className="space-y-1 text-sm">
              <div>Customer: {table.currentParty.customerName}</div>
              <div>Guests: {table.currentParty.guests}</div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Duration: {table.currentParty.duration} min
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label>Actions</Label>
          <div className="flex gap-2 flex-col">
            {table.status === 'available' && (
              <Button onClick={onStartSession} size="sm">
                Start Session
              </Button>
            )}
            {table.status === 'occupied' && (
              <Button onClick={onEndSession} size="sm" variant="outline">
                End Session
              </Button>
            )}
            <Select
              value={table.status}
              onValueChange={(value) => onStatusChange(value as Table['status'])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="occupied">Occupied</SelectItem>
                <SelectItem value="reserved">Reserved</SelectItem>
                <SelectItem value="cleaning">Cleaning</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
