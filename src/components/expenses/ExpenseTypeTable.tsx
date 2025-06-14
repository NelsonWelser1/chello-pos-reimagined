
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2, DollarSign, Check, X } from "lucide-react";
import type { ExpenseType } from "../../pages/Expenses";

interface ExpenseTypeTableProps {
  expenseTypes: ExpenseType[];
  onEdit: (expenseType: ExpenseType) => void;
  onDelete: (id: string) => void;
}

export default function ExpenseTypeTable({ expenseTypes, onEdit, onDelete }: ExpenseTypeTableProps) {
  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Food & Beverage': 'bg-green-100 text-green-800',
      'Labor': 'bg-blue-100 text-blue-800',
      'Rent & Utilities': 'bg-red-100 text-red-800',
      'Marketing': 'bg-purple-100 text-purple-800',
      'Equipment': 'bg-orange-100 text-orange-800',
      'Maintenance': 'bg-yellow-100 text-yellow-800',
      'Other': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (expenseTypes.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <DollarSign className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">No expense types found</h3>
          <p className="text-muted-foreground text-center">
            Create your first expense type to start organizing your expenses.
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
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Budget Limit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tax Deductible</TableHead>
                <TableHead>Requires Approval</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenseTypes.map((expenseType) => (
                <TableRow key={expenseType.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: expenseType.color }}
                      />
                      <div>
                        <div className="font-medium">{expenseType.name}</div>
                        {expenseType.description && (
                          <div className="text-sm text-muted-foreground">
                            {expenseType.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getCategoryColor(expenseType.category)}>
                      {expenseType.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono">${expenseType.budgetLimit.toFixed(2)}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={expenseType.isActive ? "default" : "secondary"}>
                      {expenseType.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {expenseType.taxDeductible ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <X className="w-4 h-4 text-red-600" />
                    )}
                  </TableCell>
                  <TableCell>
                    {expenseType.requiresApproval ? (
                      <Check className="w-4 h-4 text-orange-600" />
                    ) : (
                      <X className="w-4 h-4 text-gray-400" />
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(expenseType)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(expenseType.id)}
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
