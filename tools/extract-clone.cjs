/**
 * Fase 0 — ekstraksi sistem desain dari clone yang berjalan (baca-saja).
 * Jalankan:
 *   NODE_PATH=/home/ken/Documents/alieffauzan-clone/node_modules node tools/extract-clone.cjs
 * Output:
 *   ref/shots/<lebar>-fold.png, <lebar>-full.png, <lebar>-menu.png, <lebar>-hover-*.png
 *   ref/extract/design-390.json, design-1440.json, motion.json, breakpoints.json, components.json
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE = 'http://127.0.0.1:8124/';
const ROOT = path.resolve(__dirname, '..');
const SHOTS = path.join(ROOT, 'ref', 'shots');
const EXTRACT = path.join(ROOT, 'ref', 'extract');
fs.mkdirSync(SHOTS, { recursive: true });
fs.mkdirSync(EXTRACT, { recursive: true });

const WIDTHS = [
  { w: 360, h: 800 },
  { w: 390, h: 844 },
  { w: 412, h: 915 },
  { w: 768, h: 1024 },
  { w: 1440, h: 900 },
];

/* ---------------------------------------------------------------- evaluate */
// Dijalankan di halaman clone. Kumpulkan gaya terkomputasi, bukan tebakan.
const COLLECT = () => {
  const px = (v) => (v && v !== 'normal' ? v : v);
  const uniq = (arr) => [...new Set(arr)];
  const sel = (el) => {
    if (!el || el === document.body) return 'body';
    let s = el.tagName.toLowerCase();
    if (el.id) s += '#' + el.id;
    if (typeof el.className === 'string' && el.className.trim()) {
      s += '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.');
    }
    return s;
  };
  const short = (t) => (t || '').trim().replace(/\s+/g, ' ').slice(0, 48);

  /* ---- 1. peta section (urutan visual) ---- */
  const main = document.getElementById('content') || document.getElementById('smooth-content') || document.body;
  const sections = [...main.children].map((el, i) => {
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return {
      domIndex: i,
      tag: el.tagName,
      id: el.id || null,
      cls: (typeof el.className === 'string' ? el.className : '').slice(0, 90),
      top: Math.round(r.top + window.scrollY),
      height: Math.round(r.height),
      bg: cs.backgroundColor,
      color: cs.color,
      padding: `${cs.paddingTop} ${cs.paddingRight} ${cs.paddingBottom} ${cs.paddingLeft}`,
      position: cs.position,
      overflow: cs.overflow,
      firstText: short(el.textContent),
    };
  });
  sections.sort((a, b) => a.top - b.top);

  /* ---- 2. tipografi per peran ---- */
  const typeRole = (el, role) => {
    const cs = getComputedStyle(el);
    return {
      role,
      sel: sel(el),
      sample: short(el.textContent),
      family: cs.fontFamily,
      weight: cs.fontWeight,
      size: cs.fontSize,
      lineHeight: cs.lineHeight,
      letterSpacing: cs.letterSpacing,
      transform: cs.textTransform,
      style: cs.fontStyle,
      color: cs.color,
      width: Math.round(el.getBoundingClientRect().width),
    };
  };
  const typography = [];
  const pushIf = (el, role) => el && typography.push(typeRole(el, role));
  pushIf(document.querySelector('h1'), 'h1');
  [...document.querySelectorAll('h2')].slice(0, 4).forEach((e, i) => pushIf(e, 'h2#' + i));
  [...document.querySelectorAll('h3')].slice(0, 4).forEach((e, i) => pushIf(e, 'h3#' + i));
  [...document.querySelectorAll('h4,h5,h6')].slice(0, 3).forEach((e, i) => pushIf(e, 'h4-6#' + i));
  pushIf(document.querySelector('main p'), 'body-p');
  pushIf(document.querySelector('p'), 'any-p');
  pushIf(document.querySelector('nav a, header a'), 'nav-link');
  pushIf(document.querySelector('a.btn, a[class*="button"], button, [role="button"] a, a[class*="cta"]'), 'button');
  pushIf(document.querySelector('footer p, footer span'), 'footer-text');
  pushIf(document.querySelector('[class*="label"], [class*="tag"], [class*="chip"]'), 'label-chip');
  // label kecil sering pakai span bersih — ambil beberapa
  [...document.querySelectorAll('section label, section .sec-label, section [class*="overline"], section small')]
    .slice(0, 4)
    .forEach((e, i) => pushIf(e, 'small/label#' + i));

  /* ---- 3. palet (peran -> hex, luas pemakaian) ---- */
  const bgMap = {}; // color -> {count, area}
  const fgMap = {};
  const borderMap = {};
  const fillMap = {};
  const all = [...document.querySelectorAll('*')];
  for (const el of all) {
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    const area = Math.max(0, r.width) * Math.max(0, r.height);
    const bg = cs.backgroundColor;
    if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
      bgMap[bg] = bgMap[bg] || { count: 0, area: 0 };
      bgMap[bg].count++;
      bgMap[bg].area += area;
    }
    const fg = cs.color;
    if (fg) {
      fgMap[fg] = fgMap[fg] || { count: 0, area: 0 };
      fgMap[fg].count++;
      fgMap[fg].area += area;
    }
    for (const side of ['Top', 'Right', 'Bottom', 'Left']) {
      const bw = cs['border' + side + 'Width'];
      const bc = cs['border' + side + 'Color'];
      const bstyle = cs['border' + side + 'Style'];
      if (bstyle !== 'none' && parseFloat(bw) > 0) {
        const k = bw + ' ' + bc;
        borderMap[k] = borderMap[k] || { count: 0 };
        borderMap[k].count++;
      }
    }
    if (el.tagName === 'svg' || el.namespaceURI === 'http://www.w3.org/2000/svg') {
      const f = cs.fill;
      if (f && f !== 'none') {
        fillMap[f] = fillMap[f] || { count: 0 };
        fillMap[f].count++;
      }
      const st = cs.stroke;
      if (st && st !== 'none') {
        fillMap['stroke:' + st] = fillMap['stroke:' + st] || { count: 0 };
        fillMap['stroke:' + st].count++;
      }
    }
  }
  const sortByArea = (m) =>
    Object.entries(m)
      .map(([k, v]) => ({ value: k, ...v }))
      .sort((a, b) => (b.area || 0) - (a.area || 0) || b.count - a.count);

  /* ---- 4. spacing & bentuk ---- */
  const containers = {};
  for (const el of all) {
    const cs = getComputedStyle(el);
    if (cs.maxWidth && cs.maxWidth !== 'none') {
      containers[cs.maxWidth] = (containers[cs.maxWidth] || 0) + 1;
    }
  }
  const radii = {};
  const shadows = {};
  const gaps = {};
  for (const el of all) {
    const cs = getComputedStyle(el);
    if (cs.borderRadius && cs.borderRadius !== '0px') {
      radii[cs.borderRadius] = (radii[cs.borderRadius] || 0) + 1;
    }
    if (cs.boxShadow && cs.boxShadow !== 'none') {
      shadows[cs.boxShadow] = (shadows[cs.boxShadow] || 0) + 1;
    }
    if (cs.gap && cs.gap !== 'normal') gaps[cs.gap] = (gaps[cs.gap] || 0) + 1;
  }
  const secSpacing = sections.map((s) => ({ id: s.id || s.tag, padding: s.padding, height: s.height, bg: s.bg }));

  /* ---- 5. komponen ---- */
  const compStyle = (el) => {
    const cs = getComputedStyle(el);
    return {
      sel: sel(el),
      text: short(el.textContent),
      display: cs.display,
      bg: cs.backgroundColor,
      color: cs.color,
      border: `${cs.borderTopWidth} ${cs.borderTopStyle} ${cs.borderTopColor}`,
      radius: cs.borderRadius,
      padding: `${cs.paddingTop} ${cs.paddingRight} ${cs.paddingBottom} ${cs.paddingLeft}`,
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
      letterSpacing: cs.letterSpacing,
      textTransform: cs.textTransform,
      transition: cs.transition,
      size: `${Math.round(el.getBoundingClientRect().width)}x${Math.round(el.getBoundingClientRect().height)}`,
    };
  };
  const pick = (s, n = 3) => [...document.querySelectorAll(s)].slice(0, n);
  const components = {
    header: (() => {
      const h = document.querySelector('header:not(#hero), nav') || document.querySelector('header');
      if (!h) return null;
      const cs = getComputedStyle(h);
      return {
        sel: sel(h),
        cls: (typeof h.className === 'string' ? h.className : '').slice(0, 90),
        position: cs.position,
        top: cs.top,
        bg: cs.backgroundColor,
        backdrop: cs.backdropFilter,
        border: cs.borderBottom,
        links: [...h.querySelectorAll('a')].map((a) => ({ text: short(a.textContent), href: a.getAttribute('href') })).slice(0, 10),
        buttons: [...h.querySelectorAll('button')].map((b) => ({ text: short(b.textContent), aria: b.getAttribute('aria-label'), expanded: b.getAttribute('aria-expanded') })).slice(0, 6),
      };
    })(),
    buttons: pick('main a[class*="btn"], main a[class*="button"], main button, section a[class*="cta"], footer a[class*="btn"], a[class*="btn"]', 6).map(compStyle),
    chips: pick('[class*="chip"], [class*="tag"]', 6).map(compStyle),
    cards: pick('[class*="card"], [class*="Card"]', 6).map(compStyle),
    footer: (() => {
      const f = document.querySelector('footer');
      if (!f) return null;
      const cs = getComputedStyle(f);
      return {
        sel: sel(f),
        bg: cs.backgroundColor,
        color: cs.color,
        padding: `${cs.paddingTop} ${cs.paddingRight} ${cs.paddingBottom} ${cs.paddingLeft}`,
        links: [...f.querySelectorAll('a')].map((a) => ({ text: short(a.textContent), href: a.getAttribute('href') })).slice(0, 12),
        text: short(f.textContent),
      };
    })(),
  };

  /* ---- 6. breakpoint dari CSSOM ---- */
  const media = new Set();
  for (const sheet of document.styleSheets) {
    let rules;
    try {
      rules = sheet.cssRules;
    } catch (e) {
      continue; // cross-origin (font) — lewati
    }
    if (!rules) continue;
    const walk = (list) => {
      for (const r of list) {
        if (r.media && r.media.mediaText) media.add(r.media.mediaText);
        if (r.cssRules) walk(r.cssRules);
      }
    };
    walk(rules);
  }

  return {
    viewport: { w: window.innerWidth, h: window.innerHeight, dpr: window.devicePixelRatio },
    pageHeight: document.documentElement.scrollHeight,
    scrollWidth: document.documentElement.scrollWidth,
    sections,
    typography,
    palette: {
      backgrounds: sortByArea(bgMap).slice(0, 25),
      text: sortByArea(fgMap).slice(0, 25),
      borders: Object.entries(borderMap).map(([k, v]) => ({ value: k, count: v.count })).sort((a, b) => b.count - a.count).slice(0, 15),
      svgFills: Object.entries(fillMap).map(([k, v]) => ({ value: k, count: v.count })).sort((a, b) => b.count - a.count).slice(0, 20),
    },
    cssVariables: (() => {
      const out = {};
      for (const sheet of document.styleSheets) {
        let rules;
        try { rules = sheet.cssRules; } catch (e) { continue; }
        if (!rules) continue;
        for (const r of rules) {
          if (r.style && r.selectorText && /:root|html|body/.test(r.selectorText)) {
            for (const p of r.style) {
              if (p.startsWith('--')) out[p] = r.style.getPropertyValue(p).trim();
            }
          }
        }
      }
      return out;
    })(),
    spacing: {
      sectionSpacing: secSpacing,
      containerMaxWidths: Object.entries(containers).map(([k, v]) => ({ value: k, count: v })).sort((a, b) => b.count - a.count).slice(0, 10),
      radii: Object.entries(radii).map(([k, v]) => ({ value: k, count: v })).sort((a, b) => b.count - a.count).slice(0, 10),
      shadows: Object.entries(shadows).map(([k, v]) => ({ value: k, count: v })).sort((a, b) => b.count - a.count).slice(0, 10),
      gaps: Object.entries(gaps).map(([k, v]) => ({ value: k, count: v })).sort((a, b) => b.count - a.count).slice(0, 10),
    },
    components,
    mediaQueries: [...media].sort(),
    fontsLoaded: [...document.fonts].map((f) => `${f.family} ${f.weight} ${f.style} ${f.status}`),
    libs: {
      gsap: typeof window.gsap !== 'undefined' ? (window.gsap.version || 'yes') : null,
      scrollTrigger: typeof window.ScrollTrigger !== 'undefined' ? 'yes' : null,
      next: !!(window.__NEXT_DATA__ || document.querySelector('#__next, next-route-announcer')),
    },
  };
};

/* ------------------------------------------------------------- motion eval */
const COLLECT_MOTION = () => {
  const sel = (el) => {
    if (!el) return null;
    if (typeof el === 'string') return el;
    if (el === document.body) return 'body';
    if (el === document.documentElement) 'html';
    let s = el.tagName ? el.tagName.toLowerCase() : String(el);
    if (el.id) s += '#' + el.id;
    if (typeof el.className === 'string' && el.className.trim()) {
      s += '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.');
    }
    return s;
  };
  const g = window.gsap;
  const ST = window.ScrollTrigger;
  const out = { hasGsap: !!g, hasScrollTrigger: !!ST, triggers: [], globalAnimations: [] };
  if (ST) {
    out.triggers = ST.getAll().map((t) => {
      const anim = t.animation;
      let av = null;
      if (anim) {
        const vars = anim.vars || {};
        av = {
          duration: anim.duration ? anim.duration() : null,
          ease: vars.ease || null,
          delay: vars.delay || null,
          stagger: vars.stagger ? JSON.parse(JSON.stringify(vars.stagger)) : null,
          toProps: Object.keys(vars).filter((k) => !['ease', 'delay', 'stagger', 'duration', 'scrollTrigger', 'onComplete', 'onUpdate', 'onStart', 'onEnter', 'onLeave', 'onEnterBack', 'onLeaveBack', 'paused', 'overwrite', 'onRepeat', 'repeat', 'yoyo', 'immediateRender'].includes(k)),
          from: anim._startAt ? Object.keys(anim._startAt.vars || {}) : null,
        };
      }
      return {
        trigger: sel(t.trigger),
        start: t.start,
        end: t.end,
        scrub: t.scrub === true ? true : (typeof t.scrub === 'number' ? t.scrub : false || undefined),
        pin: !!t.pin,
        pinSpacing: t.pinSpacing,
        toggleActions: t.vars ? t.vars.toggleActions : null,
        once: t.vars ? t.vars.once : null,
        animation: av,
        targets: anim && anim.targets ? anim.targets().slice(0, 3).map(sel) : [],
      };
    });
  }
  if (g) {
    const walk = (parent, depth) => {
      if (depth > 2) return;
      for (const c of parent.getChildren(true, true, true)) {
        out.globalAnimations.push({
          type: c.constructor && c.constructor.name,
          duration: c.duration ? c.duration() : null,
          repeat: c.repeat ? c.repeat() : null,
          paused: c.paused ? c.paused() : null,
          targets: c.targets ? c.targets().slice(0, 2).map(sel) : [],
          keys: c.vars ? Object.keys(c.vars).filter((k) => !k.startsWith('on')).slice(0, 12) : [],
        });
        if (c.getChildren) walk(c, depth + 1);
      }
    };
    try { walk(g.globalTimeline, 0); } catch (e) { out.globalWalkError = String(e); }
    out.globalAnimations = out.globalAnimations.slice(0, 80);
  }
  return out;
};

/* ----------------------------------------------------------------- helpers */
async function warmAndShoot(page, w, h, tag) {
  await page.setViewportSize({ width: w, height: h });
  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForFunction(() => !!window.gsap, null, { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(SHOTS, `${w}-fold.png`) });

  // scroll bertahap agar semua trigger ScrollTrigger menyala, lalu kembali ke atas
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  const step = Math.floor(h * 0.75);
  for (let y = 0; y < total; y += step) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(90);
  }
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(600);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(SHOTS, `${w}-full.png`), fullPage: true });
}

async function main() {
  const browser = await chromium.launch();
  const report = { shots: [], design: [] };

  for (const { w, h } of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    await warmAndShoot(page, w, h);

    if (w === 390 || w === 1440) {
      const data = await page.evaluate(COLLECT);
      fs.writeFileSync(path.join(EXTRACT, `design-${w}.json`), JSON.stringify(data, null, 2));
      report.design.push({ w, sections: data.sections.length, pageHeight: data.pageHeight, scrollWidth: data.scrollWidth, overflow: data.scrollWidth > w, media: data.mediaQueries.length });
    }
    if (w === 390) {
      // menu mobile: buka, screenshot, tutup
      const btn = await page.$('header button[aria-expanded], header button[aria-controls], header nav button, header button');
      if (btn) {
        await btn.click().catch(() => {});
        await page.waitForTimeout(600);
        await page.screenshot({ path: path.join(SHOTS, '390-menu.png') });
        await page.keyboard.press('Escape').catch(() => {});
        await page.waitForTimeout(400);
      } else {
        report.shots.push('390: menu toggle tidak ditemukan');
      }
    }
    report.shots.push(`${w}-fold/full OK`);
    await ctx.close();
  }

  // motion (sekali, di 1440 setelah scroll penuh agar trigger terinisialisasi)
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForFunction(() => !!window.gsap && !!window.ScrollTrigger, null, { timeout: 15000 });
  await page.evaluate(async () => {
    const total = document.documentElement.scrollHeight;
    for (let y = 0; y < total; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 40));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 300));
  });
  const motion = await page.evaluate(COLLECT_MOTION);
  fs.writeFileSync(path.join(EXTRACT, 'motion.json'), JSON.stringify(motion, null, 2));

  // state hover (hanya elemen yang punya :hover bergaya) — desktop
  const hoverProbe = await page.evaluate(() => {
    const out = [];
    const els = [...document.querySelectorAll('header a, main a[class*="btn"], main a[class*="button"], section a, footer a, button')].slice(0, 14);
    for (const el of els) {
      const cs = getComputedStyle(el);
      out.push({
        text: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40),
        tag: el.tagName + (typeof el.className === 'string' && el.className ? '.' + el.className.trim().split(/\s+/)[0] : ''),
        base: { color: cs.color, bg: cs.backgroundColor, border: cs.borderColor, transform: cs.transform, textDecoration: cs.textDecorationLine, transition: cs.transition.slice(0, 80) },
      });
    }
    return out;
  });
  // hover aktual via Playwright untuk beberapa target
  const hoverResults = [];
  const targets = await page.$$('header a, a[class*="btn"], section a[href], footer a[href]');
  for (let i = 0; i < Math.min(targets.length, 8); i++) {
    const t = targets[i];
    try {
      const before = await t.evaluate((el) => {
        const cs = getComputedStyle(el);
        return { color: cs.color, bg: cs.backgroundColor, transform: cs.transform, textDecoration: cs.textDecorationLine };
      });
      await t.hover({ force: true });
      await page.waitForTimeout(450);
      const after = await t.evaluate((el) => {
        const cs = getComputedStyle(el);
        return { color: cs.color, bg: cs.backgroundColor, transform: cs.transform, textDecoration: cs.textDecorationLine };
      });
      const txt = await t.evaluate((el) => (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40));
      const changed = JSON.stringify(before) !== JSON.stringify(after);
      hoverResults.push({ text: txt, changed, before, after });
    } catch (e) {
      /* lewati elemen tak terjangkau */
    }
  }
  fs.writeFileSync(path.join(EXTRACT, 'components-hover.json'), JSON.stringify({ base: hoverProbe, hoverPairs: hoverResults }, null, 2));
  await ctx.close();

  await browser.close();
  console.log(JSON.stringify(report, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
