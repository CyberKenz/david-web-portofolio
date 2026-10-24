/**
 * Skrip kontras WCAG 2.1 AA — palet baru dari /home/ken/Downloads/src/index.css
 */
function luminance(r, g, b) {
  const s = (c) => { c = c / 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  return 0.2126 * s(r) + 0.7152 * s(g) + 0.0722 * s(b);
}
function contrast(a, b) {
  const L1 = luminance(...a), L2 = luminance(...b);
  const light = Math.max(L1, L2), dark = Math.min(L1, L2);
  return (light + 0.05) / (dark + 0.05);
}
function hexToRgb(h) { h = h.replace('#', ''); const bigint = parseInt(h, 16); return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255]; }

const C = {
  night: '#242323', nightDeep: '#1a1919', ink: '#242323',
  cream: '#f7efe3', creamDeep: '#eddfcc', paper: '#fffaf2',
  muted: '#6f675f', mutedDark: '#c9bfb3', hairline: '#d9cbb9', hairlineDark: '#4b4642',
  brand: '#eb6b10', brandDark: '#b94d06', brandDeep: '#a24305', brandSoft: '#ffb27a', brandWash: '#ffe3cf',
};

const pairs = [
  ['ink(#242323) di atas cream(#f7efe3)', C.ink, C.cream, 'normal'],
  ['ink(#242323) di atas paper(#fffaf2)', C.ink, C.paper, 'normal'],
  ['ink(#242323) di atas creamDeep(#eddfcc)', C.ink, C.creamDeep, 'normal'],
  ['muted(#6f675f) di atas cream(#f7efe3)', C.muted, C.cream, 'normal'],
  ['muted(#6f675f) di atas paper(#fffaf2)', C.muted, C.paper, 'normal'],
  ['cream(#f7efe3) di atas night(#242323)', C.cream, C.night, 'normal'],
  ['cream(#f7efe3) di atas brand(#eb6b10)', C.cream, C.brand, 'normal'],
  ['mutedDark(#c9bfb3) di atas night(#242323)', C.mutedDark, C.night, 'normal'],
  ['night(#242323) di atas brand(#eb6b10)', C.night, C.brand, 'large'],
  ['brand(#eb6b10) di atas night(#242323)', C.brand, C.night, 'large'],
  ['brand(#eb6b10) di atas cream(#f7efe3)', C.brand, C.cream, 'large'],
  ['brandDeep(#a24305) di atas cream(#f7efe3)', C.brandDeep, C.cream, 'normal'],
  ['brandDark(#b94d06) di atas cream(#f7efe3)', C.brandDark, C.cream, 'normal'],
  ['paper(#fffaf2) di atas night(#242323)', C.paper, C.night, 'normal'],
];

let fail = 0;
console.log('WCAG 2.1 AA kontras (normal ≥4.5, besar/UI ≥3):');
console.log('| Pasangan | Rasio | Ambang | Status |');
console.log('|---|---|---|---|');
for (const [name, fg, bg, kind] of pairs) {
  const ratio = contrast(hexToRgb(fg), hexToRgb(bg));
  const threshold = kind === 'normal' ? 4.5 : 3;
  const ok = ratio >= threshold;
  if (!ok) fail++;
  console.log(`| ${name} | ${ratio.toFixed(2)}:1 | ${threshold}:1 | ${ok ? '✓ LULUS' : '✗ GAGAL'} |`);
}
console.log(`\nRingkasan: ${pairs.length - fail}/${pairs.length} lulus, ${fail} gagal.`);
process.exit(fail ? 1 : 0);
