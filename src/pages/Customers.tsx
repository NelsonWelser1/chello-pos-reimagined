import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Search, Users, Filter, Download, RefreshCw } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useCustomers, Customer, NewCustomer } from "@/hooks/useCustomers";
import { Skeleton } from "@/components/ui/skeleton";
import CustomerStats from "@/components/customers/CustomerStats";
import CustomerTable from "@/components/customers/CustomerTable";
import CustomerForm from "@/components/customers/CustomerForm";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
export default function Customers() {
  const {
    customers,
    loading,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    fetchCustomers
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
  const handleRefresh = () => {
    fetchCustomers();
  };
  return <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 to-blue-50">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <div className="container p-6 space-y-8 mx-[232px] py-[23px] my-px px-[183px]">
            {/* Header Section */}
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Customer Management
                    </h1>
                    <p className="text-muted-foreground">
                      Manage your customer relationships and contact information
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <SidebarTrigger />
              </div>
            </div>

            {/* Stats Section */}
            <CustomerStats customers={customers} />

            {/* Controls Section */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                  <div className="flex flex-col sm:flex-row gap-4 flex-1">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input placeholder="Search customers by name, email, or phone..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading} className="flex items-center gap-2">
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="flex items-center gap-2">
                            <Filter className="w-4 h-4" />
                            Actions
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem className="flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            Export CSV
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <Button onClick={() => {
                  setEditingCustomer(null);
                  setShowCustomerForm(true);
                }} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Customer
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Table Section */}
            {loading ? <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                </CardContent>
              </Card> : <CustomerTable customers={filteredCustomers} onEdit={customer => {
            setEditingCustomer(customer);
            setShowCustomerForm(true);
          }} onDelete={id => setDeletingCustomerId(id)} />}

            {/* Customer Form Modal */}
            {showCustomerForm && <CustomerForm customer={editingCustomer} onSubmit={handleSaveCustomer} onCancel={() => {
            setShowCustomerForm(false);
            setEditingCustomer(null);
          }} />}

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!deletingCustomerId} onOpenChange={() => setDeletingCustomerId(null)}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the customer
                    and remove all their data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteCustomer} className="bg-red-600 hover:bg-red-700">
                    Delete Customer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </main>
      </div>
    </SidebarProvider>;
}