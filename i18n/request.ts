import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;

  if (
    !requested ||
    !routing.locales.includes(
      requested as (typeof routing.locales)[number]
    )
  ) {
    notFound();
  }

  return {
    locale: requested,
    messages: (await import(`./messages/${requested}.json`)).default,
  };
});