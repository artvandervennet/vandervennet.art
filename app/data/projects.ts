export interface Project {
  id: string
  title: string
  text: string[]
  /** One link per canvas: the whole card follows it. */
  href?: string
  tags: string[]
  credits?: string
}

export const projects: Project[] = [
  {
    id: 'artui',
    title: 'Artui',
    text: [
      'A React component library that complains when you build something inaccessible: as a TypeScript error where it can, as a runtime warning where it cannot.',
      'It comes with a shadcn-style CLI and an MCP server, so AI coding assistants know the components too. This was my bachelor’s thesis.',
    ],
    href: 'https://artui.vandervennet.art',
    tags: ['React', 'TypeScript', 'Accessibility'],
  },
  {
    id: 'odyfeed',
    title: 'Odyfeed',
    text: [
      'The Odyssey as a Twitter-style feed. Every character has their own Solid Pod, and posts travel over ActivityPub like on the fediverse.',
      'A hobby project, and my excuse to find out how decentralised protocols work.',
    ],
    href: 'https://odyfeed.vandervennet.art',
    tags: ['Solid', 'ActivityPub', 'Linked data'],
  },
  {
    id: 'rabot-pd',
    title: 'Rabot PD',
    text: [
      'A city game I made with friends, for fun. The criminals go around the school collecting weapons and bombs to get all the money out of the safe. The police have to find and capture them first.',
      'Built in the spring of 2025, with Vue and Ionic for the app and NestJS behind it.',
    ],
    href: 'https://github.com/artvandervennet/rabotpd-frontend',
    tags: ['Vue', 'Ionic', 'NestJS', 'TypeScript'],
    credits: 'With Jelle Fauconnier, Sander Bockstaele and Robin Leytens.',
  },
  {
    id: 'bobber',
    title: 'Bobber',
    text: [
      'An app for keeping track of how much alcohol you drink, with a social side: you can see how much your friends had, too.',
      'One codebase for the web and Android, built with Ionic, Vue and Capacitor.',
    ],
    href: 'https://github.com/artvandervennet/bobber',
    tags: ['Ionic', 'Vue', 'Capacitor'],
    credits: 'Kilian Leroy and I came up with the idea together.',
  },
  {
    id: 'dengue',
    title: 'Dengue early warning',
    text: [
      'A dashboard that visualises dengue data and shows where the trends are heading, so an outbreak can be stopped before it spreads further.',
      'I worked on both the front end and the back end.',
    ],
    tags: ['Dashboard', 'Front end', 'Back end'],
    credits: 'With Michiel Van de Velde, Robin Leytens, Jelle Fauconnier, Sander Bockstaele and Antje Meiresonne.',
  },
]
