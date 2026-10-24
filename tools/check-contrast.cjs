/**
 * Skrip kontras WCAG 2.1 AA — semua pasangan teks/latar yang dipakai desain David.
 * Keluasan: normal text ≥ 4.5:1 ; large text (≥24px / ≥19px bold) & UI ≥ 3:1.
 * Sumber nilai: DESIGN.md §4 (client) + css-breakpoints.json / index.css (clone).
 * Output: tabel lulus/gagal + ringkasan.
 */
function luminance(r, g, b) {
  const s = (c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * s(r) + 0.7152 * s(g) + 0.0722 * s(b);
}
function contrast(a, b) {
  const L1 = luminance(...a), L2 = luminance(...b);
  const light = Math.max(L1, L2), dark = Math.min(L1, L2);
  return (light + 0.05) / (dark + 0.05);
}
function hexToRgb(h) {
  h = h.replace('#', '');
  const bigint = parseInt(h, 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

/* Palet yang terpakai di src/ (clone tokens + client tokens) */
const C = {
  /* clone */
  cloneBg: '#ffe9cf',
  cloneSurface: '#ffffff',
  cloneText: '#270f03',
  cloneMuted: '#555555',
  cloneLine: '#270f03',
  cloneWhite: '#fef8f1',
  cloneGreen: '#69e05f',
  cloneAlpha: 'rgba(249, 112, 40, 0.15)',
  /* client (DESIGN.md §4) */
  p100: '#fbe6d8',
  p400: '#ec8447',
  p500: '#e06928',
  p600: '#c4561a',
  p700: '#a8460f',
  s500: '#2e2c2a',
  s700: '#1d1b19',
  /* clone brand pink hover found in clone components-hover */
  clonePink: '#ff69b4',
  cloneNavWhite: '#fef8f1',
};

const pairs = [
  /* --- Teks normal (wajib ≥ 4.5:1) --- */
  ['cloneText(#270f03) di atas cloneBg(#ffe9cf)', C.cloneText, C.cloneBg, 'normal'],
  ['cloneText(#270f03) di atas cloneSurface(#fff)', C.cloneText, C.cloneSurface, 'normal'],
  ['cloneMuted(#555) di atas cloneBg(#ffe9cf)', C.cloneMuted, C.cloneBg, 'normal'],
  ['s500(#2e2c2a) di atas p100(#fbe6d8)', C.s500, C.p100, 'normal'],
  ['cloneWhite(#fef8f1) di atas cloneText(#270f03)', C.cloneWhite, C.cloneText, 'normal'],
  ['cloneWhite(#fef8f1) di atas s500(#2e2c2a)', C.cloneWhite, C.s500, 'normal'],
  ['p700(#a8460f) di atas cloneBg(#ffe9cf)', C.p700, C.cloneBg, 'normal'],
  ['p500(#e06928) di atas cloneWhite(#fef8f1)', C.p500, C.cloneWhite, 'normal'],
  ['clonePink(#ff69b4) di atas cloneBg(#ffe9cf)', C.clonePink, C.cloneBg, 'normal'],
  /* --- Teks besar / UI (wajib ≥ 3:1) --- */
  ['s700(#1d1b19) di atas p500(#e06928) [tombol primary]', C.s700, C.p500, 'large'],
  ['cloneText(#270f03) di atas p500(#e06928)', C.cloneText, C.p500, 'large'],
  ['cloneText(#270f03) di atas clonePink(#ff69b4)', C.cloneText, C.clonePink, 'large'],
  ['p500(#e06928) di atas s500(#2e2c2a)', C.p500, C.s500, 'large'],
  ['navWhite(#fef8f1) di atas cloneText(#270f03) [nav pill]', C.cloneNavWhite, C.cloneText, 'large'],
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
  console.log(
    `| ${name} | ${ratio.toFixed(2)}:1 | ${threshold}:1 | ${ok ? '✓ LULUS' : '✗ GAGAL'} |`
  );
}
console.log(`\nRingkasan: ${pairs.length - fail}/${pairs.length} lulus, ${fail} gagal.`);
process.exit(fail ? 1 : 0);
