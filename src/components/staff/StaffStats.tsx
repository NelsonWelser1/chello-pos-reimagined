
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, UserX, DollarSign, TrendingUp } from "lucide-react";
import type { Staff } from "@/hooks/useStaff";

interface StaffStatsProps {
    staff: Staff[];
}

export default function StaffStats({ staff }: StaffStatsProps) {
    const totalStaff = staff.length;
    const activeStaff = staff.filter(s => s.is_active).length;
    const inactiveStaff = totalStaff - activeStaff;
    const totalHourlyRate = staff.reduce((acc, s) => acc + (Number(s.hourly_rate) || 0), 0);

    const stats = [
        { 
            title: "Total Staff", 
            value: totalStaff, 
            icon: Users, 
            gradient: "from-blue-500 to-cyan-500",
            bgGradient: "from-blue-50 to-cyan-50",
            change: "+2 this month"
        },
        { 
            title: "Active Staff", 
            value: activeStaff, 
            icon: UserCheck, 
            gradient: "from-green-500 to-emerald-500",
            bgGradient: "from-green-50 to-emerald-50",
            change: `${Math.round((activeStaff/totalStaff)*100)}% active rate`
        },
        { 
            title: "Inactive Staff", 
            value: inactiveStaff, 
            icon: UserX, 
            gradient: "from-red-500 to-rose-500",
            bgGradient: "from-red-50 to-rose-50",
            change: inactiveStaff === 0 ? "All active!" : "Review needed"
        },
        { 
            title: "Total Hourly Rate", 
            value: `$${totalHourlyRate.toFixed(2)}`, 
            icon: DollarSign, 
            gradient: "from-amber-500 to-orange-500",
            bgGradient: "from-amber-50 to-orange-50",
            change: "Per hour cost"
        }
    ];

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
                <Card key={stat.title} className={`relative overflow-hidden bg-gradient-to-br ${stat.bgGradient} border-0 shadow-lg hover:shadow-xl transition-all duration-300 group`}>
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm" />
                    <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
                        <div>
                            <CardTitle className="text-sm font-medium text-slate-700">{stat.title}</CardTitle>
                            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                {stat.change}
                            </div>
                        </div>
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.gradient} shadow-md group-hover:scale-110 transition-transform duration-200`}>
                            <stat.icon className="h-4 w-4 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent className="relative">
                        <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
                    </CardContent>
                    
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/20 to-transparent rounded-full -translate-y-10 translate-x-10" />
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-white/10 to-transparent rounded-full translate-y-8 -translate-x-8" />
                </Card>
            ))}
        </div>
    );
}
