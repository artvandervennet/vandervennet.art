export interface TimelineEntry {
  when: string
  /** Machine-readable date for <time datetime>, when there is one. */
  datetime?: string
  title: string
  text: string[]
  /** Branch name, shown as text beside the date. Defaults to main. */
  branch?: string
  /** Colour of the branch, set on its first entry. */
  pigment?: 'brand' | 'partner' | 'complement' | 'neutral-500'
  /** The branch is still running and never merges back. */
  open?: boolean
  /** The commit you are at now. */
  current?: boolean
  link?: { href: string, label: string }
}

// Oldest first: add new entries at the end. The page shows them newest first.
// A branch forks at its first entry and merges back after its last, unless it is open.
export const timeline: TimelineEntry[] = [
  {
    when: 'Age 10',
    title: 'First lessons at CodeFever',
    text: ['Every Saturday, learning the basics of coding.'],
  },
  {
    when: '2020 – now',
    datetime: '2020',
    title: 'Programming teacher at CodeFever',
    text: ['I teach kids from 7 to 16. They start with blocks and work their way up to websites and games.'],
    branch: 'codefever',
    pigment: 'complement',
    open: true,
  },
  {
    when: '2022',
    datetime: '2022',
    title: 'Ypto hackathon',
    text: ['Special encouragement prize. I was 16, and we still delivered a decent product.'],
    link: { href: 'https://www.ypto.be/hackathon', label: 'Ypto hackathon' },
  },
  {
    when: '2023',
    datetime: '2023',
    title: 'Electricity-Electronics at Edugo Glorieux',
    text: ['Secondary school, with an internship at Fixsus programming and installing custom home automation.'],
  },
  {
    when: '2023',
    datetime: '2023',
    title: 'Started Electronics-ICT at Odisee',
    text: ['A professional bachelor, in software and web development.'],
    branch: 'odisee',
    pigment: 'partner',
  },
  {
    when: '2024',
    datetime: '2024',
    title: 'Vlaamse Programmeerwedstrijd',
    text: ['Fourth place, with an incomplete team.'],
    branch: 'odisee',
    link: { href: 'https://www.vlaamseprogrammeerwedstrijd.be/2024/', label: 'Vlaamse Programmeerwedstrijd 2024' },
  },
  {
    when: 'Sep 2025 – Mar 2026',
    datetime: '2025-09',
    title: 'Dengue early warning',
    text: ['A dashboard that visualises dengue data and shows where the trends are heading, so an outbreak can be stopped before it spreads further. I worked on the front end and the back end, in a team of six.'],
    branch: 'odisee',
  },
  {
    when: 'Feb – Apr 2026',
    datetime: '2026-02',
    title: 'Internship at In The Pocket',
    text: ['Ten weeks as a front-end app developer, working with React Native and complex hardware on a project for Daikin.'],
    branch: 'odisee',
  },
  {
    when: '2026',
    datetime: '2026',
    title: 'Bachelor’s thesis',
    text: ['Enforcing and automating web accessibility through a React component library. That library became Artui.'],
    branch: 'odisee',
  },
  {
    when: '2026',
    datetime: '2026',
    title: 'Two hackathons at Odisee',
    text: [
      'The GitLab Duo AI hackathon, where we set up AI workflows on GitLab Duo.',
      'The UX hackathon for care, where we went through a whole UX process and ended with a solution for the stress that staff shortages cause in residential care centres.',
    ],
    branch: 'odisee',
  },
  {
    when: '2026',
    datetime: '2026',
    title: 'Graduated magna cum laude',
    text: ['Bachelor in Electronics-ICT.'],
    branch: 'odisee',
  },
  {
    when: '2026 – now',
    datetime: '2026',
    title: 'NWN Software',
    text: ['Full-stack developer. I work on Bouwflow, an ERP for construction companies.'],
    current: true,
  },
]
