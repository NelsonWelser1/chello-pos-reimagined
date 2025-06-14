
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  RefreshCw,
  CreditCard,
  Smartphone,
  Banknote
} from "lucide-react";

export function TransactionHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const transactions = [
    {
      id: "TXN-001",
      amount: "$45.99",
      method: "Credit Card",
      methodIcon: CreditCard,
      status: "completed",
      customer: "John Doe",
      date: "2024-01-15",
      time: "14:30",
      reference: "REF-12345"
    },
    {
      id: "TXN-002",
      amount: "$23.50",
      method: "Mobile Pay",
      methodIcon: Smartphone,
      status: "completed",
      customer: "Jane Smith",
      date: "2024-01-15",
      time: "14:25",
      reference: "REF-12346"
    },
    {
      id: "TXN-003",
      amount: "$67.80",
      method: "Cash",
      methodIcon: Banknote,
      status: "completed",
      customer: "Mike Johnson",
      date: "2024-01-15",
      time: "14:20",
      reference: "REF-12347"
    },
    {
      id: "TXN-004",
      amount: "$15.25",
      method: "Credit Card",
      methodIcon: CreditCard,
      status: "pending",
      customer: "Sarah Wilson",
      date: "2024-01-15",
      time: "14:15",
      reference: "REF-12348"
    },
    {
      id: "TXN-005",
      amount: "$89.99",
      method: "Mobile Pay",
      methodIcon: Smartphone,
      status: "failed",
      customer: "David Brown",
      date: "2024-01-15",
      time: "14:10",
      reference: "REF-12349"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500";
      case "pending": return "bg-yellow-500";
      case "failed": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const handleExport = () => {
    console.log("Exporting transaction history...");
  };

  const handleRefresh = () => {
    console.log("Refreshing transactions...");
  };

  const viewTransaction = (id: string) => {
    console.log("Viewing transaction:", id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Transaction History</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
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
                  placeholder="Search transactions..."
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
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <transaction.methodIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{transaction.id}</span>
                      <Badge className={getStatusColor(transaction.status)}>
                        {transaction.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">{transaction.customer}</p>
                  </div>
                </div>
                
                <div className="text-center hidden md:block">
                  <p className="font-semibold">{transaction.method}</p>
                  <p className="text-sm text-gray-500">{transaction.reference}</p>
                </div>
                
                <div className="text-center hidden md:block">
                  <p className="font-semibold">{transaction.date}</p>
                  <p className="text-sm text-gray-500">{transaction.time}</p>
                </div>
                
                <div className="text-right">
                  <p className="font-bold text-lg text-green-600">{transaction.amount}</p>
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
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
