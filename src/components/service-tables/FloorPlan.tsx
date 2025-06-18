
import { Table } from "@/hooks/useTables";
import { TableSession } from "@/hooks/useTableSessions";

interface FloorPlanProps {
  tables: Table[];
  onTableClick: (table: Table) => void;
  getActiveSessionForTable: (tableId: string) => TableSession | undefined;
}

export function FloorPlan({ tables, onTableClick, getActiveSessionForTable }: FloorPlanProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "bg-green-500";
      case "occupied": return "bg-red-500";
      case "reserved": return "bg-yellow-500";
      case "cleaning": return "bg-gray-500";
      default: return "bg-gray-400";
    }
  };

  const getShapeClass = (shape: string) => {
    switch (shape) {
      case "round": return "rounded-full";
      case "square": return "rounded-lg";
      case "rectangle": return "rounded-lg";
      default: return "rounded-lg";
    }
  };

  const getShapeSize = (shape: string, seats: number) => {
    const baseSize = Math.max(60, seats * 8);
    if (shape === "rectangle") {
      return { width: baseSize * 1.5, height: baseSize };
    }
    return { width: baseSize, height: baseSize };
  };

  return (
    <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-dashed border-slate-300 rounded-lg h-96 overflow-hidden">
      {tables.map((table) => {
        const size = getShapeSize(table.shape, table.seats);
        return (
          <div
            key={table.id}
            className={`absolute cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-lg ${getShapeClass(table.shape)} ${getStatusColor(table.status)} flex items-center justify-center text-white font-bold text-sm border-2 border-white shadow-md`}
            style={{
              left: table.position_x,
              top: table.position_y,
              width: size.width,
              height: size.height,
            }}
            onClick={() => onTableClick(table)}
          >
            <div className="text-center">
              <div>T{table.number}</div>
              <div className="text-xs">{table.seats} seats</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
