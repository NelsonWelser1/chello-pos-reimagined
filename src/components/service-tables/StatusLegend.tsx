
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StatusLegend() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Status Legend</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-sm">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-sm">Occupied</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span className="text-sm">Reserved</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-500 rounded"></div>
          <span className="text-sm">Cleaning</span>
        </div>
      </CardContent>
    </Card>
  );
}
