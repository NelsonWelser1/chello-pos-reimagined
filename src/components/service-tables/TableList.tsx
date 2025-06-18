
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2, Users, MapPin } from "lucide-react";
import { Table as TableType } from "@/hooks/useTables";

interface TableListProps {
  tables: TableType[];
  onEdit: (table: TableType) => void;
  onDelete: (tableId: string) => void;
}

export function TableList({ tables, onEdit, onDelete }: TableListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "bg-green-500";
      case "occupied": return "bg-red-500";
      case "reserved": return "bg-yellow-500";
      case "cleaning": return "bg-gray-500";
      default: return "bg-gray-400";
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Table #</TableHead>
          <TableHead>Seats</TableHead>
          <TableHead>Shape</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Notes</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tables.map((table) => (
          <TableRow key={table.id}>
            <TableCell className="font-medium">#{table.number}</TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {table.seats}
              </div>
            </TableCell>
            <TableCell className="capitalize">{table.shape}</TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {table.location}
              </div>
            </TableCell>
            <TableCell>
              <Badge className={getStatusColor(table.status)}>
                {table.status}
              </Badge>
            </TableCell>
            <TableCell className="max-w-32 truncate">{table.notes || "-"}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => onEdit(table)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => onDelete(table.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
