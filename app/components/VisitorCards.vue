<script setup lang="ts">
import type { Visitor } from '#shared/types/guestbook'

provideHeadingScope()

// Rendered on the server with the page (which is kept for a minute), then checked again in
// the browser so a card left a moment ago is there.
const { data: visitors, refresh } = await useFetch<Visitor[]>('/api/visitors', { default: () => [] })
onMounted(() => refresh())

const webid = ref('')
const sending = ref(false)
const error = ref('')
const done = ref('')

async function leaveCard() {
  if (sending.value) return
  error.value = ''
  done.value = ''
  sending.value = true
  try {
    const visitor = await $fetch<Visitor>('/api/visitors', { method: 'POST', body: { webid: webid.value } })
    done.value = `Thanks, ${visitor.name}. Your card is below.`
    webid.value = ''
    await refresh()
  }
  catch (problem) {
    error.value = (problem as { statusMessage?: string, data?: { statusMessage?: string } }).data?.statusMessage
      ?? 'That did not work. Check the address and try again.'
  }
  finally {
    sending.value = false
  }
}

const wall = ref<HTMLElement | null>(null)
useVcardPaint(wall)

// The card component brings the Solid client with it, which is most of this site's script.
// It is only fetched when there are cards to show and the guestbook is about to scroll into view.
onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting) || !visitors.value.length) return
    observer.disconnect()
    import('@kiliankil/solid-vcard-card')
  }, { rootMargin: '600px' })
  watch(wall, (element) => element && observer.observe(element), { immediate: true })
  watch(() => visitors.value.length, () => { if (wall.value) { observer.unobserve(wall.value); observer.observe(wall.value) } })
  onBeforeUnmount(() => observer.disconnect())
})
</script>

<template>
  <div class="guestbook-part">
    <SectionHeading>Leave your Solid card</SectionHeading>
    <p>
      Have a Solid pod? Leave your WebID and your card goes up below, read straight from your pod.
      I only keep the address, so what the card says stays yours to change.
    </p>

    <!-- A real form: without JavaScript it posts to the server, which sends you back here. -->
    <form class="guestbook-form" action="/api/visitors" method="post" @submit.prevent="leaveCard">
      <label for="webid">Your WebID</label>
      <div class="field-row">
        <input
          id="webid"
          v-model="webid"
          type="url"
          name="webid"
          required
          autocomplete="url"
          autocorrect="off"
          autocapitalize="none"
          spellcheck="false"
          enterkeyhint="send"
          placeholder="https://you.example/profile/card#me"
          :aria-describedby="error ? 'webid-error' : undefined"
          :aria-invalid="error ? 'true' : 'false'"
        >
        <!-- aria-disabled, not disabled: a disabled button drops the focus it had when pressed -->
        <art-button><button type="submit" :aria-disabled="sending ? 'true' : undefined">{{ sending ? 'Reading your profile…' : 'Leave my card' }}</button></art-button>
      </div>
      <!-- Both are always in the page, empty until there is something to say: a screen reader
           announces a live region whose text changes, not one that appears. -->
      <p id="webid-error" class="form-message" role="alert">{{ error }}</p>
      <p class="form-message" role="status">{{ done }}</p>
    </form>

    <ul v-if="visitors.length" ref="wall" class="card-grid card-wall">
      <li v-for="visitor in visitors" :key="visitor.webid">
        <!-- the link is what shows until the card has loaded, and all that shows without JavaScript -->
        <solid-vcard-card :profile="visitor.webid"><a :href="visitor.webid" rel="nofollow ugc">{{ visitor.name }}</a></solid-vcard-card>
      </li>
    </ul>
    <p v-else ref="wall" class="muted">No cards yet. Yours could be the first.</p>
  </div>
</template>
