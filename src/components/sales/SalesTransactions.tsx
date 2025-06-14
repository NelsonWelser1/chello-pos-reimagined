
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Receipt, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  CreditCard,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw
} from "lucide-react";
import { useState } from "react";

const transactions = [
  {
    id: "TXN-2024-001234",
    time: "2024-01-15 19:45:23",
    customer: "Sarah Johnson",
    items: ["Grilled Salmon", "Caesar Salad", "Wine"],
    amount: 89.50,
    payment: "Credit Card",
    status: "completed",
    table: "Table 12"
  },
  {
    id: "TXN-2024-001235",
    time: "2024-01-15 19:42:11",
    customer: "Mike Chen",
    items: ["Burger Deluxe", "Fries", "Soda"],
    amount: 24.75,
    payment: "Cash",
    status: "completed",
    table: "Counter"
  },
  {
    id: "TXN-2024-001236",
    time: "2024-01-15 19:38:45",
    customer: "Emily Rodriguez",
    items: ["Pasta Primavera", "Garlic Bread"],
    amount: 32.90,
    payment: "Mobile Pay",
    status: "processing",
    table: "Table 8"
  },
  {
    id: "TXN-2024-001237",
    time: "2024-01-15 19:35:12",
    customer: "David Wilson",
    items: ["Steak Dinner", "Side Salad", "Beer"],
    amount: 67.25,
    payment: "Credit Card",
    status: "refunded",
    table: "Table 5"
  },
  {
    id: "TXN-2024-001238",
    time: "2024-01-15 19:30:33",
    customer: "Lisa Thompson",
    items: ["Chicken Wrap", "Soup", "Iced Tea"],
    amount: 18.40,
    payment: "Debit Card",
    status: "completed",
    table: "Table 3"
  }
];

export function SalesTransactions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "refunded":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "processing":
        return <RefreshCw className="w-4 h-4" />;
      case "refunded":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getPaymentIcon = (payment: string) => {
    switch (payment.toLowerCase()) {
      case "credit card":
      case "debit card":
        return <CreditCard className="w-4 h-4" />;
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header and Controls */}
      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-3xl font-black text-slate-800">
            <Receipt className="w-8 h-8 text-blue-600" />
            Transaction Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-1 gap-4 items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 text-base"
                />
              </div>
              <Button variant="outline" size="lg" className="h-12">
                <Filter className="w-5 h-5 mr-2" />
                Filter
              </Button>
            </div>
            <Button size="lg" className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 h-12">
              <Download className="w-5 h-5 mr-2" />
              Export Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead className="font-black text-base">Transaction ID</TableHead>
                <TableHead className="font-black text-base">Time & Date</TableHead>
                <TableHead className="font-black text-base">Customer</TableHead>
                <TableHead className="font-black text-base">Items</TableHead>
                <TableHead className="font-black text-base">Amount</TableHead>
                <TableHead className="font-black text-base">Payment</TableHead>
                <TableHead className="font-black text-base">Status</TableHead>
                <TableHead className="font-black text-base">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id} className="hover:bg-blue-50/30 transition-colors">
                  <TableCell className="font-mono font-semibold text-blue-600">
                    {transaction.id}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold">{transaction.time.split(' ')[1]}</span>
                      <span className="text-sm text-gray-600">{transaction.time.split(' ')[0]}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold">{transaction.customer}</span>
                      <span className="text-sm text-gray-600">{transaction.table}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-48">
                      <p className="truncate font-medium">{transaction.items.join(", ")}</p>
                      <p className="text-sm text-gray-600">{transaction.items.length} items</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-xl font-black text-green-600">
                      ${transaction.amount.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getPaymentIcon(transaction.payment)}
                      <span className="font-medium">{transaction.payment}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(transaction.status)} flex items-center gap-1 px-3 py-1`}>
                      {getStatusIcon(transaction.status)}
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" className="hover:bg-blue-50">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-lg border-0 bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 font-semibold">Total Sales</p>
                <p className="text-3xl font-black">$232.80</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 font-semibold">Transactions</p>
                <p className="text-3xl font-black">5</p>
              </div>
              <Receipt className="w-10 h-10 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-yellow-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 font-semibold">Processing</p>
                <p className="text-3xl font-black">1</p>
              </div>
              <RefreshCw className="w-10 h-10 text-yellow-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 font-semibold">Avg. Order</p>
                <p className="text-3xl font-black">$46.56</p>
              </div>
              <DollarSign className="w-10 h-10 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
