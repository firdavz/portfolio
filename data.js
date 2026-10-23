/*
 * ============================================================
 *  ALL SITE CONTENT LIVES HERE.
 *  main.js reads this object and builds the page from it.
 *
 *  Rules:
 *  - Any link or image left as "" (empty string) is NOT shown.
 *  - To add a hackathon or project: copy one whole { ... } block
 *    in the list below, paste it, and edit the values.
 *  - Newest items should go FIRST in each list.
 *  - Images go in assets/images/ — write the path like
 *    "assets/images/my-photo.jpg".
 *
 *  Search this file for "TODO" to find every placeholder.
 * ============================================================
 */

window.PORTFOLIO = {
  /* ---------- Left column / header ---------- */
  name: "Firdavs Olimjanov",
  headline: "Junior Fintech Developer",
  tagline: "I understand the customer,\nthe money, and the code.", // \n = new line
  cvUrl: "", // hidden for now — set back to "assets/cv/cv.pdf" to show the Download CV button

  // Social icons. Leave a value as "" to hide that icon.
  socials: {
    github: "https://github.com/firdavz",
    linkedin: "https://www.linkedin.com/in/firdavs10/",
  },

  /* ---------- About ---------- */
  // Each string is one paragraph. Add or remove strings freely.
  // Wrap words in **double asterisks** to highlight them in white.
  about: [
    "I'm a second-year Finance student at the University of Greenwich who is passionate about fintech. I've always been fascinated by the big fintech products and how they turned banking, payments and investing into something people actually enjoy using. I believe fintech is where the future of money is being built, and I want to be one of the people building it.",
    "I'm the Co-Founder of **NoBrand Education**, an English learning centre in Uzbekistan that we grew to 600+ students in 8 months, mainly through Instagram and social media marketing. Currently I'm building **Joyla**, an AI-powered CRM that gives businesses feedback on their customers, helps them analyze problems and opportunities, and offers advice for areas like marketing and accounting.",
    "In my spare time, you'll usually find me playing football, spending time with the people I love, or sitting somewhere beautiful for far longer than I planned.",
  ],

  /* ---------- Experience ---------- */
  // Newest first. "url" turns the title into a link; "" leaves it plain.
  experience: [
    {
      dates: "Nov 2025 — Present",
      role: "Co-Founder",
      company: "NoBrand Education",
      url: "https://nobrandedu.uz/",
      description: "Co-founded an English learning centre in Uzbekistan and grew it to 600+ students in 8 months, mainly through Instagram and social media marketing.",
      tech: [],
    },
    {
      dates: "Jun 2024 — Aug 2025",
      role: "Amazon Dispatcher",
      company: "SDS",
      url: "",
      description: "Generated $100K+ in weekly revenue by matching drivers with high-quality loads. Managed load assignments and tracked drivers in real time on Amazon Relay. Built KPI dashboards and financial trackers in Excel, and analysed data to optimise costs and improve dispatch efficiency.",
      tech: ["Amazon Relay", "Excel", "DAT", "ELD"],
    },
  ],

  /* ---------- Hackathons ---------- */
  hackathons: [
    {
      name: "First Running Hackathon",
      organiser: "TAG",
      date: "29/09/2026",
      result: "Best 4th project , 2nd by running distance", // highlighted badge; "" to hide
      built: "Lectra: an AI agent that listens to a lecture and turns it into an interactive mind-map in real time. ElevenLabs Scribe transcribes the speech live, Google Gemini picks out the key concepts, and Cytoscape.js draws them as a visual diagram.",
      tech: ["Python", "JavaScript", "CSS", "HTML"],
      links: {
        video: "https://www.loom.com/share/1989f4ce5ee14f45b426835adbdb85a3",
        github: "https://github.com/firdavz/lectra",
        devpost: "", // optional Devpost project page — empty, so it's hidden
        photos: "", // optional link to a shared photo album (iCloud / Google Photos)
      },
      image: "", // e.g. "assets/images/hackathon-team.jpg"
      imageAlt: "", // describe the photo, e.g. "Our team presenting on stage"
      // Photos & short clips shown in a pop-up by the "Photos & clips" button.
      // Leave the list empty [] to hide the button. Clips should be short .mp4 files.
      gallery: [
        { src: "assets/images/running-hackathon-2.jpg" },
        { src: "assets/images/running-hackathon-3.jpg" },
        { src: "assets/images/running-hackathon-4.jpg" },
      ],
    },
    {
      name: "Grok Bot Community Engineering Hackathon",
      organiser: "Cursor · Hackradar · The Hack Collective",
      date: "22/10/2026",
      result: "", // no placement, so the badge is hidden
      built: "Commons: personal AI agents that introduce community members to each other. Each member's agent talks to the others, finds common ground and proposes an introduction, and nothing happens until both people approve. Built in one evening (6–11 PM) at Expedite London HQ for Track 2, Know Your Members, with live per-agent calls to Grok and a network view of the agents talking.",
      tech: ["Next.js", "React", "TypeScript", "React Flow"],
      links: {
        video: "assets/videos/commons-film.mp4", // stored in the site, so it plays in a pop-up
        github: "https://github.com/Adkid-Zephyr/commons-a2a",
        live: "https://commons-a2a-london.laufs0310.chatgpt.site/", // optional live site — empty to hide
        devpost: "",
        photos: "",
      },
      image: "",
      imageAlt: "",
      gallery: [],
    },
    {
      name: "Ylookup Hackathon",
      organiser: "ylookup.ai",
      date: "", // TODO: add the date, e.g. "06/09/2026"
      result: "Top 5 project", // highlighted badge; "" to hide
      built: "A tool for fund administrators that turns bank statement PDFs into journal entries. It matches every transaction, flags mistakes, and sends unsure rows to a human review queue.",
      tech: ["Python", "TypeScript", "HTML", "CSS"],
      links: {
        video: "", // TODO: demo video link (YouTube or Loom) — adds a "Watch demo" button next to GitHub
        github: "https://github.com/firdavz/ylookup-hackathon",
        devpost: "",
        photos: "",
      },
      image: "",
      imageAlt: "",
      gallery: [],
    },
  ],

  /* ---------- Projects ---------- */
  projects: [
    {
      title: "Joyla",
      summary: "An AI-powered CRM for businesses.",
      stage: "Stealth", // shown as a badge — "" to hide
      description: "Joyla gives businesses AI-powered feedback on their customers, helps them analyze problems and opportunities, and offers advice for areas like marketing and accounting.",
      tech: [], // TODO: add the tech stack, e.g. ["TypeScript", "Next.js", "PostgreSQL"]
      metrics: "", // e.g. a user count or other real result — "" to hide
      links: {
        github: "", // left empty on purpose while in stealth
        live: "", // TODO: website link
        video: "",
      },
      image: "", // e.g. "assets/images/project-screenshot.png"
      imageAlt: "",
    },
  ],

  /* ---------- Footer ---------- */
  // Wrap words in **double asterisks** to highlight them in white.
  footer: "Designed & built by Firdavs Olimjanov",
};
