"use client";

import { useState } from "react";
import { User } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Power, Shield, Key } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { userService } from "@/services/userService";
import { useToast } from "@/hooks/use-toast";
import { UserPermissionDialog } from "./UserPermissionDialog";
import { UserPasswordDialog } from "./UserPasswordDialog";

interface UserListProps {
  users: User[];
  loading: boolean;
  onRefresh: () => void;
}

const roleColors: Record<string, "default" | "destructive" | "secondary" | "outline"> = {
  'admin': 'destructive',
  'manager': 'secondary',
  'rep': 'default',
  'sales-mgr': 'secondary',
  'sales-rep': 'default',
  'user': 'default',
};

export function UserList({ users, loading, onRefresh }: UserListProps) {
  const { toast } = useToast();
  const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleToggleStatus = async (id: string) => {
    try {
      await userService.toggleUserStatus(id);
      toast({
        title: "Success",
        description: "User status updated successfully.",
      });
      onRefresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleOpenPermissionsDialog = (user: User) => {
    setSelectedUser(user);
    setPermissionsDialogOpen(true);
  };

  const handleOpenPasswordDialog = (user: User) => {
    setSelectedUser(user);
    setPasswordDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading users...</div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">No users found</div>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Permissions</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id}>
              <TableCell className="font-medium">{user.firstName} {user.lastName}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge variant={roleColors[user.role]}>
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell>
                {user.permissions && user.permissions.length > 0 ? (
                  <span className="text-xs text-muted-foreground">
                    {user.permissions.join(', ')}
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground italic">No permissions</span>
                )}
              </TableCell>
              <TableCell>
                <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                  {user.status}
                </Badge>
              </TableCell>
              <TableCell>
                {format(new Date(user.createdAt), "MMM d, yyyy")}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Set Password"
                    onClick={() => handleOpenPasswordDialog(user)}
                  >
                    <Key className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Assign Permissions"
                    onClick={() => handleOpenPermissionsDialog(user)}
                  >
                    <Shield className="h-4 w-4" />
                  </Button>
                  <Link href={`/admin/users/${user._id}`}>
                    <Button variant="ghost" size="icon" title="View Details">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    title={user.status === 'active' ? 'Disable User' : 'Enable User'}
                    onClick={() => handleToggleStatus(user._id)}
                  >
                    <Power className={`h-4 w-4 ${user.status === 'active' ? 'text-red-600' : 'text-green-600'}`} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <UserPermissionDialog
        open={permissionsDialogOpen}
        user={selectedUser}
        onOpenChange={setPermissionsDialogOpen}
        onPermissionsUpdated={onRefresh}
      />
      
      <UserPasswordDialog
        open={passwordDialogOpen}
        user={selectedUser}
        onOpenChange={setPasswordDialogOpen}
        onPasswordUpdated={onRefresh}
      />
    </>
  );
}