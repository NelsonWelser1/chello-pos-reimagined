
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MoreHorizontal, Edit, Trash2, Users, Mail, Phone } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { Staff } from "@/hooks/useStaff";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface StaffTableProps {
  staff: Staff[];
  onEdit: (staffMember: Staff) => void;
  onDelete: (id: string) => void;
  highlightedId?: string | null;
}

export default function StaffTable({ staff, onEdit, onDelete, highlightedId }: StaffTableProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleColor = (role: string) => {
    const colors = {
      'Admin': 'bg-purple-100 text-purple-800 border-purple-200',
      'Manager': 'bg-blue-100 text-blue-800 border-blue-200',
      'Chef': 'bg-orange-100 text-orange-800 border-orange-200',
      'Waiter': 'bg-green-100 text-green-800 border-green-200',
      'Cashier': 'bg-indigo-100 text-indigo-800 border-indigo-200'
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (staff.length === 0) {
    return (
      <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
        <CardContent className="flex flex-col items-center justify-center py-20">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <Users className="w-10 h-10 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-800">No staff members yet</h3>
              <p className="text-slate-600 mt-2">Get started by adding your first team member</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 bg-transparent shadow-none">
      <CardContent className="p-0">
        <div className="overflow-hidden rounded-xl">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200/50 hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50">
                <TableHead className="font-semibold text-slate-700">Staff Member</TableHead>
                <TableHead className="font-semibold text-slate-700">Role</TableHead>
                <TableHead className="font-semibold text-slate-700">Contact</TableHead>
                <TableHead className="font-semibold text-slate-700">Status</TableHead>
                <TableHead className="font-semibold text-slate-700">Join Date</TableHead>
                <TableHead className="w-[50px]">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.map((staffMember, index) => (
                <TableRow 
                  key={staffMember.id} 
                  className={cn(
                    "border-b border-slate-100/50 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-300",
                    highlightedId === staffMember.id && "bg-gradient-to-r from-blue-100/80 to-indigo-100/80 shadow-md",
                    index % 2 === 0 ? "bg-white/40" : "bg-slate-50/40"
                  )}
                >
                  <TableCell className="py-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-11 h-11 shadow-md ring-2 ring-white">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold text-sm">
                          {getInitials(staffMember.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-slate-800">{staffMember.name}</div>
                        <div className="text-sm text-slate-500">ID: {staffMember.id.slice(0, 8)}...</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getRoleColor(staffMember.role)} border font-medium shadow-sm`}>
                      {staffMember.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    <div className="space-y-2">
                      {staffMember.email && (
                        <div className="flex items-center gap-2 text-slate-600">
                          <Mail className="w-3 h-3" />
                          <span className="truncate max-w-[200px]">{staffMember.email}</span>
                        </div>
                      )}
                      {staffMember.phone && (
                        <div className="flex items-center gap-2 text-slate-600">
                          <Phone className="w-3 h-3" />
                          <span>{staffMember.phone}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={staffMember.is_active ? 'default' : 'secondary'} 
                      className={cn(
                        "font-medium shadow-sm",
                        staffMember.is_active 
                          ? 'bg-green-100 text-green-700 border-green-200 hover:bg-green-100/80' 
                          : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-100/80'
                      )}
                    >
                      {staffMember.is_active ? '● Active' : '○ Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-slate-600 font-medium">
                    {format(new Date(staffMember.created_at), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          aria-haspopup="true" 
                          size="icon" 
                          variant="ghost"
                          className="hover:bg-blue-100/80 hover:text-blue-700 transition-colors"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-sm shadow-xl border-white/20">
                        <DropdownMenuItem 
                          onClick={() => onEdit(staffMember)}
                          className="hover:bg-blue-50 focus:bg-blue-50"
                        >
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => onDelete(staffMember.id)} 
                          className="text-red-600 hover:bg-red-50 focus:bg-red-50"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
