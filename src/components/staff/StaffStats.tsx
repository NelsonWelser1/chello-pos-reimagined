
import { Card, CardContent } from "@/components/ui/card";
import { Users, UserCheck, Crown, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface StaffStatsProps {
  staff: any[];
  isLoading: boolean;
}

export function StaffStats({ staff, isLoading }: StaffStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-slate-200 shadow-lg">
            <CardContent className="p-6">
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const totalStaff = staff?.length || 0;
  const activeStaff = staff?.filter(s => s.is_active)?.length || 0;
  const adminCount = staff?.filter(s => s.role === 'Admin')?.length || 0;
  const averageRate = staff?.length > 0 
    ? staff.filter(s => s.hourly_rate).reduce((sum, s) => sum + (s.hourly_rate || 0), 0) / staff.filter(s => s.hourly_rate).length 
    : 0;

  const stats = [
    {
      title: "Total Staff",
      value: totalStaff,
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600"
    },
    {
      title: "Active Members",
      value: activeStaff,
      icon: UserCheck,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600"
    },
    {
      title: "Administrators",
      value: adminCount,
      icon: Crown,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600"
    },
    {
      title: "Avg. Hourly Rate",
      value: `$${averageRate.toFixed(2)}`,
      icon: Clock,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <CardContent className="p-6">
            <div className={`${stat.bgColor} rounded-2xl p-4 mb-4`}>
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <div className={`text-3xl font-black ${stat.textColor}`}>
                    {stat.value}
                  </div>
                </div>
              </div>
            </div>
            <h3 className="font-bold text-slate-700 text-lg">{stat.title}</h3>
            <p className="text-slate-500 text-sm mt-1">Current statistics</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
