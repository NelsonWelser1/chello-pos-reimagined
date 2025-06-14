
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Users, Clock, MapPin } from "lucide-react";
import { toast } from "sonner";

interface Table {
  id: string;
  number: number;
  seats: number;
  status: "available" | "occupied" | "reserved" | "cleaning";
  position: { x: number; y: number };
  shape: "round" | "square" | "rectangle";
  currentParty?: {
    guests: number;
    duration: number;
    customerName: string;
  };
}

export function TableLayout() {
  const [tables, setTables] = useState<Table[]>([
    { id: "1", number: 1, seats: 4, status: "occupied", position: { x: 10, y: 10 }, shape: "round", currentParty: { guests: 3, duration: 45, customerName: "Smith" } },
    { id: "2", number: 2, seats: 2, status: "available", position: { x: 200, y: 10 }, shape: "square" },
    { id: "3", number: 3, seats: 6, status: "reserved", position: { x: 400, y: 10 }, shape: "rectangle" },
    { id: "4", number: 4, seats: 4, status: "cleaning", position: { x: 10, y: 150 }, shape: "round" },
    { id: "5", number: 5, seats: 8, status: "available", position: { x: 200, y: 150 }, shape: "rectangle" },
    { id: "6", number: 6, seats: 2, status: "occupied", position: { x: 400, y: 150 }, shape: "square", currentParty: { guests: 2, duration: 25, customerName: "Johnson" } },
  ]);

  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [isAddingTable, setIsAddingTable] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "bg-green-500";
      case "occupied": return "bg-red-500";
      case "reserved": return "bg-yellow-500";
      case "cleaning": return "bg-gray-500";
      default: return "bg-gray-400";
    }
  };

  const getShapeClass = (shape: string) => {
    switch (shape) {
      case "round": return "rounded-full";
      case "square": return "rounded-lg";
      case "rectangle": return "rounded-lg";
      default: return "rounded-lg";
    }
  };

  const getShapeSize = (shape: string, seats: number) => {
    const baseSize = Math.max(60, seats * 8);
    if (shape === "rectangle") {
      return { width: baseSize * 1.5, height: baseSize };
    }
    return { width: baseSize, height: baseSize };
  };

  const handleTableClick = (table: Table) => {
    setSelectedTable(table);
  };

  const updateTableStatus = (tableId: string, newStatus: string) => {
    setTables(prev => prev.map(table => 
      table.id === tableId ? { ...table, status: newStatus as any } : table
    ));
    toast.success(`Table ${tables.find(t => t.id === tableId)?.number} status updated to ${newStatus}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Restaurant Floor Plan</h2>
        <Button onClick={() => setIsAddingTable(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Table
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Floor Layout</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-dashed border-slate-300 rounded-lg h-96 overflow-hidden">
                {tables.map((table) => {
                  const size = getShapeSize(table.shape, table.seats);
                  return (
                    <div
                      key={table.id}
                      className={`absolute cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-lg ${getShapeClass(table.shape)} ${getStatusColor(table.status)} flex items-center justify-center text-white font-bold text-sm border-2 border-white shadow-md`}
                      style={{
                        left: table.position.x,
                        top: table.position.y,
                        width: size.width,
                        height: size.height,
                      }}
                      onClick={() => handleTableClick(table)}
                    >
                      <div className="text-center">
                        <div>T{table.number}</div>
                        <div className="text-xs">{table.seats} seats</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Status Legend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-sm">Occupied</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span className="text-sm">Reserved</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-500 rounded"></div>
                <span className="text-sm">Cleaning</span>
              </div>
            </CardContent>
          </Card>

          {selectedTable && (
            <Card>
              <CardHeader>
                <CardTitle>Table {selectedTable.number} Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{selectedTable.seats} seats</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{selectedTable.shape} table</span>
                  </div>
                  <Badge className={getStatusColor(selectedTable.status)}>
                    {selectedTable.status}
                  </Badge>
                </div>

                {selectedTable.currentParty && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">Current Party</h4>
                    <div className="space-y-1 text-sm">
                      <div>Customer: {selectedTable.currentParty.customerName}</div>
                      <div>Guests: {selectedTable.currentParty.guests}</div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Duration: {selectedTable.currentParty.duration} min
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Change Status</Label>
                  <Select
                    value={selectedTable.status}
                    onValueChange={(value) => updateTableStatus(selectedTable.id, value)}
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
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
