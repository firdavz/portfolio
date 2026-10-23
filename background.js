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
    { color: [159, 232, 112], d: "M6.488 7.469 0 15.05h11.585l1.301-3.576H7.922l3.033-3.507.01-.092L8.993 4.48h8.873l-6.878 18.925h4.706L24 .595H2.543l3.945 6.874Z" } // Wise
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

    var iconCount = w < 768 ? 11 : 18;
    // Brands are spread evenly through the orbit; generic icons fill the rest.
    var brandEvery = Math.floor(iconCount / BRANDS.length);
    var generic = 0;
    icons = [];
    for (var j = 0; j < iconCount; j++) {
      var brand = (j % brandEvery === 0 && BRANDS[j / brandEvery]) || null;
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
