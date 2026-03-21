/**
 * Server actions for authentication.
 * Handles sign in and sign out operations using provider registry.
 */

'use server';

import { APP_ROUTES } from '@/lib/routes';
import type { AuthResult } from '@/providers/domain/auth';
import { redirect } from 'next/navigation';

/**
 * Signs in a user with email and password using client provider.
 * This should be called from client components using useTransition.
 */
export async function signInAction(formData: FormData): Promise<AuthResult> {
  'use server';

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    // Note: Server actions should ideally trigger client-side auth
    // This is a placeholder for proper client-provider integration
    // In practice, this would call a client-side auth flow

    // For now, return error indicating client-side flow should be used
    return {
      success: false,
      error: 'Please use client-side authentication flow.',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Authentication failed',
    };
  }
}

/**
 * Signs out current user.
 * This should be called from client components using the auth provider.
 */
export async function signOutAction(): Promise<void> {
  'use server';

  // Server-side sign out logic would go here
  // For now, just redirect to login page
  redirect(APP_ROUTES.login);
}
