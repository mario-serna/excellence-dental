export const getRoleDisplayName = (
  role: string | null,
  t: (key: string, options?: { fallback?: string }) => string
): string => {
  if (!role) return t('unknown');

  return t(role, { fallback: role });
};

export const getAuthErrorMessage = (
  error: string,
  t: (key: string) => string
): string => {
  // Map common error messages to translations
  const errorMap: Record<string, string> = {
    'Invalid login credentials': t('invalidCredentials'),
    'Email not confirmed': t('emailNotConfirmed'),
    'User not found': t('userNotFound'),
  };

  return errorMap[error] || t('defaultError');
};
