
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, UserX, DollarSign } from "lucide-react";
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
        { title: "Total Staff", value: totalStaff, icon: Users, color: "text-blue-500" },
        { title: "Active Staff", value: activeStaff, icon: UserCheck, color: "text-green-500" },
        { title: "Inactive Staff", value: inactiveStaff, icon: UserX, color: "text-red-500" },
        { title: "Total Hourly Rate", value: `$${totalHourlyRate.toFixed(2)}`, icon: DollarSign, color: "text-yellow-500" }
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
                <Card key={stat.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                        <stat.icon className={`h-4 w-4 text-muted-foreground ${stat.color}`} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
