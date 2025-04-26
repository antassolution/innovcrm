"use client";

import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { PERMISSION_TYPES } from '@/types';

export default function ContactsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requiredPermission={PERMISSION_TYPES.CONTACT_MANAGEMENT}>
      {children}
    </ProtectedRoute>
  );
}