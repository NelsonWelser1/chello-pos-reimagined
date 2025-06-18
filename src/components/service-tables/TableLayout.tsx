
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTables } from "@/hooks/useTables";
import { useTableSessions } from "@/hooks/useTableSessions";
import { FloorPlan } from "./FloorPlan";
import { StatusLegend } from "./StatusLegend";
import { TableDetailsCard } from "./TableDetailsCard";

export function TableLayout() {
  const { tables, loading: tablesLoading, updateTableStatus } = useTables();
  const { sessions, getActiveSessionForTable, startTableSession, endTableSession } = useTableSessions();
  const [selectedTable, setSelectedTable] = useState<any>(null);
  const [isAddingTable, setIsAddingTable] = useState(false);

  const handleTableClick = (table: any) => {
    const activeSession = getActiveSessionForTable(table.id);
    setSelectedTable({
      ...table,
      currentParty: activeSession ? {
        guests: activeSession.party_size,
        duration: Math.floor((new Date().getTime() - new Date(activeSession.started_at).getTime()) / (1000 * 60)),
        customerName: activeSession.customer_name || 'Unknown'
      } : null
    });
  };

  const handleStartSession = async () => {
    if (!selectedTable) return;

    const customerName = prompt("Enter customer name:");
    const partySizeStr = prompt("Enter party size:");
    
    if (!customerName || !partySizeStr) return;
    
    const partySize = parseInt(partySizeStr);
    if (isNaN(partySize) || partySize <= 0) return;

    await startTableSession({
      table_id: selectedTable.id,
      customer_name: customerName,
      party_size: partySize
    });
  };

  const handleEndSession = async () => {
    if (!selectedTable) return;
    
    const activeSession = getActiveSessionForTable(selectedTable.id);
    if (activeSession) {
      await endTableSession(activeSession.id);
    }
  };

  const handleStatusChange = async (status: any) => {
    if (!selectedTable) return;
    await updateTableStatus(selectedTable.id, status);
  };

  if (tablesLoading) {
    return (
      <div className="text-center py-12">
        <div className="text-xl text-slate-600">Loading tables...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Restaurant Floor Plan</h2>
        <Button onClick={() => setIsAddingTable(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Table
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Floor Layout</CardTitle>
            </CardHeader>
            <CardContent>
              <FloorPlan 
                tables={tables}
                onTableClick={handleTableClick}
                getActiveSessionForTable={getActiveSessionForTable}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <StatusLegend />

          {selectedTable && (
            <TableDetailsCard
              table={selectedTable}
              onStartSession={handleStartSession}
              onEndSession={handleEndSession}
              onStatusChange={handleStatusChange}
            />
          )}
        </div>
      </div>
    </div>
  );
}
