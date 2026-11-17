<script setup lang="ts">
import type { Mention, MentionType } from '#shared/types/guestbook'
import { site } from '~/data/site'

provideHeadingScope()

const { data: mentions, refresh } = await useFetch<Mention[]>('/api/mentions', { default: () => [] })
onMounted(() => refresh())

// Replies, bookmarks and plain mentions say something, so they are listed in full.
// Likes and reposts are a nod: they are gathered into one line of faces.
const said = computed(() => mentions.value.filter((mention) => !['like', 'repost'].includes(mention.type)))
const nods = computed(() => mentions.value.filter((mention) => ['like', 'repost'].includes(mention.type)))

const verbs: Record<MentionType, string> = {
  reply: 'replied',
  like: 'liked this',
  repost: 'reposted this',
  bookmark: 'bookmarked this',
  mention: 'mentioned this',
}

const formatDate = (value: string) => {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
const initial = (name: string) => name.trim().charAt(0).toUpperCase()

const source = ref('')
const sending = ref(false)
const error = ref('')
const done = ref('')

async function send() {
  if (sending.value) return
  error.value = ''
  done.value = ''
  sending.value = true
  try {
    // In production the target is the site's public address; while developing it is this page.
    const target = import.meta.dev ? `${location.origin}/` : `${site.url}/`
    await $fetch('/webmention', { method: 'POST', body: new URLSearchParams({ source: source.value, target }) })
    done.value = 'Got it. Your mention is below.'
    source.value = ''
    await refresh()
  }
  catch (problem) {
    error.value = (problem as { data?: { statusMessage?: string } }).data?.statusMessage
      ?? 'That did not work. Check the address and try again.'
  }
  finally {
    sending.value = false
  }
}
</script>

<template>
  <div class="guestbook-part">
    <SectionHeading>Webmentions</SectionHeading>
    <p>
      Wrote something that links to this page? If your site sends webmentions, it is probably here already.
      If it doesn’t, paste the address of your post and I’ll go and read it.
    </p>

    <form class="guestbook-form" action="/webmention" method="post" @submit.prevent="send">
      <!-- used when the form posts without JavaScript -->
      <input type="hidden" name="target" :value="`${site.url}/`">
      <label for="mention-source">Address of your post</label>
      <div class="field-row">
        <input
          id="mention-source"
          v-model="source"
          type="url"
          name="source"
          required
          autocorrect="off"
          autocapitalize="none"
          spellcheck="false"
          enterkeyhint="send"
          placeholder="https://your.site/a-post"
          :aria-describedby="error ? 'mention-error' : undefined"
          :aria-invalid="error ? 'true' : 'false'"
        >
        <!-- aria-disabled, not disabled: a disabled button drops the focus it had when pressed -->
        <art-button><button type="submit" :aria-disabled="sending ? 'true' : undefined">{{ sending ? 'Reading your post…' : 'Send webmention' }}</button></art-button>
      </div>
      <!-- always in the page, empty until there is something to say (see VisitorCards.vue) -->
      <p id="mention-error" class="form-message" role="alert">{{ error }}</p>
      <p class="form-message" role="status">{{ done }}</p>
    </form>

    <p v-if="nods.length" class="nods">
      <span class="faces" aria-hidden="true">
        <template v-for="nod in nods" :key="nod.source">
          <img v-if="nod.author.photo" :src="nod.author.photo" alt="" width="32" height="32" loading="lazy" referrerpolicy="no-referrer">
          <span v-else class="face">{{ initial(nod.author.name) }}</span>
        </template>
      </span>
      <span>
        <template v-for="(nod, i) in nods" :key="nod.source">
          <a :href="nod.source" rel="nofollow ugc">{{ nod.author.name }}</a> {{ verbs[nod.type] }}<template v-if="i < nods.length - 1">, </template>
        </template>.
      </span>
    </p>

    <ol v-if="said.length" class="mentions">
      <li v-for="mention in said" :key="mention.source">
        <img v-if="mention.author.photo" class="face" :src="mention.author.photo" alt="" width="48" height="48" loading="lazy" referrerpolicy="no-referrer">
        <span v-else class="face" aria-hidden="true">{{ initial(mention.author.name) }}</span>
        <div>
          <p class="who">
            <a v-if="mention.author.url" :href="mention.author.url" rel="nofollow ugc">{{ mention.author.name }}</a>
            <template v-else>{{ mention.author.name }}</template>
            {{ verbs[mention.type] }}
            <time v-if="formatDate(mention.published ?? mention.receivedAt)" :datetime="mention.published ?? mention.receivedAt">
              on {{ formatDate(mention.published ?? mention.receivedAt) }}
            </time>
          </p>
          <blockquote v-if="mention.content" :cite="mention.source">{{ mention.content }}</blockquote>
          <p class="where"><a :href="mention.source" rel="nofollow ugc">{{ mention.title ?? mention.source }}</a></p>
        </div>
      </li>
    </ol>
    <p v-else-if="!nods.length" class="muted">No mentions yet.</p>
  </div>
</template>
