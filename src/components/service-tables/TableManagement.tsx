
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useTables, Table } from "@/hooks/useTables";
import { TableForm } from "./TableForm";
import { TableList } from "./TableList";

export function TableManagement() {
  const { tables, loading, createTable, updateTable, deleteTable } = useTables();
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const [isAddingTable, setIsAddingTable] = useState(false);

  const handleAddTable = async (tableData: any) => {
    await createTable({
      ...tableData,
      status: 'available' as const,
      position_x: 0,
      position_y: 0
    });
  };

  const handleUpdateTable = async (tableData: any) => {
    if (!editingTable) return;
    await updateTable(editingTable.id, tableData);
    setEditingTable(null);
  };

  const handleDeleteTable = async (tableId: string) => {
    await deleteTable(tableId);
  };

  const handleEditTable = (table: Table) => {
    setEditingTable(table);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-xl text-slate-600">Loading tables...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Table Management</h2>
        <Dialog open={isAddingTable} onOpenChange={setIsAddingTable}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add New Table
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Tables</CardTitle>
        </CardHeader>
        <CardContent>
          <TableList 
            tables={tables}
            onEdit={handleEditTable}
            onDelete={handleDeleteTable}
          />
        </CardContent>
      </Card>

      <TableForm
        isOpen={isAddingTable}
        onClose={() => setIsAddingTable(false)}
        onSubmit={handleAddTable}
        title="Add New Table"
      />

      <TableForm
        isOpen={!!editingTable}
        onClose={() => setEditingTable(null)}
        onSubmit={handleUpdateTable}
        editingTable={editingTable}
        title={`Edit Table ${editingTable?.number || ''}`}
      />
    </div>
  );
}
