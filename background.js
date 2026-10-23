/*
 * Animated background: a slow 3D vortex of light with fintech icons (cards,
 * coins, charts, banks…) in orbit, sending "payments" into a glowing core.
 * Plain canvas, no libraries, no video. Colours are the --scene-* variables
 * in styles.css. People who ask for reduced motion get one still frame.
 */
(function () {
  "use strict";

  if (typeof Path2D === "undefined") return;

  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");
  if (!ctx) return;
  canvas.className = "bg-canvas";
  canvas.setAttribute("aria-hidden", "true");
  document.body.insertBefore(canvas, document.body.firstChild);

  var TAU = Math.PI * 2;
  var reduceMotion = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  /* ---------- Colours ---------- */

  function cssColor(name, fallback) {
    var value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    var match = /^#([0-9a-f]{6})$/i.exec(value);
    var hex = match ? match[1] : fallback;
    return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)];
  }

  function rgba(c, a) {
    return "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + a.toFixed(3) + ")";
  }

  var VIOLET = cssColor("--scene-violet", "a78bfa");
  var CYAN = cssColor("--scene-cyan", "22d3ee");
  var WHITE = cssColor("--scene-white", "f0eeff");
  var PALETTE = [VIOLET, CYAN, WHITE];

  // Soft round light, drawn once and stamped many times (much cheaper than shadowBlur).
  function makeGlow(color, size, core) {
    var c = document.createElement("canvas");
    c.width = c.height = size;
    var g = c.getContext("2d");
    var grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, rgba(color, 1));
    grad.addColorStop(core, rgba(color, 0.3));
    grad.addColorStop(1, rgba(color, 0));
    g.fillStyle = grad;
    g.fillRect(0, 0, size, size);
    return c;
  }

  var GLOW = { violet: makeGlow(VIOLET, 64, 0.2), cyan: makeGlow(CYAN, 64, 0.2), white: makeGlow(WHITE, 64, 0.15) };
  var CORE_GLOW = makeGlow(VIOLET, 256, 0.12);
  var CORE_HOT = makeGlow(WHITE, 128, 0.18);

  /* ---------- Fintech icons (24×24 line art) ---------- */

  var ICON_PATHS = [
    // card
    "M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z M2 10h20 M6 15h4",
    // dollar coin
    "M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0z M15 9.2c-.6-1-1.7-1.5-3-1.5-1.7 0-3 .8-3 2.1 0 3 6 1.6 6 4.4 0 1.3-1.3 2.1-3 2.1-1.4 0-2.6-.6-3.1-1.6 M12 6.2v1.5 M12 16.3v1.5",
    // pound
    "M16 7.5c-.5-1.5-1.8-2.5-3.5-2.5C10.5 5 9 6.5 9 8.5c0 2 .8 3.5.8 5.5 0 2-1 3.5-2.3 4.5H17 M7 12.5h7",
    // euro
    "M17 7a6 6 0 1 0 0 10 M5 10h8 M5 14h8",
    // bitcoin
    "M8 5h5.5a3 3 0 0 1 0 6H8z M8 11h6.5a3 3 0 0 1 0 6H8z M8 5v12 M6 5h2 M6 17h2 M10 3v2 M13 3v2 M10 17v2 M13 17v2",
    // bar chart
    "M4 20h17 M6.5 17v-4 M10.5 17v-7 M14.5 17v-5 M18.5 17V5",
    // trend up
    "M3 17l5-5 4 3 8-8 M15 7h5v5",
    // candlesticks
    "M7 3v4 M7 15v6 M5 7h4v8H5z M17 3v6 M17 17v4 M15 9h4v8h-4z",
    // bank
    "M3 9l9-5 9 5 M4 9h16 M6 9v8 M10 9v8 M14 9v8 M18 9v8 M3 20h18",
    // wallet
    "M4 7h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h11v3 M15 13.5h2",
    // contactless
    "M8.5 8.5a5 5 0 0 1 0 7 M12 6a8.5 8.5 0 0 1 0 12 M15.5 3.5a12 12 0 0 1 0 17",
    // shield with lock
    "M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z M9.5 12h5v4h-5z M10.5 12v-1.5a1.5 1.5 0 0 1 3 0V12",
    // phone
    "M8 2h8a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z M11 18.5h2",
    // pie chart
    "M11 4a8 8 0 1 0 8 8h-8z M14 2a8 8 0 0 1 8 8h-8z",
    // percent
    "M19 5L5 19 M5 7a2 2 0 1 0 4 0a2 2 0 1 0-4 0z M15 17a2 2 0 1 0 4 0a2 2 0 1 0-4 0z",
    // exchange arrows
    "M4 8h15l-3-3 M20 16H5l3 3"
  ].map(function (d) { return new Path2D(d); });

  // Real fintech brands, drawn filled in their own colours (marks from Simple Icons, 24×24).
  var BRANDS = [
    { color: [255, 255, 255], d: "M20.9133 6.9566C20.9133 3.1208 17.7898 0 13.9503 0H2.424v3.8605h10.9782c1.7376 0 3.177 1.3651 3.2087 3.043.016.84-.2994 1.633-.8878 2.2324-.5886.5998-1.375.9303-2.2144.9303H9.2322a.2756.2756 0 0 0-.2755.2752v3.431c0 .0585.018.1142.052.1612L16.2646 24h5.3114l-7.2727-10.094c3.6625-.1838 6.61-3.2612 6.61-6.9494zM6.8943 5.9229H2.424V24h4.4704z" }, // Revolut
    { color: [255, 79, 64], d: "M4.244 1.174a.443.443 0 00-.271.13l-3.97 3.97-.001.001c3.884 3.882 8.093 8.092 11.748 11.748v-8.57L4.602 1.305a.443.443 0 00-.358-.131zm15.483 0a.443.443 0 00-.329.13L12.25 8.456v8.568L24 5.275c-1.316-1.322-2.647-2.648-3.97-3.97a.443.443 0 00-.301-.131zM0 5.979l.002 10.955c0 .294.118.577.326.785l4.973 4.976c.28.282.76.083.758-.314V12.037zm23.998.003l-6.06 6.061v10.338c-.004.399.48.6.76.314l4.974-4.976c.208-.208.326-.49.326-.785z" }, // Monzo
    { color: [159, 232, 112], d: "M6.488 7.469 0 15.05h11.585l1.301-3.576H7.922l3.033-3.507.01-.092L8.993 4.48h8.873l-6.878 18.925h4.706L24 .595H2.543l3.945 6.874Z" }, // Wise
    { color: [99, 91, 255], d: "M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z" }, // Stripe
    { color: [0, 156, 222], d: "M7.016 19.198h-4.2a.562.562 0 0 1-.555-.65L5.093.584A.692.692 0 0 1 5.776 0h7.222c3.417 0 5.904 2.488 5.846 5.5-.006.25-.027.5-.066.747A6.794 6.794 0 0 1 12.071 12H8.743a.69.69 0 0 0-.682.583l-.325 2.056-.013.083-.692 4.39-.015.087zM19.79 6.142c-.01.087-.01.175-.023.261a7.76 7.76 0 0 1-7.695 6.598H9.007l-.283 1.795-.013.083-.692 4.39-.134.843-.014.088H6.86l-.497 3.15a.562.562 0 0 0 .555.65h3.612c.34 0 .63-.249.683-.585l.952-6.031a.692.692 0 0 1 .683-.584h2.126a6.793 6.793 0 0 0 6.707-5.752c.306-1.95-.466-3.744-1.89-4.906z" }, // PayPal
    { color: [255, 179, 199], d: "M4.592 2v20H0V2h4.592zm11.46 0c0 4.194-1.583 8.105-4.415 11.068l-.278.283L17.702 22h-5.668l-6.893-9.4 1.779-1.332c2.858-2.14 4.535-5.378 4.637-8.924L11.562 2h4.49zM21.5 17a2.5 2.5 0 110 5 2.5 2.5 0 010-5z" }, // Klarna
    { color: [255, 95, 0], d: "M11.343 18.031c.058.049.12.098.181.146-1.177.783-2.59 1.238-4.107 1.238C3.32 19.416 0 16.096 0 12c0-4.095 3.32-7.416 7.416-7.416 1.518 0 2.931.456 4.105 1.238-.06.051-.12.098-.165.15C9.6 7.489 8.595 9.688 8.595 12c0 2.311 1.001 4.51 2.748 6.031zm5.241-13.447c-1.52 0-2.931.456-4.105 1.238.06.051.12.098.165.15C14.4 7.489 15.405 9.688 15.405 12c0 2.31-1.001 4.507-2.748 6.031-.058.049-.12.098-.181.146 1.177.783 2.588 1.238 4.107 1.238C20.68 19.416 24 16.096 24 12c0-4.094-3.32-7.416-7.416-7.416zM12 6.174c-.096.075-.189.15-.28.231C10.156 7.764 9.169 9.765 9.169 12c0 2.236.987 4.236 2.551 5.595.09.08.185.158.28.232.096-.074.189-.152.28-.232 1.563-1.359 2.551-3.359 2.551-5.595 0-2.235-.987-4.236-2.551-5.595-.09-.08-.184-.156-.28-.231z" }, // Mastercard
    { color: [214, 222, 255], d: "M9.112 8.262L5.97 15.758H3.92L2.374 9.775c-.094-.368-.175-.503-.461-.658C1.447 8.864.677 8.627 0 8.479l.046-.217h3.3a.904.904 0 01.894.764l.817 4.338 2.018-5.102zm8.033 5.049c.008-1.979-2.736-2.088-2.717-2.972.006-.269.262-.555.822-.628a3.66 3.66 0 011.913.336l.34-1.59a5.207 5.207 0 00-1.814-.333c-1.917 0-3.266 1.02-3.278 2.479-.012 1.079.963 1.68 1.698 2.04.756.367 1.01.603 1.006.931-.005.504-.602.725-1.16.734-.975.015-1.54-.263-1.992-.473l-.351 1.642c.453.208 1.289.39 2.156.398 2.037 0 3.37-1.006 3.377-2.564m5.061 2.447H24l-1.565-7.496h-1.656a.883.883 0 00-.826.55l-2.909 6.946h2.036l.405-1.12h2.488zm-2.163-2.656l1.02-2.815.588 2.815zm-8.16-4.84l-1.603 7.496H8.34l1.605-7.496z" }, // Visa
    { color: [240, 185, 11], d: "M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z" }, // Binance
    { color: [204, 255, 0], d: "M2.84 24h.53c.096 0 .192-.048.224-.128C7.591 13.696 11.94 8.656 14.67 5.638c.112-.128.064-.225-.096-.225h-4.88a.55.55 0 0 0-.45.225L5.746 9.972c-.514.642-.642 1.236-.642 2.086v4.43c-1.14 3.194-1.862 5.361-2.392 7.32-.032.125.016.192.129.192M20.447.646c-.754-.802-4.157-.834-5.73-.224a3 3 0 0 0-.786.465 41 41 0 0 0-3.323 3.178c-.112.113-.064.225.097.225h5.409c.497 0 .786.289.786.786v6.1c0 .16.128.208.225.064l3.258-4.254c.53-.69.69-.898.835-1.861.192-1.413.08-3.58-.77-4.479m-6.982 16.18 2.231-3.676a.7.7 0 0 0 .064-.29V6.73c0-.16-.112-.225-.224-.097-3.355 3.74-5.971 7.672-8.395 12.407-.06.12.016.225.16.177l5.009-1.54c.565-.174.882-.402 1.155-.852" }, // Robinhood
    { color: [72, 172, 152], d: "M0 3.803v1.195h7.436V3.803H0zM12.69 7.29c-2.034 0-3.038 1.252-3.038 2.684 0 .234.027.468.092.728l1.393.135a3.697 3.697 0 0 1-.09-.793c0-1.072.71-1.586 1.598-1.586.866 0 1.507.485 1.507 1.652 0 1.186-.58 1.995-1.464 2.88-.925.923-2.4 2.027-3.112 2.534v1.092h6.135v-1.195h-4.168c.695-.48 1.69-1.279 2.133-1.72.502-.503 1.931-1.794 1.931-3.636 0-1.903-1.24-2.775-2.918-2.775zm8.34 0c-1.976 0-3.454 1.517-3.454 4.916 0 3.017 1.233 4.508 3.356 4.508 1.754 0 3.068-1.198 3.068-3.172 0-1.542-.823-3.066-2.793-3.066-1.1 0-1.884.51-2.281 1.263 0-1.78.62-3.33 2.094-3.33.937 0 1.309.538 1.507 1.422l1.366-.271c-.321-1.527-1.292-2.27-2.864-2.27zM.075 7.389v9.228h1.33v-6.312c0-.56-.013-.898-.039-1.223h.026c.136.372.298.699.539 1.123l3.732 6.412h1.69V7.39H6.04v6.31c0 .56.013.898.04 1.223h-.028a7.252 7.252 0 0 0-.537-1.123L1.783 7.389H.076zm20.817 4.185c1.114 0 1.744.822 1.744 1.992 0 1.256-.717 2.034-1.701 2.034-1.09 0-1.843-1.001-1.973-2.329.33-1.133 1.063-1.697 1.93-1.697zM0 19.008v1.19h7.436v-1.19H0z" }, // N26
    { color: [155, 107, 255], d: "M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm2.738 3.822h.666v2.724h-.666a4.794 4.794 0 0 0-4.789 4.788V12H7.226v-.666c0-4.142 3.37-7.512 7.512-7.512zM14.05 12h2.723v.666c0 4.142-3.37 7.512-7.512 7.512h-.666v-2.724h.666a4.794 4.794 0 0 0 4.789-4.788z" } // Starling
  ].map(function (b) {
    return { path: new Path2D(b.d), color: b.color, glow: makeGlow(b.color, 64, 0.2) };
  });

  var CURRENCIES = ["£", "$", "€", "₿"];

  /* ---------- Scene ---------- */

  var ARMS = 3;
  var FOCAL = 2.8;      // camera distance in scene units; lower = stronger perspective
  var BASE_PITCH = 0.5; // how far the disc is tilted toward the viewer
  var BASE_ROLL = -0.32;

  var w = 0, h = 0, dpr = 1, cx = 0, cy = 0, R = 1, iconSize = 22;
  var dust = [], icons = [], pulses = [], ripples = [], labels = [];
  var time = 0, coreFlash = 0, nextPulse = 1.2;
  var yaw = 0, pitch = BASE_PITCH, targetYaw = 0, targetPitch = BASE_PITCH;
  var spinBoost = 0;
  var cosYaw, sinYaw, cosPitch, sinPitch, cosRoll, sinRoll;

  function gaussian() {
    return (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
  }

  function angularSpeed(r) {
    return 0.07 / Math.sqrt(r);
  }

  function build() {
    var count = Math.round(Math.min(900, Math.max(260, (w * h) / 1700)));
    dust = [];
    for (var i = 0; i < count; i++) {
      var r = 0.06 + Math.pow(Math.random(), 0.7) * 1.05;
      var arm = i % ARMS;
      dust.push({
        r: r,
        a: arm * (TAU / ARMS) + Math.log(r) * 2.4 + gaussian() * 0.35 * (0.5 + r),
        y: gaussian() * (0.025 + 0.05 * (1 - Math.min(r, 1))),
        color: Math.random() < 0.55 ? 0 : (Math.random() < 0.5 ? 1 : 2),
        alpha: 0.18 + Math.random() * 0.5,
        star: Math.random() < 0.06
      });
    }

    var iconCount = w < 768 ? 14 : 26;
    // Brands and generic icons alternate, so brands are spread through the whole orbit.
    var generic = 0;
    icons = [];
    for (var j = 0; j < iconCount; j++) {
      var brand = (j % 2 === 0 && BRANDS[j / 2]) || null;
      icons.push({
        path: brand ? brand.path : ICON_PATHS[generic++ % ICON_PATHS.length],
        brand: !!brand,
        r: 0.42 + (j / iconCount) * 0.6 + Math.random() * 0.06,
        a: j * 2.399, // golden angle, so icons never bunch up
        y: gaussian() * 0.05,
        spin: Math.random() * TAU,
        spinSpeed: (Math.random() - 0.5) * 0.25,
        color: brand ? brand.color : (j % 3 === 1 ? CYAN : VIOLET),
        glow: brand ? brand.glow : (j % 3 === 1 ? GLOW.cyan : GLOW.violet),
        flash: 0,
        screen: { x: 0, y: 0, s: 1, z: 0 }
      });
    }
    pulses = [];
    ripples = [];
    labels = [];
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);

    var wide = w >= 1024; // matches the sidebar breakpoint in styles.css
    // On wide screens the core sits in the gap between the sidebar and the content.
    cx = w * (wide ? 0.47 : 0.5);
    cy = h * (wide ? 0.56 : 0.36);
    R = Math.min(w * (w < 768 ? 0.62 : 0.42), h * 0.62);
    iconSize = Math.max(16, Math.min(30, R / 17));
    build();
  }

  function updateCamera() {
    var roll = BASE_ROLL + Math.sin(time * 0.05) * 0.05;
    cosYaw = Math.cos(yaw); sinYaw = Math.sin(yaw);
    cosPitch = Math.cos(pitch); sinPitch = Math.sin(pitch);
    cosRoll = Math.cos(roll); sinRoll = Math.sin(roll);
  }

  // Scene units (disc radius ≈ 1) → screen pixels. z > 0 is behind the core.
  function project(x, y, z, out) {
    var x1 = x * cosYaw - z * sinYaw;
    var z1 = x * sinYaw + z * cosYaw;
    var y2 = y * cosPitch - z1 * sinPitch;
    var z2 = y * sinPitch + z1 * cosPitch;
    var x3 = x1 * cosRoll - y2 * sinRoll;
    var y3 = x1 * sinRoll + y2 * cosRoll;
    var s = FOCAL / (FOCAL + z2);
    out.x = cx + x3 * R * s;
    out.y = cy + y3 * R * s;
    out.s = s;
    out.z = z2;
    return out;
  }

  /* ---------- Drawing ---------- */

  var p0 = { x: 0, y: 0, s: 1, z: 0 };
  var p1 = { x: 0, y: 0, s: 1, z: 0 };
  var p2 = { x: 0, y: 0, s: 1, z: 0 };
  var BUCKETS = 4;
  var dustPaths = [];

  function drawDust() {
    var i, b;
    for (i = 0; i < PALETTE.length * BUCKETS; i++) dustPaths[i] = new Path2D();

    for (i = 0; i < dust.length; i++) {
      var d = dust[i];
      var trail = angularSpeed(d.r) * 1.4; // streak length: where it was ~1.4s ago
      project(d.r * Math.cos(d.a), d.y, d.r * Math.sin(d.a), p0);
      var am = d.a - trail * 0.5;
      project(d.r * Math.cos(am), d.y, d.r * Math.sin(am), p1);
      var at = d.a - trail;
      project(d.r * Math.cos(at), d.y, d.r * Math.sin(at), p2);

      // Far side of the disc is dimmer, near side brighter.
      var depth = Math.max(0, Math.min(1, 0.65 - p0.z * 0.5));
      b = Math.min(BUCKETS - 1, Math.floor(d.alpha * depth * BUCKETS * 1.6));
      var path = dustPaths[d.color * BUCKETS + b];
      path.moveTo(p2.x, p2.y);
      path.lineTo(p1.x, p1.y);
      path.lineTo(p0.x, p0.y);

      if (d.star) {
        var size = 9 * p0.s;
        ctx.globalAlpha = 0.5 * depth;
        ctx.drawImage(d.color === 1 ? GLOW.cyan : GLOW.white, p0.x - size / 2, p0.y - size / 2, size, size);
      }
    }

    ctx.globalAlpha = 1;
    ctx.lineWidth = 1.1;
    ctx.lineCap = "round";
    for (var c = 0; c < PALETTE.length; c++) {
      for (b = 0; b < BUCKETS; b++) {
        ctx.strokeStyle = rgba(PALETTE[c], 0.06 + b * 0.1);
        ctx.stroke(dustPaths[c * BUCKETS + b]);
      }
    }
  }

  function drawCore() {
    var pulse = 1 + Math.sin(time * 1.3) * 0.04 + coreFlash * 0.35;
    var big = R * 0.95 * pulse;
    ctx.globalAlpha = 0.45 + coreFlash * 0.25;
    ctx.drawImage(CORE_GLOW, cx - big / 2, cy - big / 2, big, big);
    var hot = R * 0.16 * pulse;
    ctx.globalAlpha = 0.85;
    ctx.drawImage(CORE_HOT, cx - hot / 2, cy - hot / 2, hot, hot);
    ctx.globalAlpha = 1;
  }

  function drawRipples() {
    for (var i = 0; i < ripples.length; i++) {
      var rp = ripples[i];
      var rr = 0.06 + rp.age * 0.55;
      ctx.beginPath();
      for (var k = 0; k <= 48; k++) {
        var a = (k / 48) * TAU;
        project(rr * Math.cos(a), 0, rr * Math.sin(a), p0);
        if (k === 0) ctx.moveTo(p0.x, p0.y); else ctx.lineTo(p0.x, p0.y);
      }
      ctx.strokeStyle = rgba(rp.color, Math.max(0, 0.5 * (1 - rp.age / 1.6)));
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }
  }

  function drawIcons(behind) {
    for (var i = 0; i < icons.length; i++) {
      var ic = icons[i];
      var sp = ic.screen;
      if ((sp.z > 0) !== behind) continue;

      var depth = Math.max(0.15, Math.min(1, 0.7 - sp.z * 0.6));
      var k = (iconSize / 24) * sp.s * (1 + ic.flash * 0.25) * (ic.brand ? 1.55 : 1);
      var glowSize = iconSize * 3.2 * sp.s;

      ctx.globalAlpha = (0.24 + ic.flash * 0.45) * depth;
      ctx.drawImage(ic.glow, sp.x - glowSize / 2, sp.y - glowSize / 2, glowSize, glowSize);

      var tilt = Math.sin(ic.spin) * 0.35;
      var cos = Math.cos(tilt) * k * dpr;
      var sin = Math.sin(tilt) * k * dpr;
      ctx.setTransform(cos, sin, -sin, cos, sp.x * dpr - (cos * 12 - sin * 12), sp.y * dpr - (sin * 12 + cos * 12));
      ctx.globalAlpha = Math.min(1, (0.7 + ic.flash * 0.5) * depth);
      if (ic.brand) {
        ctx.fillStyle = rgba(ic.color, 1);
        ctx.fill(ic.path);
      } else {
        ctx.strokeStyle = rgba(ic.flash > 0.05 ? WHITE : ic.color, 1);
        ctx.lineWidth = 1.5;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.stroke(ic.path);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    ctx.globalAlpha = 1;
  }

  // Quadratic curve from the icon to the core, bowing sideways like an orbit decaying.
  function pulsePoint(p, t, out) {
    var sp = p.icon.screen;
    var mx = (sp.x + cx) / 2 + p.bend * (cy - sp.y) * 0.35;
    var my = (sp.y + cy) / 2 + p.bend * (sp.x - cx) * 0.35;
    var u = 1 - t;
    out.x = u * u * sp.x + 2 * u * t * mx + t * t * cx;
    out.y = u * u * sp.y + 2 * u * t * my + t * t * cy;
    return out;
  }

  function drawPulses() {
    for (var i = 0; i < pulses.length; i++) {
      var p = pulses[i];
      var t = Math.min(1, p.age / p.duration);
      var eased = t * t * (3 - 2 * t);
      for (var k = 7; k >= 0; k--) {
        var tk = Math.max(0, eased - k * 0.025);
        pulsePoint(p, tk, p0);
        var size = (14 - k * 1.4) * (0.8 + eased * 0.4);
        ctx.globalAlpha = (1 - k / 8) * 0.75;
        ctx.drawImage(k === 0 ? GLOW.white : p.glow, p0.x - size / 2, p0.y - size / 2, size, size);
      }
    }
    ctx.globalAlpha = 1;
  }

  function drawLabels() {
    ctx.font = "500 11px Inter, system-ui, sans-serif";
    ctx.textAlign = "center";
    for (var i = 0; i < labels.length; i++) {
      var l = labels[i];
      var t = l.age / 2;
      ctx.fillStyle = rgba(l.color, Math.max(0, 0.7 * Math.sin(Math.PI * Math.min(1, t))));
      ctx.fillText(l.text, l.x, l.y - t * 22);
    }
  }

  /* ---------- Simulation ---------- */

  function launchPulse() {
    var front = icons.filter(function (ic) { return ic.screen.z < 0.3; });
    if (!front.length) return;
    var icon = front[Math.floor(Math.random() * front.length)];
    icon.flash = 1;
    pulses.push({
      icon: icon,
      age: 0,
      duration: 1.3 + Math.random() * 0.7,
      bend: Math.random() < 0.5 ? -1 : 1,
      glow: icon.glow,
      color: icon.color
    });
    var amount = (Math.random() * 240 + 4).toFixed(2);
    labels.push({
      text: "+" + CURRENCIES[Math.floor(Math.random() * CURRENCIES.length)] + amount,
      x: icon.screen.x,
      y: icon.screen.y - iconSize * icon.screen.s,
      age: 0,
      color: icon.color
    });
  }

  function step(dt) {
    var speed = 1 + spinBoost;
    time += dt;
    spinBoost *= Math.pow(0.08, dt);
    yaw += (targetYaw - yaw) * Math.min(1, dt * 2.2);
    pitch += (targetPitch - pitch) * Math.min(1, dt * 2.2);
    coreFlash *= Math.pow(0.05, dt);

    var i;
    for (i = 0; i < dust.length; i++) dust[i].a += angularSpeed(dust[i].r) * dt * speed;
    for (i = 0; i < icons.length; i++) {
      var ic = icons[i];
      ic.a += angularSpeed(ic.r) * 0.9 * dt * speed;
      ic.spin += ic.spinSpeed * dt;
      ic.flash *= Math.pow(0.15, dt);
    }

    nextPulse -= dt;
    if (nextPulse <= 0) {
      launchPulse();
      nextPulse = 0.9 + Math.random() * 1.4;
    }

    for (i = pulses.length - 1; i >= 0; i--) {
      pulses[i].age += dt;
      if (pulses[i].age >= pulses[i].duration) {
        coreFlash = 1;
        ripples.push({ age: 0, color: pulses[i].color });
        pulses.splice(i, 1);
      }
    }
    for (i = ripples.length - 1; i >= 0; i--) {
      ripples[i].age += dt;
      if (ripples[i].age > 1.6) ripples.splice(i, 1);
    }
    for (i = labels.length - 1; i >= 0; i--) {
      labels[i].age += dt;
      if (labels[i].age > 2) labels.splice(i, 1);
    }
  }

  function render() {
    updateCamera();
    for (var i = 0; i < icons.length; i++) {
      var ic = icons[i];
      project(ic.r * Math.cos(ic.a), ic.y, ic.r * Math.sin(ic.a), ic.screen);
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = "lighter";

    drawIcons(true);
    drawDust();
    drawRipples();
    drawCore();
    drawPulses();
    drawIcons(false);
    drawLabels();

    ctx.globalCompositeOperation = "source-over";
  }

  /* ---------- Loop and input ---------- */

  var last = 0;
  var frame = null;

  function tick(now) {
    var dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
    last = now;
    step(dt);
    render();
    frame = window.requestAnimationFrame(tick);
  }

  function start() {
    if (frame || reduceMotion) return;
    last = 0;
    frame = window.requestAnimationFrame(tick);
  }

  function stop() {
    if (frame) window.cancelAnimationFrame(frame);
    frame = null;
  }

  var resizeTimer = null;
  window.addEventListener("resize", function () {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(function () {
      resize();
      if (reduceMotion) render();
    }, 150);
  });

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stop(); else start();
  });

  // The disc leans toward the mouse a little, and scrolling gives it a push.
  window.addEventListener("pointermove", function (event) {
    if (event.pointerType !== "mouse") return;
    targetYaw = (event.clientX / w - 0.5) * 0.5;
    targetPitch = BASE_PITCH + (event.clientY / h - 0.5) * 0.25;
  }, { passive: true });

  var lastScroll = window.scrollY;
  window.addEventListener("scroll", function () {
    var delta = Math.abs(window.scrollY - lastScroll);
    lastScroll = window.scrollY;
    spinBoost = Math.min(3, spinBoost + delta * 0.01);
  }, { passive: true });

  resize();
  if (reduceMotion) render(); else start();
})();
