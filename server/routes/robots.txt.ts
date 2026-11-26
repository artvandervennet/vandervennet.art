// Every page may be crawled, and the sitemap says which pages there are.
// On the live site Cloudflare puts its own managed rules (which AI crawlers to turn away) above these.
export default defineEventHandler((event) => {
  const sitemap = new URL('/sitemap.xml', useRuntimeConfig(event).public.siteUrl).href
  setResponseHeader(event, 'content-type', 'text/plain; charset=utf-8')
  return `User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`
})
