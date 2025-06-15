
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MoreHorizontal, Edit, Trash2, Users } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { Staff } from "@/hooks/useStaff";
import { format } from "date-fns";

interface StaffTableProps {
  staff: Staff[];
  onEdit: (staffMember: Staff) => void;
  onDelete: (id: string) => void;
}

export default function StaffTable({ staff, onEdit, onDelete }: StaffTableProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (staff.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">No staff members yet</h3>
              <p className="text-muted-foreground">Get started by adding your first staff member</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Staff Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead className="w-[50px]">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.map((staffMember) => (
                <TableRow key={staffMember.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                        <Avatar className="w-9 h-9">
                            <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
                                {getInitials(staffMember.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="font-medium">{staffMember.name}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{staffMember.role}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    <div>{staffMember.email}</div>
                    <div>{staffMember.phone}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={staffMember.is_active ? 'default' : 'secondary'} className={staffMember.is_active ? 'bg-green-100 text-green-800 hover:bg-green-100/80' : 'bg-gray-100 text-gray-800 hover:bg-gray-100/80'}>
                      {staffMember.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(staffMember.created_at), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(staffMember)}>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(staffMember.id)} className="text-red-600">
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
