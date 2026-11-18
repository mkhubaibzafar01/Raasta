import { describe, it, expect } from 'vitest';
import { rankRoles, scoreRole, searchLinks } from '../src/lib/match.js';
import { ROLES } from '../src/data/jobs.js';
import { matchScholarships, windowStatus, matchByInterest } from '../src/lib/opps.js';
import { SCHOLARSHIPS, COMPETITIONS, PERKS } from '../src/data/opportunities.js';
import { EMPTY, validate } from '../src/lib/profile.js';
import { daysLeft } from '../src/pages/Upcoming.jsx';

const base = { ...EMPTY, age: 19, city: 'Okara', interests: ['coding'], tools: ['phone', 'laptop', 'internet'], edu: 'inter', goal: 'freelance' };

describe('jobs', () => {
  it('ranks coding roles first for a coder who wants freelance', () => {
    const top = rankRoles(base, 3).map((r) => r.role.id);
    expect(top.some((id) => ['webdev', 'gamedev', 'datasci', 'dataentry'].includes(id))).toBe(true);
    expect(top).toContain('webdev');
  });
  it('flags missing tools and education gaps', () => {
    const r = scoreRole(ROLES.find((x) => x.id === 'datasci'), { ...base, tools: ['phone'], edu: 'matric' });
    expect(r.gaps.join(' ')).toMatch(/laptop/);
    expect(r.gaps.join(' ')).toMatch(/education/);
  });
  it('labour seekers see trades, not office roles, first', () => {
    const p = { ...base, goal: 'labour', edu: 'middle', interests: ['building'], tools: ['phone'] };
    const top = rankRoles(p, 3).map((r) => r.role.id);
    expect(top.some((id) => ['mason', 'electrician', 'factory', 'solar'].includes(id))).toBe(true);
  });
  it('remote-only people do not get on-site roles on top', () => {
    const top = rankRoles({ ...base, mobility: 'remote' }, 5);
    expect(top.every((r) => r.role.remote)).toBe(true);
  });
  it('always returns something, even for an odd profile', () => {
    expect(rankRoles({ ...EMPTY, interests: [], tools: [], edu: 'none', english: 0 }, 5).length).toBeGreaterThan(0);
  });
  it('builds Pakistan and remote search links', () => {
    const l = searchLinks('web developer', { ...base, mobility: 'remote' });
    expect(l[0].name).toBe('Rozee.pk');
    expect(l.some((x) => x.name === 'Upwork')).toBe(true);
    expect(l.every((x) => x.url.startsWith('https://'))).toBe(true);
  });
  it('every role has the fields the UI shows', () => {
    for (const r of ROLES) { expect(r.req.length).toBeGreaterThan(0); expect(r.kinds.length).toBeGreaterThan(0); expect(r.start).toBeTruthy(); }
  });
});

describe('opportunities', () => {
  it('a matric student sees training and inter-level scholarships', () => {
    const ids = matchScholarships(SCHOLARSHIPS, { ...base, edu: 'matric' }).map((s) => s.id);
    expect(ids).toContain('navttc');
    expect(ids).toContain('turkey');
  });
  it('a bachelor student sees master-level programmes', () => {
    const ids = matchScholarships(SCHOLARSHIPS, { ...base, edu: 'bachelor' }).map((s) => s.id);
    expect(ids).toContain('chevening');
    expect(ids).toContain('hec-need');
  });
  it('non-Pakistanis do not see Pakistan-only programmes', () => {
    const ids = matchScholarships(SCHOLARSHIPS, { ...base, country: 'India', edu: 'bachelor' }).map((s) => s.id);
    expect(ids).not.toContain('hec-need');
    expect(ids).toContain('daad');
  });
  it('gamers see gaming contests first', () => {
    const r = matchByInterest(COMPETITIONS, { ...base, interests: ['gaming'] });
    expect(r[0].tags).toContain('gaming');
    expect(matchByInterest(PERKS, { ...base, interests: ['gaming'] })[0].match).toBe(true);
  });
  it('window status handles inside, wrap-around, rolling and unknown', () => {
    expect(windowStatus([8, 11], new Date(2026, 9, 1)).state).toBe('open');
    expect(windowStatus([8, 11], new Date(2026, 4, 1))).toMatchObject({ state: 'soon', monthsAway: 3 });
    expect(windowStatus([11, 1], new Date(2026, 0, 10)).state).toBe('open');
    expect(windowStatus('rolling').state).toBe('rolling');
    expect(windowStatus(null).state).toBe('unknown');
  });
  it('every item has a safe https link', () => {
    for (const x of [...SCHOLARSHIPS, ...COMPETITIONS, ...PERKS]) expect(x.url).toMatch(/^https:\/\//);
  });
});

describe('profile and deadlines', () => {
  it('validates age, city and interests', () => {
    expect(Object.keys(validate({ ...EMPTY }))).toEqual(['age', 'city', 'interests']);
    expect(validate(base)).toEqual({});
  });
  it('counts days left', () => {
    expect(daysLeft('2026-11-20', new Date(2026, 10, 17, 9))).toBe(4);
    expect(daysLeft('2026-11-10', new Date(2026, 10, 17))).toBeLessThan(0);
  });
});
