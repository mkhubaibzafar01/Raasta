import { useMemo, useState } from 'react';
import { Page, NeedProfile, ExtLink } from '../components/Shell.jsx';
import { rankRoles, searchLinks } from '../lib/match.js';
import { GOALS } from '../lib/profile.js';

export default function Jobs({ profile }) {
  const [all, setAll] = useState(false);
  const ranked = useMemo(() => (profile ? rankRoles(profile, all ? 40 : 8) : []), [profile, all]);
  if (!profile) return <Page title="Jobs for you"><NeedProfile /></Page>;
  const goal = GOALS.find((g) => g.id === profile.goal)?.label.toLowerCase();
  return (
    <Page title={`Jobs${profile.name ? ' for ' + profile.name : ''}`} intro={`Roles that suit you in ${profile.city}, looking for ${goal}. Each card explains the work, what employers ask for, and how to get your first one.`}>
      <div className="card p-4 bg-sun/20 mb-6 font-semibold">Never pay money to get a job. Real employers do not charge fees. “Pay to start” data-entry offers are a common scam.</div>
      <ul className="grid md:grid-cols-2 gap-6 list-none p-0">
        {ranked.map(({ role, why, gaps }, i) => (
          <li key={role.id} className="card p-5 flex flex-col">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-2xl font-extrabold">{role.title}</h2>
              {i < 3 && !all && <span className="chip bg-mint">Top match</span>}
            </div>
            <p className="mt-2">{role.does}</p>
            <div className="mt-3 flex flex-wrap gap-2">{why.map((w) => <span key={w} className="chip bg-sky">{w}</span>)}{gaps.map((g) => <span key={g} className="chip bg-sun/30">{g}</span>)}</div>
            <h3 className="mt-4 font-extrabold text-lg">What employers ask for</h3>
            <ul className="list-disc ml-5">{role.req.map((r) => <li key={r}>{r}</li>)}</ul>
            <h3 className="mt-4 font-extrabold text-lg">How to start</h3>
            <p>{role.start}</p>
            <div className="mt-auto pt-5">
              <p className="font-extrabold text-sm mb-2">Search live openings</p>
              <div className="flex flex-wrap gap-2">{searchLinks(role.query, profile).map((l) => <ExtLink key={l.name} href={l.url} className="btn btn-ghost !py-1.5 !px-3 !text-sm">{l.name}</ExtLink>)}</div>
            </div>
          </li>
        ))}
      </ul>
      <button className="btn btn-ink mt-8" onClick={() => setAll(!all)}>{all ? 'Show top matches only' : 'Show all roles'}</button>
      <p className="mt-4 text-sm max-w-2xl">These are role guides, not current vacancies. The buttons open live searches on each site for your city, so the openings you see are today’s.</p>
    </Page>
  );
}
