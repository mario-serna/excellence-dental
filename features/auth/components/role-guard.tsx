'use client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { USER_ROLES, type UserRole } from '@/providers/domain/auth';
import { useTranslations } from 'next-intl';
import { useAuth } from '../hooks/use-auth';

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
  const { user } = useAuth();
  const t = useTranslations('auth');

  if (!user) {
    return fallback || <div>{t('pleaseLogin')}</div>;
  }

  const hasPermission = requireAll
    ? allowedRoles.every((r) => user.role === r)
    : allowedRoles.some((r) => user.role === r);

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
