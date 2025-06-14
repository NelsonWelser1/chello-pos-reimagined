
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2, Receipt, Eye } from "lucide-react";
import type { Expense } from "../../pages/Expenses";

interface ExpenseTableProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

export default function ExpenseTable({ expenses, onEdit, onDelete }: ExpenseTableProps) {
  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Approved': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800',
      'Paid': 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentMethodColor = (method: string) => {
    const colors: { [key: string]: string } = {
      'Cash': 'bg-green-100 text-green-800',
      'Credit Card': 'bg-blue-100 text-blue-800',
      'Debit Card': 'bg-purple-100 text-purple-800',
      'Bank Transfer': 'bg-orange-100 text-orange-800',
      'Check': 'bg-gray-100 text-gray-800'
    };
    return colors[method] || 'bg-gray-100 text-gray-800';
  };

  if (expenses.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Receipt className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">No expenses found</h3>
          <p className="text-muted-foreground text-center">
            Create your first expense to start tracking your restaurant costs.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{expense.description}</div>
                      {expense.receiptNumber && (
                        <div className="text-sm text-muted-foreground">
                          Receipt: {expense.receiptNumber}
                        </div>
                      )}
                      {expense.isRecurring && (
                        <Badge variant="outline" className="mt-1">
                          Recurring {expense.recurringPeriod}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{expense.typeName}</div>
                      <div className="text-sm text-muted-foreground">{expense.category}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-mono">
                      <div>${expense.amount.toFixed(2)}</div>
                      {expense.taxAmount > 0 && (
                        <div className="text-sm text-muted-foreground">
                          Tax: ${expense.taxAmount.toFixed(2)}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(expense.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div>
                      {expense.vendor && (
                        <div className="font-medium">{expense.vendor}</div>
                      )}
                      <div className="text-sm text-muted-foreground">
                        by {expense.createdBy}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getPaymentMethodColor(expense.paymentMethod)}>
                      {expense.paymentMethod}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge variant="secondary" className={getStatusColor(expense.status)}>
                        {expense.status}
                      </Badge>
                      {expense.approvedBy && (
                        <div className="text-xs text-muted-foreground">
                          by {expense.approvedBy}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(expense)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(expense.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
