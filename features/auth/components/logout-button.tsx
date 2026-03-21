/**
 * Logout button component.
 * Handles user sign out with proper routing.
 */

'use client';

import { APP_ROUTES } from '@/lib/routes';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/use-auth';

export function LogoutButton() {
  const auth = useAuth();
  const router = useRouter();

  return (
    <button
      onClick={async () => {
        await auth.signOut();
        router.push(APP_ROUTES.login);
      }}
    >
      Cerrar sesión
    </button>
  );
}
