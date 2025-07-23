
import { useState } from "react";
import { useOrders } from "@/hooks/useOrders";
import { useStaff } from "@/hooks/useStaff";
import { useDataSynchronization } from "@/hooks/useDataSynchronization";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { format } from "date-fns";
import { Receipt, User, CreditCard, Calendar, DollarSign } from "lucide-react";
import { OrderTransactionLink } from "./OrderTransactionLink";
import { toast } from "sonner";

export function OrdersList() {
  const { orders, loading, refetch: refetchOrders } = useOrders();
  const { staff, refetch: refetchStaff } = useStaff();
  const [currentPage, setCurrentPage] = useState(1);

  // Setup comprehensive data synchronization
  const { isConnected, syncStatus } = useDataSynchronization({
    onOrderUpdate: refetchOrders,
    onStaffUpdate: refetchStaff,
    onTransactionUpdate: refetchOrders,
    onKitchenUpdate: refetchOrders, // Kitchen status affects order display
  });
  const ordersPerPage = 10;

  // Create a map of staff members for quick lookup
  const staffMap = staff.reduce((acc, member) => {
    acc[member.id] = member;
    return acc;
  }, {} as Record<string, any>);

  // Calculate pagination
  const totalPages = Math.ceil(orders.length / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const endIndex = startIndex + ordersPerPage;
  const currentOrders = orders.slice(startIndex, endIndex);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending_verification':
        return 'bg-orange-100 text-orange-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewTransaction = (transactionId: string) => {
    toast.info(`Viewing transaction details: ${transactionId}`);
    // Here you could navigate to a detailed transaction view or open a modal
  };

  if (loading) {
    return (
      <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
        <CardContent className="p-12 text-center">
          <div className="text-xl text-slate-600">Loading orders...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-black text-slate-800 flex items-center gap-3">
          <Receipt className="w-8 h-8 text-blue-500" />
          Recent Orders ({orders.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Receipt className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500 font-medium">No orders found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-bold">Order ID</TableHead>
                    <TableHead className="font-bold">Date & Time</TableHead>
                    <TableHead className="font-bold">Total Amount</TableHead>
                    <TableHead className="font-bold">Payment Method</TableHead>
                    <TableHead className="font-bold">Status</TableHead>
                    <TableHead className="font-bold">Transaction Status</TableHead>
                    <TableHead className="font-bold">Processed By</TableHead>
                    <TableHead className="font-bold">Table</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentOrders.map((order) => {
                    const staffMember = order.staff_id ? staffMap[order.staff_id] : null;
                    
                    return (
                      <TableRow key={order.id} className="hover:bg-slate-50">
                        <TableCell className="font-mono text-sm">
                          #{order.id.slice(-8)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <div>
                              <div className="font-medium">
                                {format(new Date(order.created_at), 'MMM dd, yyyy')}
                              </div>
                              <div className="text-sm text-slate-500">
                                {format(new Date(order.created_at), 'HH:mm')}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-green-500" />
                            <span className="font-bold text-green-600">
                              {order.total_amount.toFixed(2)} UGX
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-slate-400" />
                            <span className="capitalize">{order.payment_method}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <OrderTransactionLink 
                            orderId={order.id} 
                            onViewTransaction={handleViewTransaction}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-slate-400" />
                            {staffMember ? (
                              <div>
                                <div className="font-medium">{staffMember.name}</div>
                                <div className="text-sm text-slate-500">{staffMember.role}</div>
                              </div>
                            ) : (
                              <span className="text-slate-400 italic">System</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {order.table_number ? (
                            <Badge variant="outline">Table {order.table_number}</Badge>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <div className="mt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
