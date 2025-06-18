
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table } from "@/hooks/useTables";
import { toast } from "sonner";

interface TableFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tableData: any) => Promise<void>;
  editingTable?: Table | null;
  title: string;
}

export function TableForm({ isOpen, onClose, onSubmit, editingTable, title }: TableFormProps) {
  const [formData, setFormData] = useState({
    number: "",
    seats: "",
    shape: "",
    location: "",
    notes: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when dialog opens/closes or when editingTable changes
  useEffect(() => {
    if (isOpen) {
      if (editingTable) {
        setFormData({
          number: editingTable.number?.toString() || "",
          seats: editingTable.seats?.toString() || "",
          shape: editingTable.shape || "",
          location: editingTable.location || "",
          notes: editingTable.notes || ""
        });
      } else {
        // Clear form for new table
        setFormData({
          number: "",
          seats: "",
          shape: "",
          location: "",
          notes: ""
        });
      }
    }
  }, [isOpen, editingTable]);

  const resetForm = () => {
    setFormData({
      number: "",
      seats: "",
      shape: "",
      location: "",
      notes: ""
    });
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    console.log("Form submission started with data:", formData);

    // Validate required fields
    if (!formData.number || !formData.seats || !formData.shape || !formData.location) {
      console.error("Missing required fields");
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate number fields
    const tableNumber = parseInt(formData.number);
    const seatCount = parseInt(formData.seats);
    
    if (isNaN(tableNumber) || tableNumber <= 0) {
      console.error("Invalid table number");
      toast.error("Please enter a valid table number");
      return;
    }
    
    if (isNaN(seatCount) || seatCount <= 0) {
      console.error("Invalid seat count");
      toast.error("Please enter a valid seat count");
      return;
    }

    setIsSubmitting(true);

    try {
      const tableData = {
        number: tableNumber,
        seats: seatCount,
        shape: formData.shape,
        location: formData.location,
        notes: formData.notes || null
      };

      console.log("Submitting table data to Supabase:", tableData);
      await onSubmit(tableData);
      
      console.log("Table submission successful");
      toast.success("Table saved successfully!");
      
      // Clear form and close dialog on success
      resetForm();
      onClose();
    } catch (error) {
      console.error("Error submitting table:", error);
      toast.error("Failed to save table. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="table-number">Table Number *</Label>
              <Input
                id="table-number"
                type="number"
                placeholder="Enter table number"
                value={formData.number}
                onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}
                disabled={isSubmitting}
                min="1"
                required
              />
            </div>
            <div>
              <Label htmlFor="seat-count">Number of Seats *</Label>
              <Input
                id="seat-count"
                type="number"
                placeholder="Enter seat count"
                value={formData.seats}
                onChange={(e) => setFormData(prev => ({ ...prev, seats: e.target.value }))}
                disabled={isSubmitting}
                min="1"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="table-shape">Table Shape *</Label>
              <Select 
                value={formData.shape} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, shape: value }))}
                disabled={isSubmitting}
                required
              >
                <SelectTrigger id="table-shape">
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
              <Label htmlFor="table-location">Location *</Label>
              <Select 
                value={formData.location} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, location: value }))}
                disabled={isSubmitting}
                required
              >
                <SelectTrigger id="table-location">
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
            <Label htmlFor="table-notes">Notes (Optional)</Label>
            <Input
              id="table-notes"
              placeholder="Additional notes..."
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              disabled={isSubmitting}
            />
          </div>
          <div className="flex gap-2">
            <Button 
              type="submit"
              className="flex-1"
              disabled={isSubmitting || !formData.number || !formData.seats || !formData.shape || !formData.location}
            >
              {isSubmitting ? 'Saving...' : (editingTable ? 'Update Table' : 'Add Table')}
            </Button>
            <Button 
              type="button"
              variant="outline" 
              onClick={handleClose} 
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
