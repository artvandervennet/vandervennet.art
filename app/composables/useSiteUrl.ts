/**
 * The full public address of a path on this site, such as https://vandervennet.art/og.png.
 * The address comes from runtimeConfig.public.siteUrl (NUXT_PUBLIC_SITE_URL), and nowhere else.
 */
export function useSiteUrl(path = '/'): string {
  return new URL(path, useRuntimeConfig().public.siteUrl).href
}
