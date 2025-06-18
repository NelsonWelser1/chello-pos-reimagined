import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Edit, Trash2, Plus, Users, MapPin } from "lucide-react";
import { useTables } from "@/hooks/useTables";

interface TableData {
  id: string;
  number: number;
  seats: number;
  status: string;
  shape: string;
  location: string;
  notes: string;
}

export function TableManagement() {
  const { tables, loading, createTable, updateTable, deleteTable } = useTables();
  const [editingTable, setEditingTable] = useState<any>(null);
  const [isAddingTable, setIsAddingTable] = useState(false);
  const [newTable, setNewTable] = useState({
    number: "",
    seats: "",
    shape: "",
    location: "",
    notes: ""
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "bg-green-500";
      case "occupied": return "bg-red-500";
      case "reserved": return "bg-yellow-500";
      case "cleaning": return "bg-gray-500";
      default: return "bg-gray-400";
    }
  };

  const handleAddTable = async () => {
    if (!newTable.number || !newTable.seats || !newTable.shape || !newTable.location) {
      return;
    }

    await createTable({
      number: parseInt(newTable.number),
      seats: parseInt(newTable.seats),
      status: 'available',
      shape: newTable.shape as any,
      location: newTable.location,
      position_x: 0,
      position_y: 0,
      notes: newTable.notes
    });

    setNewTable({ number: "", seats: "", shape: "", location: "", notes: "" });
    setIsAddingTable(false);
  };

  const handleUpdateTable = async () => {
    if (!editingTable) return;

    await updateTable(editingTable.id, {
      number: editingTable.number,
      seats: editingTable.seats,
      shape: editingTable.shape,
      location: editingTable.location,
      notes: editingTable.notes
    });
    
    setEditingTable(null);
  };

  const handleDeleteTable = async (tableId: string) => {
    await deleteTable(tableId);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-xl text-slate-600">Loading tables...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Table Management</h2>
        <Dialog open={isAddingTable} onOpenChange={setIsAddingTable}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add New Table
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Table</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Table Number</Label>
                  <Input
                    type="number"
                    placeholder="Enter table number"
                    value={newTable.number}
                    onChange={(e) => setNewTable(prev => ({ ...prev, number: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Number of Seats</Label>
                  <Input
                    type="number"
                    placeholder="Enter seat count"
                    value={newTable.seats}
                    onChange={(e) => setNewTable(prev => ({ ...prev, seats: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Table Shape</Label>
                  <Select value={newTable.shape} onValueChange={(value) => setNewTable(prev => ({ ...prev, shape: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select shape" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="round">Round</SelectItem>
                      <SelectItem value="square">Square</SelectItem>
                      <SelectItem value="rectangle">Rectangle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Location</Label>
                  <Select value={newTable.location} onValueChange={(value) => setNewTable(prev => ({ ...prev, location: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Main Floor">Main Floor</SelectItem>
                      <SelectItem value="Patio">Patio</SelectItem>
                      <SelectItem value="Private Room">Private Room</SelectItem>
                      <SelectItem value="Bar Area">Bar Area</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Notes (Optional)</Label>
                <Input
                  placeholder="Additional notes..."
                  value={newTable.notes}
                  onChange={(e) => setNewTable(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddTable} className="flex-1">Add Table</Button>
                <Button variant="outline" onClick={() => setIsAddingTable(false)} className="flex-1">Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Tables</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Table #</TableHead>
                <TableHead>Seats</TableHead>
                <TableHead>Shape</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tables.map((table) => (
                <TableRow key={table.id}>
                  <TableCell className="font-medium">#{table.number}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {table.seats}
                    </div>
                  </TableCell>
                  <TableCell className="capitalize">{table.shape}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {table.location}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(table.status)}>
                      {table.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-32 truncate">{table.notes || "-"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setEditingTable(table)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteTable(table.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {editingTable && (
        <Dialog open={true} onOpenChange={() => setEditingTable(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Table {editingTable.number}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Table Number</Label>
                  <Input
                    type="number"
                    value={editingTable.number}
                    onChange={(e) => setEditingTable(prev => prev ? { ...prev, number: parseInt(e.target.value) } : null)}
                  />
                </div>
                <div>
                  <Label>Number of Seats</Label>
                  <Input
                    type="number"
                    value={editingTable.seats}
                    onChange={(e) => setEditingTable(prev => prev ? { ...prev, seats: parseInt(e.target.value) } : null)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Table Shape</Label>
                  <Select value={editingTable.shape} onValueChange={(value) => setEditingTable(prev => prev ? { ...prev, shape: value } : null)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="round">Round</SelectItem>
                      <SelectItem value="square">Square</SelectItem>
                      <SelectItem value="rectangle">Rectangle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Location</Label>
                  <Select value={editingTable.location} onValueChange={(value) => setEditingTable(prev => prev ? { ...prev, location: value } : null)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Main Floor">Main Floor</SelectItem>
                      <SelectItem value="Patio">Patio</SelectItem>
                      <SelectItem value="Private Room">Private Room</SelectItem>
                      <SelectItem value="Bar Area">Bar Area</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Notes</Label>
                <Input
                  value={editingTable.notes}
                  onChange={(e) => setEditingTable(prev => prev ? { ...prev, notes: e.target.value } : null)}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleUpdateTable} className="flex-1">Update Table</Button>
                <Button variant="outline" onClick={() => setEditingTable(null)} className="flex-1">Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
