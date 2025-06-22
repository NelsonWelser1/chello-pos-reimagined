
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
  const [errors, setErrors] = useState<Record<string, string>>({});

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
        resetForm();
      }
      setErrors({});
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
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.number.trim()) {
      newErrors.number = "Table number is required";
    } else if (isNaN(parseInt(formData.number)) || parseInt(formData.number) <= 0) {
      newErrors.number = "Please enter a valid table number";
    }

    if (!formData.seats.trim()) {
      newErrors.seats = "Number of seats is required";
    } else if (isNaN(parseInt(formData.seats)) || parseInt(formData.seats) <= 0) {
      newErrors.seats = "Please enter a valid seat count";
    }

    if (!formData.shape) {
      newErrors.shape = "Table shape is required";
    }

    if (!formData.location) {
      newErrors.location = "Table location is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the form errors before submitting");
      return;
    }

    setIsSubmitting(true);

    try {
      const tableData = {
        number: parseInt(formData.number),
        seats: parseInt(formData.seats),
        shape: formData.shape as 'round' | 'square' | 'rectangle',
        location: formData.location,
        notes: formData.notes.trim() || null
      };

      console.log("Submitting table data to Supabase:", tableData);
      await onSubmit(tableData);
      
      console.log("Table submission successful");
      toast.success(editingTable ? "Table updated successfully!" : "Table created successfully!");
      
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
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
                onChange={(e) => handleInputChange("number", e.target.value)}
                disabled={isSubmitting}
                min="1"
                className={errors.number ? "border-red-500" : ""}
                required
              />
              {errors.number && <p className="text-sm text-red-500 mt-1">{errors.number}</p>}
            </div>
            <div>
              <Label htmlFor="seat-count">Number of Seats *</Label>
              <Input
                id="seat-count"
                type="number"
                placeholder="Enter seat count"
                value={formData.seats}
                onChange={(e) => handleInputChange("seats", e.target.value)}
                disabled={isSubmitting}
                min="1"
                className={errors.seats ? "border-red-500" : ""}
                required
              />
              {errors.seats && <p className="text-sm text-red-500 mt-1">{errors.seats}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="table-shape">Table Shape *</Label>
              <Select 
                value={formData.shape} 
                onValueChange={(value) => handleInputChange("shape", value)}
                disabled={isSubmitting}
                required
              >
                <SelectTrigger id="table-shape" className={errors.shape ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select shape" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="round">Round</SelectItem>
                  <SelectItem value="square">Square</SelectItem>
                  <SelectItem value="rectangle">Rectangle</SelectItem>
                </SelectContent>
              </Select>
              {errors.shape && <p className="text-sm text-red-500 mt-1">{errors.shape}</p>}
            </div>
            <div>
              <Label htmlFor="table-location">Location *</Label>
              <Select 
                value={formData.location} 
                onValueChange={(value) => handleInputChange("location", value)}
                disabled={isSubmitting}
                required
              >
                <SelectTrigger id="table-location" className={errors.location ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Main Floor">Main Floor</SelectItem>
                  <SelectItem value="Patio">Patio</SelectItem>
                  <SelectItem value="Private Room">Private Room</SelectItem>
                  <SelectItem value="Bar Area">Bar Area</SelectItem>
                </SelectContent>
              </Select>
              {errors.location && <p className="text-sm text-red-500 mt-1">{errors.location}</p>}
            </div>
          </div>
          <div>
            <Label htmlFor="table-notes">Notes (Optional)</Label>
            <Input
              id="table-notes"
              placeholder="Additional notes..."
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <div className="flex gap-2 pt-4">
            <Button 
              type="submit"
              className="flex-1"
              disabled={isSubmitting}
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
