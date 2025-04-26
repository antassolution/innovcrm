"use client";

import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { PERMISSION_TYPES } from '@/types';

export default function LeadsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requiredPermission={PERMISSION_TYPES.LEAD_MANAGEMENT}>
      {children}
    </ProtectedRoute>
  );
}