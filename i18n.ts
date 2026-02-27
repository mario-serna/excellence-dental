import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ locale }) => {
  return {
    locale: locale || "es",
    messages: (await import(`./locales/${locale || "es"}/common.json`)).default,
  };
});
