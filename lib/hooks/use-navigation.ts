'use client';
import { useRouter, usePathname } from 'next/navigation';

export const APP_ROUTES = {
  login: '/login',
  dashboard: '/dashboard',
  admin: '/admin',
  clinical: '/clinical',
} as const;

export function useNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  
  // Extract current locale from pathname
  const locale = pathname.split('/')[1] || 'en';
  
  const navigateTo = (path: string) => {
    router.push(`/${locale}${path}`);
  };

  const navigateToLogin = () => navigateTo(APP_ROUTES.login);
  const navigateToDashboard = () => navigateTo(APP_ROUTES.dashboard);
  const navigateToAdmin = () => navigateTo(APP_ROUTES.admin);
  const navigateToClinical = () => navigateTo(APP_ROUTES.clinical);

  return {
    navigateTo,
    navigateToLogin,
    navigateToDashboard,
    navigateToAdmin,
    navigateToClinical,
    currentLocale: locale,
  };
}
