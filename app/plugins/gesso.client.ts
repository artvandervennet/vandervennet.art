// Gesso's components are custom elements that draw themselves in the browser. Their modules
// touch customElements and CSSStyleSheet as soon as they load, so they can't run on the server,
// and <art-gitflow> rearranges the list it wraps, so they mustn't run before Vue has hydrated
// the prerendered HTML. Loading them once hydration is done covers both.
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:suspense:resolve', () => {
    import('@vandervennet/gesso')
  })
})
