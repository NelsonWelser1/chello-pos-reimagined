
import { Button } from "@/components/ui/button";
import { Eye, Activity, Zap, TrendingUp } from "lucide-react";

interface ExpenseChartControlsProps {
  activeChart: string;
  setActiveChart: (chart: string) => void;
}

export default function ExpenseChartControls({ activeChart, setActiveChart }: ExpenseChartControlsProps) {
  return (
    <div className="flex flex-wrap gap-2 p-4 bg-muted/50 rounded-lg">
      <Button
        variant={activeChart === "overview" ? "default" : "ghost"}
        size="sm"
        onClick={() => setActiveChart("overview")}
      >
        <Eye className="w-4 h-4 mr-2" />
        Overview
      </Button>
      <Button
        variant={activeChart === "trends" ? "default" : "ghost"}
        size="sm"
        onClick={() => setActiveChart("trends")}
      >
        <Activity className="w-4 h-4 mr-2" />
        Trends
      </Button>
      <Button
        variant={activeChart === "efficiency" ? "default" : "ghost"}
        size="sm"
        onClick={() => setActiveChart("efficiency")}
      >
        <Zap className="w-4 h-4 mr-2" />
        Efficiency
      </Button>
      <Button
        variant={activeChart === "forecasting" ? "default" : "ghost"}
        size="sm"
        onClick={() => setActiveChart("forecasting")}
      >
        <TrendingUp className="w-4 h-4 mr-2" />
        Forecasting
      </Button>
    </div>
  );
}
