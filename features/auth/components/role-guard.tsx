'use client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useTranslations } from 'next-intl';
import { useRole } from '../core/hooks/use-role';
import { USER_ROLES, type UserRole } from '../core/types/role.types';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
}

export function RoleGuard({
  children,
  allowedRoles,
  requireAll = false,
  fallback,
}: RoleGuardProps) {
  const { role, hasAccess } = useRole();
  const t = useTranslations('auth');

  if (!role) {
    return fallback || <div>{t('pleaseLogin')}</div>;
  }

  const hasPermission = requireAll
    ? allowedRoles.every((r) => hasAccess(r))
    : allowedRoles.some((r) => hasAccess(r));

  if (!hasPermission) {
    return (
      fallback || (
        <Alert variant="destructive">
          <AlertDescription>{t('noPermission')}</AlertDescription>
        </Alert>
      )
    );
  }

  return <>{children}</>;
}

// Convenience components
export function AdminGuard({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={[USER_ROLES.admin]} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

export function ClinicalGuard({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <RoleGuard
      allowedRoles={[USER_ROLES.doctor, USER_ROLES.assistant]}
      fallback={fallback}
    >
      {children}
    </RoleGuard>
  );
}
