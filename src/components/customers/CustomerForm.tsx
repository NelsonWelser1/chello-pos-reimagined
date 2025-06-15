
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import type { Customer, NewCustomer } from "@/hooks/useCustomers";

interface CustomerFormProps {
  customer: Customer | null;
  onSubmit: (data: NewCustomer) => void;
  onCancel: () => void;
}

const initialData: NewCustomer = {
    name: "",
    email: "",
    phone: "",
    address: {
        street: "",
        city: "",
        state: "",
        zip: "",
        country: ""
    }
};

export default function CustomerForm({ customer, onSubmit, onCancel }: CustomerFormProps) {
  const [formData, setFormData] = useState<NewCustomer>(initialData);

  useEffect(() => {
    if (customer) {
        const {id, createdAt, updatedAt, ...rest} = customer
      setFormData({
          ...initialData,
          ...rest,
          address: customer.address || initialData.address
      });
    } else {
      setFormData(initialData);
    }
  }, [customer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ 
        ...prev, 
        address: {
            ...prev.address,
            [name]: value
        }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{customer ? "Edit Customer" : "Add New Customer"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">Email</Label>
            <Input id="email" name="email" type="email" value={formData.email || ""} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">Phone</Label>
            <Input id="phone" name="phone" value={formData.phone || ""} onChange={handleChange} className="col-span-3" />
          </div>
          <h4 className="text-lg font-medium mt-4 border-t pt-4 col-span-4">Address</h4>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="street" className="text-right">Street</Label>
            <Input id="street" name="street" value={formData.address?.street || ""} onChange={handleAddressChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="city" className="text-right">City</Label>
            <Input id="city" name="city" value={formData.address?.city || ""} onChange={handleAddressChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="state" className="text-right">State</Label>
            <Input id="state" name="state" value={formData.address?.state || ""} onChange={handleAddressChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="zip" className="text-right">Zip Code</Label>
            <Input id="zip" name="zip" value={formData.address?.zip || ""} onChange={handleAddressChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="country" className="text-right">Country</Label>
            <Input id="country" name="country" value={formData.address?.country || ""} onChange={handleAddressChange} className="col-span-3" />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit">Save Customer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
