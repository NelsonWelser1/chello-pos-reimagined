
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Activity,
  Calendar
} from "lucide-react";

export function DashboardHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Activity className="w-7 h-7 text-white" />
          </div>
          Restaurant Analytics Dashboard
        </h1>
        <p className="text-slate-600 mt-2 text-lg">Real-time insights and performance metrics</p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" className="bg-white/80 backdrop-blur-sm">
          <Calendar className="w-4 h-4 mr-2" />
          Today
        </Button>
        <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
          <TrendingUp className="w-4 h-4 mr-2" />
          View Reports
        </Button>
      </div>
    </div>
  );
}
