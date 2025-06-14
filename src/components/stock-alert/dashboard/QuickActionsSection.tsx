
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, ShoppingCart, Clock } from "lucide-react";

export default function QuickActionsSection() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button className="h-16 bg-blue-600 hover:bg-blue-700 flex flex-col items-center gap-2">
            <Package className="w-6 h-6" />
            <span>Bulk Reorder</span>
          </Button>
          <Button className="h-16 bg-green-600 hover:bg-green-700 flex flex-col items-center gap-2">
            <ShoppingCart className="w-6 h-6" />
            <span>Generate Purchase Orders</span>
          </Button>
          <Button className="h-16 bg-purple-600 hover:bg-purple-700 flex flex-col items-center gap-2">
            <Clock className="w-6 h-6" />
            <span>Schedule Deliveries</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
