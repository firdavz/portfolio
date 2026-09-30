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
  cvUrl: "assets/cv/cv.pdf", // put your CV file at this path

  // Social icons. Leave a value as "" to hide that icon.
  socials: {
    github: "https://github.com/firdavz",
    linkedin: "https://www.linkedin.com/in/firdavs10/",
  },

  /* ---------- About ---------- */
  // Each string is one paragraph. Add or remove strings freely.
  about: [
    "I'm a second-year Finance student at the University of Greenwich who fell in love with fintech. I've always been fascinated by the big fintech products and how they turned banking, payments and investing into something people actually enjoy using. I believe fintech is where the future of money is being built, and I want to be one of the people building it.",
    "What drives me is where finance meets code: solving problems to build products that meet a real customer need. I taught myself to code from scratch, and since then I've built projects I'm proud of and won hackathons along the way, all while achieving top results in economics and finance and earning a university scholarship. Right now I'm building Joyla, a CRM for businesses in Central Asia that helps them manage their customers and gives AI-powered insights into what those customers need.",
    "In my spare time, you'll usually find me playing football, spending time with the people I love, or sitting somewhere beautiful for far longer than I planned.",
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
        video: "https://loom.com/share/1c318f1e1c1e4af2a60e91d9b3901b1c",
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
      description: "Joyla will help businesses manage their customers and use AI to show what those customers need. Currently in development.",
      tech: [], // TODO: add the tech stack, e.g. ["TypeScript", "Next.js", "PostgreSQL"]
      metrics: "", // e.g. a user count or other real result — "" to hide
      links: {
        github: "", // TODO: repo link, if it's public
        live: "", // TODO: website link
        video: "",
      },
      image: "", // e.g. "assets/images/project-screenshot.png"
      imageAlt: "",
    },
  ],

  /* ---------- Footer ---------- */
  footer: "Designed and built by Firdavs with plain HTML, CSS and JavaScript.",
};
