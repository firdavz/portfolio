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
  headline: "Fintech Developer",
  tagline: "I understand the customer,\nthe money, and the code.", // \n = new line
  cvUrl: "assets/cv/cv.pdf", // put your CV file at this path

  // Social icons. Leave a value as "" to hide that icon.
  socials: {
    github: "https://github.com/firdavz",
    linkedin: "https://www.linkedin.com/in/firdavs10/",
    email: "mailto:olimjanovf2@gmail.com",
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
    // TODO: EXAMPLE ENTRY — replace every value with your real hackathon.
    {
      name: "First Running Hackathon",
      organiser: "TAG",
      date: "29/09/2026",
      result: "Best 4th project , 2nd by running distance", // highlighted badge; "" to hide
      built: "Lectra :  Live agent that helps students to turn their lecture speechs into visual  diagrams (using Marmeid).",
      tech: ["Python , Node.js , LLM , Marmeid , CSS , HTML"],
      links: {
        github: "https://github.com/Renanlvrt/No-excuse-to-not-go-to-lectures-anymore",
        devpost: "", // optional Devpost project page — empty, so it's hidden
        video: "", // YouTube / Loom link — empty, so it's hidden
      },
      image: "", // e.g. "assets/images/hackathon-team.jpg"
      imageAlt: "", // describe the photo, e.g. "Our team presenting on stage"
    },
  ],

  /* ---------- Projects ---------- */
  projects: [
    // TODO: EXAMPLE ENTRY — replace every value with your real project.
    {
      title: "TODO: Project title",
      summary: "TODO: One-line summary of the project.",
      description: "TODO: A few sentences on what it does, how you built it, and what you learned.",
      tech: ["TODO", "Tech", "Tags"],
      metrics: "", // e.g. a user count or other real result — "" to hide
      links: {
        github: "#TODO",
        live: "",
        video: "",
      },
      image: "", // e.g. "assets/images/project-screenshot.png"
      imageAlt: "",
    },
  ],

  /* ---------- Footer ---------- */
  footer: "Designed and built by Firdavs with plain HTML, CSS and JavaScript.",
};
