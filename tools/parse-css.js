/**
 * Parse CSS bundle clone → ringkasan breakpoint + spacing.
 * Jalankan: node tools/parse-css.js
 * Output: ref/extract/css-breakpoints.json + ringkasan stdout
 */
const fs = require('fs');
const path = require('path');

const CSSDIR = '/home/ken/Documents/alieffauzan-clone/webroot/_next/static/chunks';
const OUT = path.resolve(__dirname, '..', 'ref', 'extract');

let css = '';
for (const f of fs.readdirSync(CSSDIR).filter((f) => f.endsWith('.css'))) {
  css += fs.readFileSync(path.join(CSSDIR, f), 'utf8') + '\n';
}
console.log('total css bytes:', css.length);

/** Pecah jadi daftar aturan: {media, selector, decls} */
function parseRules(src) {
  const rules = [];
  // pertama pecah media block
  const mediaRe = /@media([^{]*)\{/g;
  let idx = 0;
  const stack = [];
  let m;
  // sederhana: cari @media ... { ... } dengan hitung kurung
  while ((m = mediaRe.exec(src))) {
    const start = m.index + m[0].length;
    let depth = 1, i = start;
    while (i < src.length && depth > 0) {
      if (src[i] === '{') depth++;
      else if (src[i] === '}') depth--;
      i++;
    }
    const inner = src.slice(start, i - 1);
    const media = m[1].trim();
    for (const r of splitRules(inner)) rules.push({ media, ...r });
    idx = i;
    mediaRe.lastIndex = i;
  }
  // sisa (tanpa media) — buang bagian dalam @media yang sudah diparse: parse global dengan hati-hati
  const withoutMedia = src.replace(/@media([^{]*)\{/g, (full) => {
    // tandai: kita akan parse global hanya di luar — pendekatan: parse semua, lalu filter yang media-nya ''
    return full;
  });
  for (const r of splitRules(withoutMedia)) {
    if (r.media === '') rules.push(r); // hanya aturan top-level (rule tanpa media); aturan di dalam @media ikut ter-hitung dobel? cegah:
  }
  return rules;
}

function splitRules(block) {
  const out = [];
  const re = /([^{}]+)\{([^{}]*)\}/g;
  let m;
  while ((m = re.exec(block))) {
    const selector = m[1].trim();
    if (!selector || selector.startsWith('@')) continue;
    out.push({ media: '', selector, decls: m[2].trim() });
  }
  return out;
}

// parse ulang dengan media terbawa
function parseAll(src) {
  const rules = [];
  let i = 0;
  const len = src.length;
  while (i < len) {
    const at = src.indexOf('@media', i);
    if (at === -1) {
      for (const r of splitRules(src.slice(i))) rules.push(r);
      break;
    }
    for (const r of splitRules(src.slice(i, at))) rules.push(r);
    // baca media block
    const braceOpen = src.indexOf('{', at);
    let depth = 1, j = braceOpen + 1;
    while (j < len && depth > 0) {
      if (src[j] === '{') depth++;
      else if (src[j] === '}') depth--;
      j++;
    }
    const media = src.slice(at + 6, braceOpen).trim();
    const inner = src.slice(braceOpen + 1, j - 1);
    for (const r of splitRules(inner)) rules.push({ ...r, media });
    i = j;
  }
  return rules;
}

const rules = parseAll(css);
console.log('rules:', rules.length);

const byMedia = {};
for (const r of rules) {
  const k = r.media || '(base)';
  (byMedia[k] = byMedia[k] || []).push(r);
}

const KEY_SEL = /\.(sec|comp|font-c|nav-link-item|sub-nav|btn|card|hero|toggle|scroller|marquee|footer|chip|tag|proj|cert|slider|quote|sticky|tools|about|experience)[^,{ ]*/i;

const summary = {};
for (const [media, list] of Object.entries(byMedia)) {
  const notables = list.filter((r) => KEY_SEL.test(r.selector) || /grid-template-columns|flex-direction|max-width|font-size|padding|gap|display\s*:\s*(none|flex|grid|block)/.test(r.decls));
  summary[media] = {
    total: list.length,
    samples: notables.slice(0, 60).map((r) => `${r.selector}{${r.decls}}`),
  };
}

// aturan spacing section (base)
const secRules = rules.filter((r) => r.media === '' && /(^|,)\s*\.sec[ ,{.:]/.test(r.selector + ' ') || (r.media === '' && /\.sec\b/.test(r.selector))).map((r) => `${r.selector}{${r.decls}}`);
const compRules = rules.filter((r) => r.media === '' && /\.comp\b/.test(r.selector)).map((r) => `${r.selector}{${r.decls}}`);
const ybase = rules.filter((r) => /--y-base|--max-w|--nav-height|--rounded/.test(r.decls)).map((r) => `${r.media} :: ${r.selector}{${r.decls}}`);

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'css-breakpoints.json'), JSON.stringify({ summary, secRules: [...new Set(secRules)], compRules: [...new Set(compRules)], ybase: [...new Set(ybase)] }, null, 2));

console.log('\n=== MEDIA QUERIES & ATURAN KUNCI ===');
for (const [media, s] of Object.entries(summary).sort()) {
  console.log(`\n--- @media ${media} (${s.total} rules) ---`);
  s.samples.slice(0, 28).forEach((x) => console.log('  ' + x.slice(0, 220)));
}
console.log('\n=== .sec BASE RULES ===');
[...new Set(secRules)].slice(0, 20).forEach((x) => console.log('  ' + x.slice(0, 240)));
console.log('\n=== TOKEN --y-base / --max-w ===');
[...new Set(ybase)].forEach((x) => console.log('  ' + x.slice(0, 200)));
