import type { InjectionKey } from 'vue'

// Heading levels follow the nesting of sections, the way the HTML headingoffset attribute
// works: a component that opens a new level calls provideHeadingScope(), and <SectionHeading>
// renders whatever level it finds itself at. Nobody writes h2 or h3 by hand.
//
// headingoffset itself ships in Firefox 162 and is still in development in Chrome. When both
// have it, this file and SectionHeading.vue are the only two that change.

const HEADING_LEVEL: InjectionKey<number> = Symbol('heading-level')
const DEEPEST = 6

/** The heading level at this point in the tree. The page title is level 1. */
export function useHeadingLevel(): number {
  return inject(HEADING_LEVEL, 1)
}

/** Open a new level for everything below this component, and return it. */
export function provideHeadingScope(): number {
  const level = Math.min(useHeadingLevel() + 1, DEEPEST)
  provide(HEADING_LEVEL, level)
  return level
}
