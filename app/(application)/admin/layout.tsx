"use client";

import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { PERMISSION_TYPES } from '@/types';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="p-8 space-y-6">
    <ProtectedRoute requiredPermission={PERMISSION_TYPES.ADMINISTRATION}>
      {children}
    </ProtectedRoute>
    </div>
  );
}