// Everything the page says lives in app/data. Text in [needed: …] brackets is a fact
// that still has to be filled in; it shows up as a taped label on the page.

export const site = {
  name: "Art Van der Vennet",
  firstName: "Art",
  lastName: "Van der Vennet",
  url: "https://vandervennet.art",
  title: "Art Van der Vennet, full-stack developer",
  description:
    "Art Van der Vennet is a full-stack developer from Belgium. He started coding at ten, teaches kids to code at CodeFever, and builds accessible software.",
  tagline:
    "Full-stack developer from Belgium. I started coding when I was ten, and since 2020 I teach kids to do the same.",
  email: "me@vandervennet.art",
  github: "https://github.com/artvandervennet",
  linkedin: "https://www.linkedin.com/in/art-van-der-vennet-8a9944267/",
  year: new Date().getFullYear(),
} as const;

export interface NavItem {
  id: string;
  label: string;
}

export const nav: NavItem[] = [
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "projects", label: "Projects" },
  { id: "interests", label: "Interests" },
  { id: "guestbook", label: "Guestbook" },
  { id: "contact", label: "Contact" },
];

export const about: string[] = [
  "I was about ten when I started at CodeFever. Every Saturday I went there to learn the basics of coding, and I never really stopped.",
  "In 2020 I moved to the other side of the classroom. I now teach there myself: kids from 7 to 16, who start with drag-and-drop blocks and end up making their own websites and games.",
  "After that came a bachelor in Electronics-ICT at Odisee, and after that NWN Software. I like building things from scratch, from the database to the deployment, and I tend to pick a different stack every time. Whether that is curiosity or a lack of discipline, I have not decided.",
  "I care about software that is easy to use and accessible, which is how my thesis ended up being about accessibility. I also like passing on what I know, which explains the teaching.",
];
