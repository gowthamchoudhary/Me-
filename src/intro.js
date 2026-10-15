export default function initIntro() {
  "use strict";
  var B = document.body;
  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  var rand = function (a, b) { return a + Math.random() * (b - a); };
  var reduced = false;
  try { reduced = matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}
  if (reduced) B.classList.add("reduced");
  B.classList.add("intro-lock"); // mobile CSS locks scrolling during the intro
  var isSmall = window.innerWidth < 700;

  var introEl = document.getElementById("intro");
  var canvas = document.getElementById("wire");
  var ctx = canvas.getContext("2d");
  var capsule = document.getElementById("capsule");
  var capText = document.getElementById("capText");
  var W = 0, H = 0, DPR = 1;

  /* ================= AUDIO (synthesized, silent-safe, no UI) ================= */
  var AC = null, master = null;
  function ensureAC() {
    if (AC) return AC;
    try {
      var C = window.AudioContext || window.webkitAudioContext;
      if (!C) return null;
      AC = new C();
      master = AC.createGain(); master.gain.value = 1;
      master.connect(AC.destination);
    } catch (e) { return null; }
    return AC;
  }
  function audioLive() {
    var ac = ensureAC(); if (!ac) return false;
    if (ac.state === "suspended") { try { ac.resume(); } catch (e) {} }
    return ac.state === "running";
  }
  function noiseBuf(dur) {
    var ac = ensureAC(); if (!ac) return null;
    try {
      var n = Math.max(1, Math.floor(ac.sampleRate * dur));
      var b = ac.createBuffer(1, n, ac.sampleRate), d = b.getChannelData(0);
      for (var i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
      return b;
    } catch (e) { return null; }
  }
  function sndClick() {
    var ac = ensureAC(); if (!ac || ac.state !== "running") return;
    try {
      var t = ac.currentTime;
      var o = ac.createOscillator(); o.type = "square";
      o.frequency.setValueAtTime(1900, t);
      o.frequency.exponentialRampToValueAtTime(220, t + .05);
      var g = ac.createGain();
      g.gain.setValueAtTime(.0001, t);
      g.gain.exponentialRampToValueAtTime(.4, t + .004);
      g.gain.exponentialRampToValueAtTime(.0001, t + .07);
      o.connect(g); g.connect(master); o.start(t); o.stop(t + .09);
    } catch (e) {}
  }
  function sndCrackle(dur) {
    var ac = ensureAC(); if (!ac || ac.state !== "running") return;
    try {
      var nb = noiseBuf(dur); if (!nb) return;
      var src = ac.createBufferSource(); src.buffer = nb;
      var hp = ac.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 1600;
      var g = ac.createGain();
      g.gain.setValueAtTime(.14, ac.currentTime);
      g.gain.exponentialRampToValueAtTime(.0001, ac.currentTime + dur);
      src.connect(hp); hp.connect(g); g.connect(master); src.start();
    } catch (e) {}
  }
  function sndPing() {
    var ac = ensureAC(); if (!ac || ac.state !== "running") return;
    try {
      var t = ac.currentTime;
      var o = ac.createOscillator(), g = ac.createGain();
      o.type = "sine"; o.frequency.setValueAtTime(1150, t);
      o.frequency.exponentialRampToValueAtTime(700, t + .14);
      g.gain.setValueAtTime(.0001, t);
      g.gain.exponentialRampToValueAtTime(.11, t + .012);
      g.gain.exponentialRampToValueAtTime(.0001, t + .18);
      o.connect(g); g.connect(master); o.start(t); o.stop(t + .2);
    } catch (e) {}
  }

  /* ================= ROPE — verlet, 28 pts, 24 iters ================= */
  var N = 28, SEG = 0, ropePinned = false, yankOn = false, yankOff = false;
  var pts = [];
  function ropeInit() {
    var L = isSmall ? Math.min(H * .5, 420) : Math.min(H * .55, 480);
    SEG = L / (N - 1);
    pts = [];
    for (var i = 0; i < N; i++) {
      pts.push({ x: W * .5 + rand(-.6, .6), y: -26 - i * SEG * .55, px: 0, py: 0, pin: false });
      pts[i].px = pts[i].x; pts[i].py = pts[i].y;
    }
  }
  function ropeStep(g, damp) {
    for (var i = 0; i < N; i++) {
      var p = pts[i];
      if (p.pin) continue;
      var vx = (p.x - p.px) * damp;
      var vy = (p.y - p.py) * damp;
      p.px = p.x; p.py = p.y;
      p.x += vx; p.y += vy + g;
    }
    for (var it = 0; it < 24; it++) {
      for (var c = 0; c < N - 1; c++) {
        var a = pts[c], b = pts[c + 1];
        var dx = b.x - a.x, dy = b.y - a.y;
        var d = Math.sqrt(dx * dx + dy * dy) || .0001;
        var k = (d - SEG) / d * .5;
        if (!a.pin) { a.x += dx * k; a.y += dy * k; }
        if (!b.pin) { b.x -= dx * k; b.y -= dy * k; }
      }
    }
  }
  function drawRope(alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    // glow
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (var i = 1; i < N; i++) ctx.lineTo(pts[i].x, pts[i].y);
    ctx.shadowColor = "rgba(255,255,255,.75)"; ctx.shadowBlur = 14;
    ctx.strokeStyle = "#f5f4ef"; ctx.lineWidth = 4.4;
    ctx.stroke();
    // inner grey highlight
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "rgba(214,211,203,.95)"; ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.moveTo(pts[0].x + .8, pts[0].y);
    for (var j = 1; j < N; j++) ctx.lineTo(pts[j].x + .8, pts[j].y);
    ctx.stroke();
    // frayed tip: 3 short copper strands
    var tip = pts[N - 1], prev = pts[N - 2];
    var ax = tip.x - prev.x, ay = tip.y - prev.y, al = Math.sqrt(ax * ax + ay * ay) || 1;
    ax /= al; ay /= al;
    ctx.strokeStyle = "#b46a3c"; ctx.lineWidth = 1;
    for (var s = 0; s < 3; s++) {
      var ox = (s - 1) * 2.2, ln = rand(4, 8);
      ctx.beginPath();
      ctx.moveTo(tip.x, tip.y);
      ctx.lineTo(tip.x + ax * ln * .6 - ay * ox, tip.y + ay * ln * .6 + ax * ox);
      ctx.stroke();
    }
    ctx.restore();
  }

  /* ================= SPARKS ================= */
  var flashA = 0, arcs = [], parts = [], tipPt = null, sparkA = 0;
  function doSpark() {
    sparkA = 1;
    flashA = 1;
    var tip = pts[N - 1];
    tipPt = tip;
    for (var a = 0; a < 6; a++) {          // jagged blue-white arcs
      var px = tip.x, py = tip.y, seg = [[px, py]];
      var ang = rand(-Math.PI, Math.PI), len = rand(30, 90);
      var steps = 4 + Math.floor(rand(0, 4));
      for (var s2 = 0; s2 < steps; s2++) {
        ang += rand(-.7, .7);
        px += Math.cos(ang) * len / steps; py += Math.sin(ang) * len / steps;
        seg.push([px, py]);
      }
      arcs.push({ seg: seg, life: rand(.08, .16), t: 0 });
    }
    for (var q = 0; q < 18; q++) {          // particles with gravity
      var ang2 = rand(-Math.PI * .95, -Math.PI * .05), sp = rand(3, 11);
      parts.push({ x: tip.x, y: tip.y, vx: Math.cos(ang2) * sp, vy: Math.sin(ang2) * sp, life: rand(.45, .9), t: 0 });
    }
    sndClick(); sndCrackle(.22);
  }

  /* ================= INTRO LOOP ================= */
  var timeouts = [];
  function later(fn, ms) { timeouts.push(setTimeout(fn, ms)); }

  var finished = false, raf = null;
  function endIntro(fast) {
    if (finished) return;
    finished = true;
    if (raf) cancelAnimationFrame(raf);
    timeouts.forEach(clearTimeout); timeouts = [];
    B.classList.add("lit");
    if (fast) B.classList.add("fast");
    B.classList.remove("intro-lock");
    audioLive();
    introEl.classList.add("fading");
    later(function () {
      introEl.classList.add("off");
      ctx.clearRect(0, 0, W, H);
    }, fast ? 30 : 520);
  }

  var T0 = performance.now(), toggles = {}, freefallEnd = .55;
  function frame(now) {
    if (finished) return;
    var t = (now - T0) / 1000;

    // rope physics
    if (!ropePinned) {
      if (t < freefallEnd) ropeStep(.42, .998);   // free fall
      else {
        ropePinned = true;
        pts[0].pin = true;
        pts[0].x = W * .5; pts[0].y = -6;
        pts[0].px = pts[0].x; pts[0].py = pts[0].y;
      }
    } else if (!yankOn) {
      ropeStep(.42, .995);                        // pinned: snap taut, swing
    } else {
      // yanked upward and out
      pts[0].pin = true;
      pts[0].y -= (t - 4.6 > 0 ? (t - 4.6) * 2600 * .016 + 26 : 26);
      pts[0].px = pts[0].x; pts[0].py = pts[0].y;
      ropeStep(.42, .99);
    }

    // sparks schedule
    if (t > 1.5 && !toggles.s1) { toggles.s1 = 1; doSpark(); }
    if (t > 2.0 && !toggles.s2) { toggles.s2 = 1; doSpark(); }
    if (t > 2.4 && !toggles.s3) { toggles.s3 = 1; doSpark(); }
    if (t > 2.3 && !toggles.cap) { toggles.cap = 1; introEl.classList.add("on"); capsule.classList.add("drop"); }
    if (t > 4.0 && !toggles.fix) { toggles.fix = 1; capsule.classList.add("fixed"); capText.textContent = "fixed"; sndPing(); }
    if (t > 4.6 && !toggles.yank) { toggles.yank = 1; yankOn = true; capsule.classList.add("leave"); }
    if (t > 5.3) { endIntro(false); return; }

    // draw
    ctx.clearRect(0, 0, W, H);
    drawRope(1);
    // arcs
    for (var i = arcs.length - 1; i >= 0; i--) {
      var A = arcs[i]; A.t += .016;
      var a2 = clamp(1 - A.t / A.life, 0, 1);
      if (a2 <= 0) { arcs.splice(i, 1); continue; }
      ctx.globalAlpha = a2;
      ctx.strokeStyle = Math.random() < .5 ? "#eaf5ff" : "#9fc8ff";
      ctx.lineWidth = rand(1, 2.4);
      ctx.beginPath();
      ctx.moveTo(A.seg[0][0], A.seg[0][1]);
      for (var s3 = 1; s3 < A.seg.length; s3++) ctx.lineTo(A.seg[s3][0], A.seg[s3][1]);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    // particles
    for (var q = parts.length - 1; q >= 0; q--) {
      var P = parts[q]; P.t += .016;
      var pa = clamp(1 - P.t / P.life, 0, 1);
      if (pa <= 0) { parts.splice(q, 1); continue; }
      P.vy += .28; P.vx *= .99;
      P.x += P.vx; P.y += P.vy;
      ctx.globalAlpha = pa;
      ctx.strokeStyle = q % 3 === 0 ? "#cfeaff" : "#ffffff";
      ctx.lineWidth = rand(.9, 1.6);
      ctx.beginPath(); ctx.moveTo(P.x, P.y);
      ctx.lineTo(P.x - P.vx * 1.6, P.y - P.vy * 1.6);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    // screen flash (stutters)
    if (flashA > 0) {
      flashA -= .09;
      var fa = flashA > .45 && Math.random() < .6 ? flashA * rand(.6, 1) : flashA;
      if (fa > 0) {
        ctx.fillStyle = "rgba(240,246,255," + (fa * .8).toFixed(3) + ")";
        ctx.fillRect(0, 0, W, H);
      }
    }
    // tip glow while sparking
    if (sparkA > 0 && tipPt) {
      sparkA -= .05;
      var R = 26 + Math.random() * 22;
      var rg = ctx.createRadialGradient(tipPt.x, tipPt.y, 0, tipPt.x, tipPt.y, R);
      rg.addColorStop(0, "rgba(235,245,255,.95)");
      rg.addColorStop(.35, "rgba(140,190,255,.55)");
      rg.addColorStop(1, "rgba(140,190,255,0)");
      ctx.globalAlpha = clamp(sparkA, 0, 1);
      ctx.fillStyle = rg;
      ctx.beginPath(); ctx.arc(tipPt.x, tipPt.y, R, 0, 6.2832); ctx.fill();
      ctx.globalAlpha = 1;
    }
    raf = requestAnimationFrame(frame);
  }

  function sizeIntro() {
    DPR = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth; H = Math.max(innerHeight, 1);
    canvas.width = Math.floor(W * DPR); canvas.height = Math.floor(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  window.addEventListener("resize", function () { if (!finished) { sizeIntro(); ropeInit(); } });
  window.addEventListener("orientationchange", function () {
    if (finished) return;
    setTimeout(function () { if (!finished) { sizeIntro(); ropeInit(); } }, 150);
  });

  // skip: tap anywhere (or Escape). No gate, no visible UI.
  window.addEventListener("keydown", function (e) { if (e.key === "Escape" && !finished) endIntro(true); });
  window.addEventListener("pointerdown", function (e) {
    if (!finished) { endIntro(true); }
  }, { passive: true });

  /* ================= CHART ================= */
  var LV = "00000000000000000000000000000000000000000000000000000000100000000000000000000000000000001110011000000000000000000100011111111111111001111111110011001100100011110111111001211011000110101010111111010110110111111101111111200001110010010111121111121211110100111011001100000011141100111111111111110110000001111112422231111111011111112000002224101000011110000011111011144421100";
  var chartEl = document.getElementById("chart");
  (function buildChart() {
    var html = "";
    for (var i = 0; i < 371; i++) html += '<span class="cell" data-lv="' + LV.charAt(i) + '"></span>';
    chartEl.innerHTML = html;
  })();
  function applyTheme(name) {
    chartEl.setAttribute("data-ct", name);
    var btns = document.querySelectorAll(".pill[data-ct-btn]");
    for (var i = 0; i < btns.length; i++) btns[i].setAttribute("aria-pressed", String(btns[i].getAttribute("data-ct-btn") === name));
    var cs = getComputedStyle(chartEl);
    var keys = ["--c0","--c1","--c2","--c3","--c4","--g4"], vals = {};
    for (var k = 0; k < keys.length; k++) vals[keys[k]] = cs.getPropertyValue(keys[k]).trim();
    var cells = chartEl.querySelectorAll(".cell");
    for (var c = 0; c < cells.length; c++) {
      var el = cells[c], lv = el.getAttribute("data-lv");
      el.style.setProperty("--c", vals["--c" + lv]);
      var sh = "none";
      if (lv === "3" || lv === "4") sh = "0 0 6px " + vals["--g4"];
      el.style.setProperty("--sh", sh);
    }
  }
  document.querySelector(".themes").addEventListener("click", function (e) {
    var b = e.target.closest(".pill"); if (b) applyTheme(b.getAttribute("data-ct-btn"));
  });
  applyTheme("reactor");
  // newest weeks first on small screens: start scrolled to the far right
  var chartScroll = document.querySelector(".chart-scroll");
  if (chartScroll) chartScroll.scrollLeft = chartScroll.scrollWidth;

  /* ================= WEBS — corners, 10 threads, 9 sagging rings ================= */
  function qSag(ax, ay, bx, by, sag) {
    var mx = (ax + bx) / 2, my = (ay + by) / 2 + sag;
    return "M" + ax.toFixed(1) + " " + ay.toFixed(1) + " Q" + mx.toFixed(1) + " " + my.toFixed(1) + " " + bx.toFixed(1) + " " + by.toFixed(1);
  }
  function webSVG() {
    // anchor at bottom-left of its own viewBox: (2, 198)
    var cx = 2, cy = 198, out = [], paths = [];
    var angles = [];
    for (var i = 0; i < 10; i++) {
      // irregular fanning over 90° (up and to the right)
      var base = (i / 9) * (Math.PI / 2);
      angles.push(base + rand(-.07, .07));
    }
    angles.sort(function (a, b) { return a - b; });
    var R = 200;
    for (var i2 = 0; i2 < angles.length; i2++) {
      var a = angles[i2];
      var ex = cx + Math.cos(a) * R, ey = cy - Math.sin(a) * R;
      paths.push(qSag(cx, cy, ex, ey, 0));
    }
    // 9 spiral rings, sagging between threads
    for (var ring = 0; ring < 9; ring++) {
      var rr = 22 + ring * 20 + rand(-2, 2);
      var px = [];
      for (var s = 0; s < angles.length; s++) {
        var a2 = angles[s];
        px.push([cx + Math.cos(a2) * rr, cy - Math.sin(a2) * rr]);
      }
      for (var s2 = 0; s2 < angles.length - 1; s2++) {
        var sag = 2.5 + Math.random() * 5 + ring * .9;
        paths.push(qSag(px[s2][0], px[s2][1], px[s2 + 1][0], px[s2 + 1][1], sag));
      }
    }
    var svg = '<svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet">';
    for (var p = 0; p < paths.length; p++) {
      var dl = (p % 24) * 35 + Math.floor(rand(0, 30));
      svg += '<path pathLength="1" d="' + paths[p] + '" style="transition-delay:' + dl + 'ms"/>';
    }
    for (var d1 = 0; d1 < 7; d1++) {
      var a3 = angles[Math.floor(rand(0, angles.length))];
      var rr2 = 30 + Math.random() * 150;
      svg += '<circle cx="' + (cx + Math.cos(a3) * rr2).toFixed(1) + '" cy="' + (cy - Math.sin(a3) * rr2).toFixed(1) + '" r="' + rand(.7, 1.2).toFixed(1) + '" fill="rgba(245,244,239,.55)" style="transition-delay:' + Math.floor(rand(0, 300)) + 'ms"/>';
    }
    return svg + "</svg>";
  }
  function mountWeb(el) {
    el.innerHTML = webSVG();
    var bind = function () {
      el.classList.add("gone");
      clearTimeout(el._t);
      el._t = setTimeout(function () { el.classList.remove("gone"); }, 9000);
    };
    el.addEventListener("pointerenter", bind);
    el.addEventListener("touchstart", bind, { passive: true });
  }
  mountWeb(document.getElementById("webL"));
  mountWeb(document.getElementById("webR"));

  /* ================= BOOT ================= */
  var glow = document.getElementById("a-glow");
  var wrap = document.getElementById("eyesWrap");
  glow.style.transition = "opacity 4s ease 1.2s";
  wrap.querySelectorAll(".name, .hero-line, .hero-urls").forEach(function (el) {
    el.style.transition = "opacity 2s ease, transform 2s ease";
  });
  if (reduced) {
    endIntro(true);
    document.documentElement.classList.add("lit");
    if (glow) glow.style.opacity = "1";
    var els = document.querySelectorAll(".name, .hero-line, .hero-urls");
    els.forEach(function (el) { el.style.opacity = "1"; el.style.transform = "none"; });
    var ey = document.querySelectorAll(".eye");
    ey.forEach(function (el) {
      el.style.animation = "none";
      el.style.opacity = "1";
      el.style.transform = "scaleY(1)";
    });
    B.style.transform = "none";
  } else {
    sizeIntro();
    ropeInit();
    T0 = performance.now();
    audioLive(); // silent attempt; resumes on first gesture automatically
    window.addEventListener("pointerdown", function once() {
      audioLive();
      window.removeEventListener("pointerdown", once);
    }, { passive: true });
    raf = requestAnimationFrame(frame);
  }
}
