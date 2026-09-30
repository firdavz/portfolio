/*
 * Builds the page from window.PORTFOLIO (see data.js).
 * You shouldn't need to edit this file to change content.
 */
(function () {
  "use strict";

  var data = window.PORTFOLIO;
  if (!data) {
    console.error("data.js did not load: window.PORTFOLIO is missing.");
    return;
  }

  /* ---------- Small helpers ---------- */

  function hasValue(value) {
    if (Array.isArray(value)) return value.length > 0;
    return typeof value === "string" && value.trim() !== "";
  }

  // Create an element with an optional class and text (text is never parsed as HTML).
  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  // Only allow relative links and http(s)/mailto — blocks things like "javascript:".
  function safeUrl(url) {
    if (!hasValue(url)) return null;
    var trimmed = url.trim();
    var scheme = trimmed.match(/^([a-z][a-z0-9+.-]*):/i);
    if (!scheme) return trimmed;
    return /^(https?|mailto)$/i.test(scheme[1]) ? trimmed : null;
  }

  function isExternal(url) {
    return /^https?:\/\//i.test(url) && url.indexOf(window.location.origin) !== 0;
  }

  function srOnly(text) {
    return el("span", "sr-only", text);
  }

  function createLink(url, text, context) {
    var href = safeUrl(url);
    if (!href) return null;
    var a = el("a");
    a.href = href;
    a.append(text);
    if (context) a.append(srOnly(" for " + context));
    if (isExternal(href)) {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.append(srOnly(" (opens in a new tab)"));
    }
    return a;
  }

  var SVG_NS = "http://www.w3.org/2000/svg";

  // shape: { d, fill?: true } — stroke icons by default, fill when fill is true.
  function createIcon(icon) {
    var svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("viewBox", icon.viewBox || "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    icon.shapes.forEach(function (shape) {
      var path = document.createElementNS(SVG_NS, "path");
      path.setAttribute("d", shape.d);
      if (shape.fill) {
        path.setAttribute("fill", "currentColor");
      } else {
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", "currentColor");
        path.setAttribute("stroke-width", "1.8");
        path.setAttribute("stroke-linecap", "round");
        path.setAttribute("stroke-linejoin", "round");
      }
      svg.appendChild(path);
    });
    return svg;
  }

  /* ---------- Icons ---------- */

  var ICONS = {
    github: {
      viewBox: "0 0 16 16",
      shapes: [{
        fill: true,
        d: "M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"
      }]
    },
    linkedin: {
      shapes: [{
        fill: true,
        d: "M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45z"
      }]
    },
    email: {
      shapes: [
        { d: "M3.5 5.5h17a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1h-17a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1z" },
        { d: "m3 6.5 9 6.5 9-6.5" }
      ]
    },
    trophy: {
      shapes: [{ d: "M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3" }]
    },
    play: {
      shapes: [{ fill: true, d: "M7 4.5v15L19.5 12z" }]
    },
    close: {
      shapes: [{ d: "M6 6l12 12M18 6 6 18" }]
    }
  };

  var SOCIAL_LABELS = {
    github: "GitHub",
    linkedin: "LinkedIn",
    email: "Email"
  };

  // links.video isn't listed here: it becomes the "Watch demo" button instead.
  var HACKATHON_LINK_LABELS = { github: "GitHub", devpost: "Devpost", photos: "Photo album" };
  var PROJECT_LINK_LABELS = { github: "GitHub", live: "Live demo", video: "Video" };

  /* ---------- Shared card pieces ---------- */

  function buildMedia(item, fallbackAlt) {
    if (!hasValue(item.image)) return null;
    var wrap = el("div", "card-media");
    var img = el("img");
    img.src = item.image;
    img.alt = hasValue(item.imageAlt) ? item.imageAlt : fallbackAlt;
    img.loading = "lazy";
    img.decoding = "async";
    img.width = 360;
    img.height = 270;
    wrap.appendChild(img);
    return wrap;
  }

  function buildTags(tech) {
    if (!hasValue(tech)) return null;
    var list = el("ul", "tags");
    list.setAttribute("aria-label", "Technologies used");
    tech.forEach(function (name) {
      if (hasValue(name)) list.appendChild(el("li", null, name));
    });
    return list;
  }

  function buildLinks(links, labels, context) {
    if (!links) return null;
    var list = el("ul", "card-links");
    Object.keys(labels).forEach(function (key) {
      var a = createLink(links[key], labels[key], context);
      if (!a) return;
      var arrow = el("span", "link-arrow", "↗");
      arrow.setAttribute("aria-hidden", "true");
      a.appendChild(arrow);
      var li = el("li");
      li.appendChild(a);
      list.appendChild(li);
    });
    return list.children.length ? list : null;
  }

  function buildCard(media, bodyParts) {
    var li = el("li");
    var card = el("article", "card");
    if (media) {
      card.classList.add("has-media");
      card.appendChild(media);
    }
    var body = el("div", "card-body");
    bodyParts.forEach(function (part) {
      if (part) body.appendChild(part);
    });
    card.appendChild(body);
    li.appendChild(card);
    return li;
  }

  function textOrNull(tag, className, value) {
    return hasValue(value) ? el(tag, className, value) : null;
  }

  function fillList(listId, items, buildItem, emptyText) {
    var list = document.getElementById(listId);
    if (!list) return;
    if (!hasValue(items)) {
      list.appendChild(el("li", "empty-note", emptyText));
      return;
    }
    items.forEach(function (item) {
      list.appendChild(buildItem(item));
    });
  }

  /* ---------- Sections ---------- */

  function renderIntro() {
    var name = document.getElementById("intro-name");
    if (name && hasValue(data.name)) name.textContent = data.name;

    var headline = document.getElementById("intro-headline");
    if (headline) headline.textContent = data.headline || "";

    var tagline = document.getElementById("intro-tagline");
    if (tagline) tagline.textContent = data.tagline || "";

    var cv = document.getElementById("cv-link");
    if (cv) {
      var cvHref = safeUrl(data.cvUrl);
      if (cvHref) cv.href = cvHref;
      else cv.remove();
    }
  }

  function renderSocials() {
    var list = document.getElementById("socials");
    if (!list || !data.socials) return;
    Object.keys(SOCIAL_LABELS).forEach(function (key) {
      var href = safeUrl(data.socials[key]);
      if (!href) return;
      var a = el("a");
      a.href = href;
      a.setAttribute("aria-label", SOCIAL_LABELS[key]);
      a.title = SOCIAL_LABELS[key];
      if (isExternal(href)) {
        a.target = "_blank";
        a.rel = "noopener noreferrer";
      }
      a.appendChild(createIcon(ICONS[key]));
      var li = el("li");
      li.appendChild(a);
      list.appendChild(li);
    });
    if (!list.children.length) list.remove();
  }

  function renderAbout() {
    var container = document.getElementById("about-body");
    if (!container || !hasValue(data.about)) return;
    data.about.forEach(function (paragraph) {
      if (hasValue(paragraph)) container.appendChild(el("p", null, paragraph));
    });
  }

  function hackathonMeta(h) {
    return [h.organiser, h.date].filter(hasValue).join(" · ");
  }

  /* ---------- Hackathon photos & clips (pop-up gallery) ---------- */

  var VIDEO_FILE = /\.(mp4|webm|mov)([?#]|$)/i;
  var galleryDialog = null;

  // Only gallery entries with a usable src.
  function galleryItems(h) {
    if (!Array.isArray(h.gallery)) return [];
    return h.gallery.filter(function (item) {
      return item && safeUrl(item.src);
    });
  }

  function buildGalleryItem(item, context) {
    var src = safeUrl(item.src);
    var caption = hasValue(item.caption) ? item.caption : "";
    var figure = el("figure", "gallery-item");
    var media;
    if (VIDEO_FILE.test(src)) {
      media = el("video");
      media.src = src;
      media.controls = true;
      media.playsInline = true;
      media.preload = "metadata";
      media.setAttribute("aria-label", caption || "Clip from " + context);
    } else {
      media = el("img");
      media.src = src;
      media.alt = caption || "Photo from " + context;
      media.decoding = "async";
    }
    figure.appendChild(media);
    if (caption) figure.appendChild(el("figcaption", null, caption));
    return figure;
  }

  // One shared <dialog>, refilled each time a hackathon's gallery opens.
  function getGalleryDialog() {
    if (galleryDialog) return galleryDialog;
    galleryDialog = el("dialog", "gallery-dialog");
    galleryDialog.setAttribute("aria-labelledby", "gallery-title");
    // A click on the dimmed area around the panel closes it.
    galleryDialog.addEventListener("click", function (event) {
      if (event.target === galleryDialog) galleryDialog.close();
    });
    galleryDialog.addEventListener("close", function () {
      document.documentElement.classList.remove("modal-open");
      galleryDialog.textContent = ""; // removing the clips also stops them playing
    });
    document.body.appendChild(galleryDialog);
    return galleryDialog;
  }

  function openGallery(h, items) {
    var dialog = getGalleryDialog();

    var close = el("button", "gallery-close");
    close.type = "button";
    close.setAttribute("aria-label", "Close");
    close.appendChild(createIcon(ICONS.close));
    close.addEventListener("click", function () { dialog.close(); });

    var heading = el("div");
    var title = el("h2", "gallery-title", h.name);
    title.id = "gallery-title";
    heading.appendChild(title);
    var meta = textOrNull("p", "card-meta", hackathonMeta(h));
    if (meta) heading.appendChild(meta);

    var header = el("div", "gallery-header");
    header.appendChild(heading);
    header.appendChild(close);

    var grid = el("div", "gallery-grid");
    items.forEach(function (item) {
      grid.appendChild(buildGalleryItem(item, h.name));
    });

    var panel = el("div", "gallery-panel");
    panel.appendChild(header);
    panel.appendChild(grid);
    var links = buildHackathonLinks(h);
    if (links) panel.appendChild(links);

    dialog.textContent = "";
    dialog.appendChild(panel);
    document.documentElement.classList.add("modal-open");
    dialog.showModal();
  }

  function buildGalleryButton(h) {
    var items = galleryItems(h);
    if (!items.length || typeof HTMLDialogElement !== "function") return null;
    var button = el("button", "gallery-button");
    button.type = "button";
    var icon = el("span", "gallery-button-icon");
    icon.setAttribute("aria-hidden", "true");
    icon.appendChild(createIcon(ICONS.play));
    button.appendChild(icon);
    button.appendChild(document.createTextNode("Photos & clips"));
    button.appendChild(srOnly(" from " + h.name));
    button.addEventListener("click", function () { openGallery(h, items); });
    return button;
  }

  // "Watch demo" button that opens links.video; hidden while that link is empty.
  function buildDemoButton(h) {
    var a = createLink(h.links && h.links.video, "Watch demo", h.name);
    if (!a) return null;
    a.className = "button";
    var icon = createIcon(ICONS.play);
    icon.classList.add("button-icon");
    a.insertBefore(icon, a.firstChild);
    return a;
  }

  // The demo button leads the row of GitHub / Devpost links.
  function buildHackathonLinks(h) {
    var list = buildLinks(h.links, HACKATHON_LINK_LABELS, h.name) || el("ul", "card-links");
    var demo = buildDemoButton(h);
    if (demo) {
      var li = el("li");
      li.appendChild(demo);
      list.insertBefore(li, list.firstChild);
    }
    return list.children.length ? list : null;
  }

  function buildActions(h) {
    var button = buildGalleryButton(h);
    if (!button) return null;
    var row = el("div", "card-actions");
    row.appendChild(button);
    return row;
  }

  function buildHackathon(h) {
    var meta = hackathonMeta(h);

    var badge = null;
    if (hasValue(h.result)) {
      badge = el("p", "badge");
      badge.appendChild(createIcon(ICONS.trophy));
      badge.appendChild(document.createTextNode(h.result));
    }

    var role = null;
    if (hasValue(h.role)) {
      role = el("p", "card-role");
      role.appendChild(el("strong", null, "My role: "));
      role.appendChild(document.createTextNode(h.role));
    }

    return buildCard(buildMedia(h, "Photo from " + h.name), [
      el("h3", "card-title", h.name),
      textOrNull("p", "card-meta", meta),
      badge,
      textOrNull("p", "card-text", h.built),
      role,
      buildTags(h.tech),
      buildActions(h),
      buildHackathonLinks(h)
    ]);
  }

  function buildProject(p) {
    return buildCard(buildMedia(p, "Screenshot of " + p.title), [
      el("h3", "card-title", p.title),
      textOrNull("p", "card-summary", p.summary),
      textOrNull("p", "card-text", p.description),
      textOrNull("p", "metrics", p.metrics),
      buildTags(p.tech),
      buildLinks(p.links, PROJECT_LINK_LABELS, p.title)
    ]);
  }

  function renderFooter() {
    var footer = document.getElementById("footer-text");
    if (footer) footer.textContent = data.footer || "";
  }

  /* ---------- Active nav link on scroll ---------- */

  function setupScrollSpy() {
    var links = Array.prototype.slice.call(document.querySelectorAll("[data-nav]"));
    var sections = links
      .map(function (a) { return document.getElementById(a.getAttribute("data-nav")); })
      .filter(Boolean);
    if (!sections.length || !("IntersectionObserver" in window)) return;

    var inBand = {};
    var atEnd = false;

    function setActive(id) {
      links.forEach(function (a) {
        var active = a.getAttribute("data-nav") === id;
        a.classList.toggle("is-active", active);
        if (active) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
    }

    function update() {
      if (atEnd) return setActive(sections[sections.length - 1].id);
      for (var i = 0; i < sections.length; i++) {
        if (inBand[sections[i].id]) return setActive(sections[i].id);
      }
      // Between sections: keep whatever was active last.
    }

    // A thin horizontal band about a third of the way down the viewport.
    // Whichever section overlaps it is the "current" one.
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        inBand[entry.target.id] = entry.isIntersecting;
      });
      update();
    }, { rootMargin: "-35% 0px -60% 0px" });
    sections.forEach(function (s) { sectionObserver.observe(s); });

    // The last section may be too short to reach the band, so once the
    // footer is fully in view (bottom of the page), mark it active.
    var footer = document.getElementById("site-footer");
    if (footer) {
      new IntersectionObserver(function (entries) {
        atEnd = entries[0].isIntersecting && window.scrollY > 0;
        update();
      }, { threshold: 1 }).observe(footer);
    }
  }

  /* ---------- Soft light that follows the mouse ---------- */

  function setupCursorGlow() {
    // Mouse/trackpad only, and never for people who asked for reduced motion.
    if (!window.matchMedia) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var glow = el("div", "cursor-glow");
    glow.setAttribute("aria-hidden", "true");
    document.body.appendChild(glow);

    var x = 0, y = 0, targetX = 0, targetY = 0;
    var frame = null;
    var placed = false;

    // Ease towards the pointer; stop the loop once it has caught up.
    function tick() {
      x += (targetX - x) * 0.18;
      y += (targetY - y) * 0.18;
      glow.style.transform = "translate3d(" + x + "px, " + y + "px, 0)";
      var moving = Math.abs(targetX - x) > 0.5 || Math.abs(targetY - y) > 0.5;
      frame = moving ? window.requestAnimationFrame(tick) : null;
    }

    window.addEventListener("pointermove", function (event) {
      if (event.pointerType && event.pointerType !== "mouse") return;
      targetX = event.clientX;
      targetY = event.clientY;
      if (!placed) {
        x = targetX;
        y = targetY;
        placed = true;
      }
      glow.classList.add("is-visible");
      if (!frame) frame = window.requestAnimationFrame(tick);
    }, { passive: true });

    document.documentElement.addEventListener("mouseleave", function () {
      glow.classList.remove("is-visible");
    });
  }

  /* ---------- Go ---------- */

  renderIntro();
  renderSocials();
  renderAbout();
  fillList("hackathon-list", data.hackathons, buildHackathon, "Hackathons coming soon.");
  fillList("project-list", data.projects, buildProject, "Projects coming soon.");
  renderFooter();
  setupScrollSpy();
  setupCursorGlow();
})();
