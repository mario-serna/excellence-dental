import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export default getRequestConfig(async ({ locale }) => {
  // If locale is not provided by next-intl, try to get it from cookies
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value;

  const finalLocale = locale || cookieLocale || 'en';

  return {
    locale: finalLocale,
    messages: (await import(`./locales/${finalLocale}/common.json`)).default,
  };
});
