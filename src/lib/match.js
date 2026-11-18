import { ROLES } from '../data/jobs.js';
import { eduRank } from './profile.js';

const HOURS_OK = { lt10: ['parttime', 'freelance', 'internship'], '10-20': ['parttime', 'freelance', 'internship'], '20-40': ['parttime', 'freelance', 'fulltime', 'internship', 'labour'], '40+': ['fulltime', 'labour', 'freelance'] };

/** Score one role for a profile. Returns { role, score, why, gaps }. */
export function scoreRole(role, p) {
  const why = [];
  const gaps = [];
  let score = 0;
  if (role.kinds.includes(p.goal)) { score += 4; why.push('Matches the kind of work you want'); }
  else if (HOURS_OK[p.hours]?.some((k) => role.kinds.includes(k))) { score += 1; }
  const hits = role.tags.filter((t) => p.interests.includes(t));
  if (hits.length) { score += hits.length * 2.5; why.push('Fits your interests'); }
  const have = new Set(p.tools);
  const missing = role.needs.filter((n) => !have.has(n));
  if (missing.length) { score -= missing.length * 2; gaps.push('You need: ' + missing.map((m) => ({ laptop: 'a laptop', internet: 'home internet', phone: 'a smartphone', bike: 'a motorbike' })[m]).join(', ')); }
  else if (role.needs.length) why.push('You already have the tools');
  const rank = eduRank(p.edu);
  if (rank < role.edu) { score -= 3 * (role.edu - rank); gaps.push('Usually needs more education than you have so far'); }
  if (Number(p.english) < role.english) { score -= 1.5; gaps.push('Needs better English'); }
  if (p.mobility === 'remote') { if (role.remote) { score += 2; why.push('Can be done online'); } else { score -= 4; gaps.push('Needs you on site'); } }
  if (p.experience >= 2 && role.kinds.includes('fulltime')) score += 0.5;
  return { role, score, why, gaps };
}

/** Ranked roles. Drops roles with strongly negative scores unless nothing else is left. */
export function rankRoles(p, limit = 12) {
  const all = ROLES.map((r) => scoreRole(r, p)).sort((a, b) => b.score - a.score);
  const good = all.filter((r) => r.score > 0);
  return (good.length >= 3 ? good : all).slice(0, limit);
}

const enc = encodeURIComponent;
/** Live search links. We link out; we do not copy listings. */
export function searchLinks(query, p) {
  const place = p.mobility === 'remote' ? 'remote' : p.city || p.country;
  const q = enc(query);
  const links = [
    { name: 'LinkedIn Jobs', url: `https://www.linkedin.com/jobs/search/?keywords=${q}&location=${enc(place)}` },
    { name: 'Indeed', url: `https://${p.country === 'Pakistan' ? 'pk' : p.country === 'India' ? 'in' : p.country === 'United Kingdom' ? 'uk' : p.country === 'Bangladesh' ? 'bd' : 'www'}.indeed.com/jobs?q=${q}&l=${enc(place)}` },
    { name: 'Google Jobs', url: `https://www.google.com/search?q=${enc(query + ' jobs ' + place)}&ibp=htl;jobs` },
  ];
  if (p.country === 'Pakistan') links.unshift({ name: 'Rozee.pk', url: `https://www.rozee.pk/job/jsearch/q/${q}` });
  if (p.mobility === 'remote' || p.goal === 'freelance') links.push({ name: 'Upwork', url: `https://www.upwork.com/nx/search/jobs/?q=${q}` });
  return links;
}
