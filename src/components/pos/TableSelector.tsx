
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTables } from "@/hooks/useTables";
import { useTableSessions } from "@/hooks/useTableSessions";
import { Table, Users } from "lucide-react";

interface TableSelectorProps {
  selectedTableSession: string | null;
  onTableSessionSelect: (sessionId: string | null) => void;
}

export default function TableSelector({ selectedTableSession, onTableSessionSelect }: TableSelectorProps) {
  const { tables } = useTables();
  const { sessions, startTableSession } = useTableSessions();

  const handleTableSelect = async (tableId: string) => {
    if (!tableId || tableId === "none") {
      onTableSessionSelect(null);
      return;
    }

    // Check if there's an active session for this table
    const existingSession = sessions.find(
      s => s.table_id === tableId && s.status === 'active'
    );

    if (existingSession) {
      onTableSessionSelect(existingSession.id);
    } else {
      // Create a new session for this table
      const table = tables.find(t => t.id === tableId);
      if (table) {
        const newSession = await startTableSession({
          table_id: tableId,
          party_size: 2, // Default party size
          customer_name: `Table ${table.number}`,
        });
        
        if (newSession) {
          onTableSessionSelect(newSession.id);
        }
      }
    }
  };

  const getDisplayValue = () => {
    if (!selectedTableSession) return "";
    
    const session = sessions.find(s => s.id === selectedTableSession);
    if (!session) return "";
    
    const table = tables.find(t => t.id === session.table_id);
    return table ? `Table ${table.number} - ${session.customer_name || 'Customer'}` : "";
  };

  return (
    <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-bold">
          <Table className="w-5 h-5 text-blue-600" />
          Table Selection
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Select 
          value={selectedTableSession || "none"} 
          onValueChange={(value) => handleTableSelect(value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a table or takeout">
              {getDisplayValue() || "Select a table or takeout"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Takeout Order
              </div>
            </SelectItem>
            {tables
              .filter(table => table && table.id && table.number) // Filter out invalid tables
              .map((table) => {
                const activeSession = sessions.find(
                  s => s.table_id === table.id && s.status === 'active'
                );
                
                return (
                  <SelectItem key={table.id} value={table.id}>
                    <div className="flex items-center gap-2">
                      <Table className="w-4 h-4" />
                      <span>
                        Table {table.number} ({table.seats} seats)
                        {activeSession && ` - ${activeSession.customer_name}`}
                      </span>
                    </div>
                  </SelectItem>
                );
              })}
          </SelectContent>
        </Select>
        
        {selectedTableSession && (
          <div className="mt-3 p-2 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-800">
              {(() => {
                const session = sessions.find(s => s.id === selectedTableSession);
                const table = session ? tables.find(t => t.id === session.table_id) : null;
                return table ? 
                  `Selected: Table ${table.number} - ${session?.customer_name || 'Customer'}` :
                  'Takeout Order Selected';
              })()}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
