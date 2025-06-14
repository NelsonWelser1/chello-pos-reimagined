
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2, Copy, Settings, Check, X, AlertTriangle } from "lucide-react";
import type { ExpenseType } from "../../pages/ExpenseTypes";

interface ExpenseTypeTableProps {
  expenseTypes: ExpenseType[];
  onEdit: (expenseType: ExpenseType) => void;
  onDelete: (id: string) => void;
  onDuplicate: (expenseType: ExpenseType) => void;
}

export default function ExpenseTypeTable({ expenseTypes, onEdit, onDelete, onDuplicate }: ExpenseTypeTableProps) {
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

  const getPriorityColor = (priority: string) => {
    const colors: { [key: string]: string } = {
      'Low': 'bg-gray-100 text-gray-800',
      'Medium': 'bg-blue-100 text-blue-800',
      'High': 'bg-orange-100 text-orange-800',
      'Critical': 'bg-red-100 text-red-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  if (expenseTypes.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Settings className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">No expense types found</h3>
          <p className="text-muted-foreground text-center">
            Create your first expense type to start organizing your expense categories.
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
                <TableHead>Budget</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Features</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>GL Code</TableHead>
                <TableHead className="w-[140px]">Actions</TableHead>
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
                        {expenseType.tags.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {expenseType.tags.slice(0, 3).map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {expenseType.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{expenseType.tags.length - 3}
                              </Badge>
                            )}
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
                    <div>
                      <span className="font-mono">${expenseType.budgetLimit.toLocaleString()}</span>
                      <div className="text-sm text-muted-foreground">
                        {expenseType.budgetPeriod}
                      </div>
                      {expenseType.notificationThreshold < 100 && (
                        <div className="text-xs text-orange-600">
                          Alert at {expenseType.notificationThreshold}%
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getPriorityColor(expenseType.priority)}>
                      {expenseType.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {expenseType.requiresApproval && (
                        <div className="flex items-center gap-1 text-xs">
                          <AlertTriangle className="w-3 h-3 text-orange-600" />
                          <span>Approval (${expenseType.approvalThreshold}+)</span>
                        </div>
                      )}
                      {expenseType.autoRecurring && (
                        <div className="flex items-center gap-1 text-xs">
                          <Check className="w-3 h-3 text-green-600" />
                          <span>Auto Recurring</span>
                        </div>
                      )}
                      {expenseType.taxDeductible && (
                        <div className="flex items-center gap-1 text-xs">
                          <Check className="w-3 h-3 text-blue-600" />
                          <span>Tax Deductible</span>
                        </div>
                      )}
                      {!expenseType.allowOverBudget && (
                        <div className="flex items-center gap-1 text-xs">
                          <X className="w-3 h-3 text-red-600" />
                          <span>Budget Locked</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={expenseType.isActive ? "default" : "secondary"}>
                      {expenseType.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      {expenseType.glCode && (
                        <div className="font-mono text-sm">{expenseType.glCode}</div>
                      )}
                      {expenseType.costCenter && (
                        <div className="text-xs text-muted-foreground">{expenseType.costCenter}</div>
                      )}
                    </div>
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
                        onClick={() => onDuplicate(expenseType)}
                      >
                        <Copy className="w-4 h-4" />
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
