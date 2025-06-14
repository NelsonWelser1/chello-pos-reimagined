
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, Star, Award, Target } from "lucide-react";

const staffData = [
  {
    name: "Sarah Johnson",
    role: "Head Chef",
    ordersCompleted: 45,
    rating: 4.9,
    efficiency: 95,
    status: "online"
  },
  {
    name: "Mike Wilson",
    role: "Waiter",
    ordersCompleted: 32,
    rating: 4.7,
    efficiency: 88,
    status: "online"
  },
  {
    name: "Emma Davis",
    role: "Bartender",
    ordersCompleted: 28,
    rating: 4.8,
    efficiency: 92,
    status: "break"
  },
  {
    name: "John Smith",
    role: "Sous Chef",
    ordersCompleted: 38,
    rating: 4.6,
    efficiency: 85,
    status: "online"
  },
];

export function StaffPerformance() {
  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-indigo-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-600" />
          Staff Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {staffData.map((staff) => (
            <div key={staff.name} className="p-4 bg-white/70 rounded-lg border">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-slate-800">{staff.name}</h3>
                  <p className="text-sm text-slate-600">{staff.role}</p>
                </div>
                <Badge 
                  variant={staff.status === 'online' ? 'default' : 'secondary'}
                  className={staff.status === 'online' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                >
                  {staff.status}
                </Badge>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Orders Completed</span>
                  <div className="flex items-center gap-1">
                    <Target className="w-4 h-4 text-blue-600" />
                    <span className="font-bold">{staff.ordersCompleted}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Rating</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-bold">{staff.rating}</span>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Efficiency</span>
                    <span className="text-sm font-bold">{staff.efficiency}%</span>
                  </div>
                  <Progress value={staff.efficiency} className="h-2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
