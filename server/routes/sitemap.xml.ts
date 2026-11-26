// The pages search engines should know about. The site is one page; add a path here when it gets another.
const pages = ['/']

export default defineEventHandler((event) => {
  const siteUrl = useRuntimeConfig(event).public.siteUrl
  const urls = pages.map((path) => `  <url><loc>${new URL(path, siteUrl).href}</loc></url>`)
  setResponseHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n')
})
