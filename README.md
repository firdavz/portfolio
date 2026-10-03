# Portfolio

My personal site. Plain HTML, CSS and vanilla JavaScript: no frameworks, no build step, no npm.

```
index.html          page structure + meta / Open Graph tags
styles.css          all styling; colours and fonts are CSS variables at the top
main.js             reads data.js and builds the page (you rarely need to touch it)
data.js             ALL the content: about, hackathons, projects, links
assets/images/      photos, screenshots, favicon.svg, og-image.png
assets/cv/          put cv.pdf here
```

Search `data.js` and `index.html` for **TODO** to find every placeholder.

## Run it locally

The site is static, so any local web server will do. You need [Python](https://www.python.org/downloads/) installed.

1. Open a terminal **inside this `portfolio` folder** (in VS Code: **Terminal → New Terminal**).
2. Start the server:

   ```bash
   py -m http.server 8000        # Windows
   python3 -m http.server 8000   # macOS / Linux
   ```

3. Open <http://localhost:8000> in your browser.
4. After editing `data.js` or any other file, save and refresh the page. If a change doesn't show up, press **Ctrl + F5** for a hard refresh.
5. To stop the server, click in the terminal and press **Ctrl + C**.

No Python? The **Live Server** extension in VS Code works too: right-click `index.html` and choose "Open with Live Server". Opening `index.html` directly (double-click) mostly works as well, but a server is closer to the real thing.

---

## Editing content

Everything you see on the page comes from `data.js`. Rules:

- Any link or image left as `""` is **not shown**. Leave `video: ""` if there's no video, for example.
- Newest items go **first** in each list.
- Text is inserted as plain text, so you can't put HTML tags in it (that keeps the page safe).

### Add a hackathon

1. Open `data.js` and find `hackathons: [`.
2. Copy one whole `{ ... },` block (from `{` to `},`).
3. Paste it at the top of the list and edit the values:

```js
{
  name: "Hackathon name",
  organiser: "Who ran it",
  date: "March 2026",
  result: "1st place · out of 40 teams",   // the highlighted badge; "" hides it
  built: "What your team built, in one or two sentences.",
  role: "What you personally did.",
  tech: ["Python", "FastAPI", "React"],
  links: {
    video: "https://youtu.be/...",          // YouTube or Loom link; shows a "Watch demo" button
    github: "https://github.com/you/repo",
    devpost: "https://devpost.com/software/your-project",
    photos: "https://www.icloud.com/sharedalbum/...", // shared album link; shows a "Photo album" link
  },
  image: "assets/images/hackathon-name.jpg", // "" for no photo
  imageAlt: "Our team presenting the demo on stage",
  gallery: [                                 // [] hides the "Photos & clips" button
    { src: "assets/images/hackathon-stage.jpg", caption: "Pitching to the judges" },
    { src: "assets/videos/hackathon-demo.mp4", caption: "30-second demo" },
  ],
},
```

`gallery` fills the pop-up that opens from the card's **Photos & clips** button. Each entry is a photo or a clip: files ending in `.mp4`, `.webm` or `.mov` play as videos, everything else shows as a picture. The caption is optional.

### Add a job (Experience)

Same steps, in the `experience: [` list. Newest job goes first:

```js
{
  dates: "2025 — Present",
  role: "Founder",
  company: "Company name",
  url: "https://company.com",               // makes the title a link; "" leaves it plain
  description: "What you did there, in one or two sentences.",
  tech: ["Python", "Excel"],                // tools you actually used in this job; [] hides the tags
},
```

### Add a project

Same steps, in the `projects: [` list:

```js
{
  title: "Project name",
  summary: "One line describing it.",
  description: "A few sentences: what it does, how you built it.",
  tech: ["TypeScript", "Supabase"],
  metrics: "120 users",                     // "" hides it
  links: {
    github: "https://github.com/you/repo",
    live: "https://your-demo.com",
    video: "",
  },
  image: "assets/images/project-name.png",
  imageAlt: "Dashboard screen showing the monthly budget chart",
},
```

### Other content

- **Name, headline, tagline**: top of `data.js`.
- **Social links**: `socials` in `data.js`. Email must start with `mailto:`, e.g. `mailto:me@example.com`. Set one to `""` to hide its icon.
- **About**: `about` in `data.js`. Each string is one paragraph.
- **Footer**: `footer` in `data.js`. In the About text and the footer, wrap words in `**double asterisks**` to highlight them in white.

## Images

- Put images in `assets/images/` and reference them as `"assets/images/filename.jpg"`.
- Thumbnails show at a 4:3 ratio (cropped to fit), so landscape images work best.
- Keep them small: about **800px wide** and under **200 KB**. Export as `.jpg` or `.webp` (squoosh.app is free).
- Always fill in `imageAlt` with a short description of what's in the picture.
- Demo videos in `links` are **links** (YouTube / Loom), not files in the repo.
- Hackathon gallery clips are the exception: short `.mp4` files in `assets/videos/`. Keep each one under about **10 MB** (a few seconds, 720p). `.mp4` plays in every browser; iPhone `.mov` files often don't play in Chrome, so convert them first.

## CV

Save your CV as **`assets/cv/cv.pdf`**. The "Download CV" button points there. Use a different filename by changing `cvUrl` in `data.js`.

## Colours and fonts

Edit the variables at the top of `styles.css`:

```css
--color-bg: #0b1024;      /* background (deep navy) */
--color-text: #eceafb;    /* main text */
--color-accent: #a78bfa;  /* violet accent */
```

If you change `--color-accent`, update `--color-accent-soft` to the same colour at 12% opacity.

Background effects have their own variables just below: `--glow-1` and `--glow-2` (corner glows), `--grid-dot` (dot grid), `--cursor-glow` (the light that follows the mouse) and `--color-accent-glow` (neon glow on the active nav line, CV button and section markers). Set any of them to `transparent` to switch that effect off.

## Deploy for free with GitHub Pages

1. Create a new repository on GitHub. Name it `YOUR-USERNAME.github.io` if you want the site at `https://YOUR-USERNAME.github.io/`. Any other name works too, and gives you `https://YOUR-USERNAME.github.io/REPO-NAME/`.
2. Push this folder to it. Run these commands **inside this `portfolio` folder**:

   ```bash
   git init
   git add .
   git commit -m "Portfolio site"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
   git push -u origin main
   ```

3. On GitHub, open the repo and go to **Settings → Pages**. Under "Build and deployment", set **Source: Deploy from a branch**, **Branch: main**, folder **/ (root)**, and click Save.
4. After a minute or two the site is live at the address shown on that page.

**After it's live**, open `index.html` and replace every `YOUR-SITE-URL` with your real address. That covers `canonical`, `og:url` and `og:image`. LinkedIn needs the full `og:image` URL to show the preview card. Check the result at <https://www.linkedin.com/post-inspector/>.

To update the site later: edit, then `git add . && git commit -m "Update" && git push`.

### Optional: replace the preview image

`assets/images/og-image.png` is a simple generated card with your name. Replace it with any **1200 × 630** PNG or JPG using the same filename.
