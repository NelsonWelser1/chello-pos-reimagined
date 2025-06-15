
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, Mail, Phone, MapPin, TrendingUp } from "lucide-react";
import type { Customer } from "@/hooks/useCustomers";

interface CustomerStatsProps {
  customers: Customer[];
}

export default function CustomerStats({ customers }: CustomerStatsProps) {
  const totalCustomers = customers.length;
  const customersWithEmail = customers.filter(customer => customer.email).length;
  const customersWithPhone = customers.filter(customer => customer.phone).length;
  const customersWithAddress = customers.filter(customer => customer.address?.city).length;
  
  const stats = [
    {
      title: "Total Customers",
      value: totalCustomers,
      icon: Users,
      description: "Active customers in system",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Email Contacts",
      value: customersWithEmail,
      icon: Mail,
      description: `${Math.round((customersWithEmail / totalCustomers) * 100) || 0}% have email`,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Phone Contacts",
      value: customersWithPhone,
      icon: Phone,
      description: `${Math.round((customersWithPhone / totalCustomers) * 100) || 0}% have phone`,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Complete Profiles",
      value: customersWithAddress,
      icon: MapPin,
      description: `${Math.round((customersWithAddress / totalCustomers) * 100) || 0}% with address`,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.color}`}>
              {stat.value}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
