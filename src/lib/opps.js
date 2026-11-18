import { eduRank } from './profile.js';

const ORDER = ['none', 'middle', 'matric', 'inter', 'bachelor', 'master', 'phd'];
const norm = (e) => (e === 'diploma' ? 'inter' : e);
export const nextLevel = (e) => ORDER[Math.min(ORDER.indexOf(norm(e)) + 1, ORDER.length - 1)];

/** Scholarships that fit: for the level you are in, or the one you are heading to. */
export function matchScholarships(list, p) {
  const here = p.edu === 'diploma' ? 'diploma' : p.edu;
  const targets = new Set([here, norm(here), nextLevel(here)]);
  return list
    .filter((s) => s.from === 'any' || p.country === 'Pakistan')
    .filter((s) => s.levels.some((l) => targets.has(l)))
    .sort((a, b) => Number(b.from === 'PK') - Number(a.from === 'PK') || Number(b.need) - Number(a.need));
}

export function matchByInterest(list, p) {
  const mine = new Set(p.interests);
  const s = (x) => x.tags.filter((t) => mine.has(t)).length;
  return list.map((x) => ({ x, n: s(x) })).sort((a, b) => b.n - a.n).map(({ x, n }) => ({ ...x, match: n > 0 }));
}

/** Month status against "now". window is [from,to] (may wrap), 'rolling' or null. */
export function windowStatus(win, now = new Date()) {
  if (win === 'rolling') return { state: 'rolling', label: 'Open all year' };
  if (!Array.isArray(win)) return { state: 'unknown', label: 'Dates vary. Check the site.' };
  const m = now.getMonth() + 1;
  const [a, b] = win;
  const inside = a <= b ? m >= a && m <= b : m >= a || m <= b;
  const name = (n) => new Date(2000, n - 1, 1).toLocaleString('en-US', { month: 'long' });
  if (inside) return { state: 'open', label: `Usually open now (${name(a)} to ${name(b)})`, monthsAway: 0 };
  const away = (a - m + 12) % 12;
  return { state: 'soon', label: `Usually opens in ${name(a)} (${away} month${away === 1 ? '' : 's'} away)`, monthsAway: away };
}
export { eduRank };
