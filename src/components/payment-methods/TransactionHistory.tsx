
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useMemo } from "react";
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  RefreshCw,
  CreditCard,
  Smartphone,
  Banknote,
  History
} from "lucide-react";
import { useSalesTransactions } from "@/hooks/useSalesTransactions";
import { usePaymentConfiguration } from "@/hooks/usePaymentConfiguration";
import { format } from "date-fns";
import { toast } from "sonner";

export function TransactionHistory() {
  const { transactions, loading, refetch } = useSalesTransactions();
  const { config } = usePaymentConfiguration();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const getMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case 'card':
      case 'credit card':
        return CreditCard;
      case 'mobile pay':
      case 'mobile':
        return Smartphone;
      case 'cash':
        return Banknote;
      default:
        return CreditCard;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed": return "bg-green-500";
      case "pending": return "bg-yellow-500";
      case "pending_settlement": return "bg-blue-500";
      case "pending_verification": return "bg-orange-500";
      case "failed": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const filteredTransactions = useMemo(() => {
    let filtered = transactions;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(transaction => 
        transaction.transaction_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.payment_method.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (transaction.notes && transaction.notes.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter(transaction => 
        transaction.payment_status.toLowerCase() === filterStatus.toLowerCase()
      );
    }

    return filtered;
  }, [transactions, searchTerm, filterStatus]);

  const handleExport = () => {
    try {
      const csvContent = [
        ['Transaction ID', 'Date & Time', 'Amount', 'Payment Method', 'Status', 'Notes'].join(','),
        ...filteredTransactions.map(transaction => [
          transaction.transaction_id,
          format(new Date(transaction.transaction_date), 'yyyy-MM-dd HH:mm:ss'),
          `${transaction.total_amount} ${config?.currency || 'UGX'}`,
          transaction.payment_method,
          transaction.payment_status,
          transaction.notes || ''
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transaction-history-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Transaction history exported successfully');
    } catch (error) {
      console.error('Error exporting transaction history:', error);
      toast.error('Failed to export transaction history');
    }
  };

  const handleRefresh = () => {
    refetch();
    toast.success('Transaction history refreshed');
  };

  const viewTransaction = (id: string) => {
    const transaction = transactions.find(t => t.id === id);
    if (transaction) {
      toast.info(`Transaction ${transaction.transaction_id} - ${transaction.payment_status}`);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <History className="w-6 h-6" />
            Transaction History
          </h2>
        </div>
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-lg text-gray-600">Loading transaction history...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <History className="w-6 h-6" />
          Transaction History ({filteredTransactions.length})
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by transaction ID, payment method, or notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="pending_settlement">Pending Settlement</SelectItem>
                <SelectItem value="pending_verification">Pending Verification</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <History className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 font-medium">
                {transactions.length === 0 ? "No transactions found" : "No transactions match your search criteria"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => {
                const MethodIcon = getMethodIcon(transaction.payment_method);
                
                return (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <MethodIcon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{transaction.transaction_id}</span>
                          <Badge className={getStatusColor(transaction.payment_status)}>
                            {transaction.payment_status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">
                          {format(new Date(transaction.transaction_date), 'MMM dd, yyyy - HH:mm')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-center hidden md:block">
                      <p className="font-semibold capitalize">{transaction.payment_method}</p>
                      <p className="text-sm text-gray-500">
                        Tax: {transaction.tax_amount.toFixed(2)} {config?.currency || 'UGX'}
                      </p>
                    </div>
                    
                    <div className="text-center hidden md:block">
                      <p className="text-sm text-gray-500">Subtotal</p>
                      <p className="font-medium">
                        {transaction.subtotal.toFixed(2)} {config?.currency || 'UGX'}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-bold text-lg text-green-600">
                        {transaction.total_amount.toFixed(2)} {config?.currency || 'UGX'}
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => viewTransaction(transaction.id)}
                        className="mt-1"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
