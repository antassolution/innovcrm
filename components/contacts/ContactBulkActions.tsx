"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Trash2, Tags, Users } from "lucide-react";
import { ContactGroupDialog } from "./ContactGroupDialog";

interface ContactBulkActionsProps {
  selectedCount: number;
  onAction: (action: string) => void;
}

export function ContactBulkActions({
  selectedCount,
  onAction,
}: ContactBulkActionsProps) {
  const [showGroupDialog, setShowGroupDialog] = useState(false);

  return (
    <>
      <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
        <span className="text-sm text-muted-foreground">
          {selectedCount} contacts selected
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => onAction("export")}
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setShowGroupDialog(true)}
          >
            <Users className="h-4 w-4" />
            Add to Group
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => onAction("tags")}
          >
            <Tags className="h-4 w-4" />
            Manage Tags
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="gap-2"
            onClick={() => onAction("delete")}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <ContactGroupDialog
        open={showGroupDialog}
        onOpenChange={setShowGroupDialog}
        onSuccess={() => {
          setShowGroupDialog(false);
          onAction("refreshGroups");
        }}
      />
    </>
  );
}