"use client";

import { useState, useEffect } from "react";
import { User, AVAILABLE_PERMISSIONS } from "@/types";
import { userService } from "@/services/userService";
import { useToast } from "@/hooks/use-toast";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Checkbox,
} from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface UserPermissionDialogProps {
  open: boolean;
  user: User | null;
  onOpenChange: (open: boolean) => void;
  onPermissionsUpdated: () => void;
}

export function UserPermissionDialog({ 
  open, 
  user, 
  onOpenChange, 
  onPermissionsUpdated 
}: UserPermissionDialogProps) {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Reset form and load current permissions when dialog opens with a user
  useEffect(() => {
    if (user && open) {
      setSelectedPermissions(user.permissions || []);
    }
  }, [user, open]);

  const handlePermissionChange = (permission: string, checked: boolean) => {
    if (checked) {
      setSelectedPermissions(prev => [...prev, permission]);
    } else {
      setSelectedPermissions(prev => prev.filter(p => p !== permission));
    }
  };

  const handleSubmit = async () => {
    if (!user) return;

    try {
      setIsSubmitting(true);
      await userService.updateUser(user._id, {
        permissions: selectedPermissions,
      });
      
      toast({
        title: "Success",
        description: "User permissions updated successfully.",
      });
      
      onPermissionsUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update user permissions:", error);
      toast({
        title: "Error",
        description: "Failed to update user permissions.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Assign Permissions for {user?.firstName} {user?.lastName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            {AVAILABLE_PERMISSIONS.map((permission) => (
              <div key={permission} className="flex items-center space-x-2">
                <Checkbox
                  id={`permission-${permission}`}
                  checked={selectedPermissions.includes(permission)}
                  onCheckedChange={(checked) => 
                    handlePermissionChange(permission, checked === true)
                  }
                />
                <Label htmlFor={`permission-${permission}`}>{permission}</Label>
              </div>
            ))}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Permissions"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}