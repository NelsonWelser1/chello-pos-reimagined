
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table } from "@/hooks/useTables";

interface TableFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tableData: any) => Promise<void>;
  editingTable?: Table | null;
  title: string;
}

export function TableForm({ isOpen, onClose, onSubmit, editingTable, title }: TableFormProps) {
  const [formData, setFormData] = useState({
    number: editingTable?.number?.toString() || "",
    seats: editingTable?.seats?.toString() || "",
    shape: editingTable?.shape || "",
    location: editingTable?.location || "",
    notes: editingTable?.notes || ""
  });

  const handleSubmit = async () => {
    if (!formData.number || !formData.seats || !formData.shape || !formData.location) {
      return;
    }

    const tableData = {
      number: parseInt(formData.number),
      seats: parseInt(formData.seats),
      shape: formData.shape,
      location: formData.location,
      notes: formData.notes
    };

    await onSubmit(tableData);
    setFormData({ number: "", seats: "", shape: "", location: "", notes: "" });
    onClose();
  };

  const handleClose = () => {
    setFormData({ number: "", seats: "", shape: "", location: "", notes: "" });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Table Number</Label>
              <Input
                type="number"
                placeholder="Enter table number"
                value={formData.number}
                onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}
              />
            </div>
            <div>
              <Label>Number of Seats</Label>
              <Input
                type="number"
                placeholder="Enter seat count"
                value={formData.seats}
                onChange={(e) => setFormData(prev => ({ ...prev, seats: e.target.value }))}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Table Shape</Label>
              <Select 
                value={formData.shape} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, shape: value }))}
              >
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
              <Select 
                value={formData.location} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, location: value }))}
              >
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
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSubmit} className="flex-1">
              {editingTable ? 'Update Table' : 'Add Table'}
            </Button>
            <Button variant="outline" onClick={handleClose} className="flex-1">Cancel</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
