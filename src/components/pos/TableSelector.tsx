
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, MapPin } from "lucide-react";
import { useTables } from "@/hooks/useTables";
import { useTableSessions } from "@/hooks/useTableSessions";

interface TableSelectorProps {
  selectedTableSession: string | null;
  onTableSessionSelect: (sessionId: string | null) => void;
}

export default function TableSelector({ selectedTableSession, onTableSessionSelect }: TableSelectorProps) {
  const { tables } = useTables();
  const { sessions, getActiveSessionForTable } = useTableSessions();

  const availableTables = tables.filter(table => 
    table.status === 'available' || table.status === 'occupied'
  );

  const getTableSessionInfo = (tableId: string) => {
    return getActiveSessionForTable(tableId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Table Selection
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Select
            value={selectedTableSession || ''}
            onValueChange={(value) => onTableSessionSelect(value || null)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select table or takeout" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Takeout / Counter</SelectItem>
              {availableTables.map((table) => {
                const session = getTableSessionInfo(table.id);
                return (
                  <SelectItem 
                    key={table.id} 
                    value={session?.id || `table-${table.id}`}
                    disabled={table.status !== 'occupied' && !session}
                  >
                    Table {table.number} - {table.seats} seats
                    {session && ` (${session.customer_name || 'Occupied'})`}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          {selectedTableSession && (
            <div className="p-3 bg-blue-50 rounded-lg">
              {(() => {
                const session = sessions.find(s => s.id === selectedTableSession);
                if (session && session.table) {
                  return (
                    <div className="space-y-2">
                      <div className="font-semibold">
                        Table {session.table.number}
                      </div>
                      <div className="text-sm text-gray-600">
                        <div>Customer: {session.customer_name || 'Unknown'}</div>
                        <div>Party Size: {session.party_size}</div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {session.table.seats} seats
                        </div>
                      </div>
                    </div>
                  );
                }
                return (
                  <div className="text-sm text-gray-600">
                    Takeout / Counter Order
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
