
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useCustomers, Customer, NewCustomer } from "@/hooks/useCustomers";
import { Skeleton } from "@/components/ui/skeleton";
import CustomerStats from "@/components/customers/CustomerStats";
import CustomerTable from "@/components/customers/CustomerTable";
import CustomerForm from "@/components/customers/CustomerForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Customers() {
  const {
    customers,
    loading,
    addCustomer,
    updateCustomer,
    deleteCustomer,
  } = useCustomers();

  const [searchTerm, setSearchTerm] = useState("");
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [deletingCustomerId, setDeletingCustomerId] = useState<string | null>(null);

  const filteredCustomers = customers.filter(customer => {
    const searchContent = `${customer.name} ${customer.email || ''} ${customer.phone || ''}`.toLowerCase();
    return searchContent.includes(searchTerm.toLowerCase());
  });

  const handleSaveCustomer = async (formData: NewCustomer) => {
    if (editingCustomer) {
      await updateCustomer(editingCustomer.id, formData);
    } else {
      await addCustomer(formData);
    }
    setEditingCustomer(null);
    setShowCustomerForm(false);
  };

  const handleDeleteCustomer = async () => {
    if (deletingCustomerId) {
      await deleteCustomer(deletingCustomerId);
      setDeletingCustomerId(null);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                  👥 Customer Management
                </h1>
                <p className="text-muted-foreground mt-2">
                  View, add, edit, and manage your customers.
                </p>
              </div>
              <SidebarTrigger />
            </div>

            <CustomerStats customers={customers} />

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex gap-4 flex-1">
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search customers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button 
                onClick={() => { setEditingCustomer(null); setShowCustomerForm(true); }}
                className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Customer
              </Button>
            </div>

            {loading ? (
                <Skeleton className="h-96 w-full" />
            ) : (
              <CustomerTable
                customers={filteredCustomers}
                onEdit={(customer) => {
                  setEditingCustomer(customer);
                  setShowCustomerForm(true);
                }}
                onDelete={(id) => setDeletingCustomerId(id)}
              />
            )}

            {showCustomerForm && (
              <CustomerForm
                customer={editingCustomer}
                onSubmit={handleSaveCustomer}
                onCancel={() => {
                  setShowCustomerForm(false);
                  setEditingCustomer(null);
                }}
              />
            )}

            <AlertDialog open={!!deletingCustomerId} onOpenChange={() => setDeletingCustomerId(null)}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the customer.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteCustomer} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
