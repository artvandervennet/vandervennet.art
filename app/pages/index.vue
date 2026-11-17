<script setup lang="ts">
// The whole site is this one page: a sticky header, a deep-paint hero, a painted section per topic, and the footer with the contact links.
</script>

<template>
  <div class="page">
    <a class="skip-link" href="#main">Skip to content</a>
    <SiteHeader />

    <main id="main" tabindex="-1">
      <SiteHero />

      <PageSection id="about" title="How I got here" paint="1">
        <AboutStory />
      </PageSection>

      <PageSection
        id="work"
        title="What I’ve done so far"
        intro="My timeline as a git graph, newest first."
        paint="2"
      >
        <WorkTimeline />
      </PageSection>

      <PageSection
        id="projects"
        title="Things I’ve built"
        intro="A few projects I’m happy to put my name on."
        paint="3"
      >
        <ProjectGrid />
      </PageSection>

      <PageSection id="interests" title="What keeps me curious" paint="4">
        <InterestCards />
      </PageSection>

      <PageSection
        id="guestbook"
        title="Leave a mark"
        intro="Two ways to say you were here. Both run on open standards and neither needs an account with me."
        paint="5"
      >
        <div class="guestbook">
          <VisitorCards />
          <WebMentions />
        </div>
      </PageSection>
    </main>

    <SiteFooter />
  </div>
</template>
