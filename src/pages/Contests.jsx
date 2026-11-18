import { useMemo, useState } from 'react';
import { Page, NeedProfile, ExtLink } from '../components/Shell.jsx';
import { COMPETITIONS, PERKS } from '../data/opportunities.js';
import { matchByInterest, windowStatus } from '../lib/opps.js';
import { INTERESTS } from '../lib/profile.js';

export default function Contests({ profile }) {
  const [only, setOnly] = useState(true);
  const comps = useMemo(() => (profile ? matchByInterest(COMPETITIONS, profile) : []), [profile]);
  const perks = useMemo(() => (profile ? matchByInterest(PERKS, profile) : []), [profile]);
  if (!profile) return <Page title="Contests and perks"><NeedProfile /></Page>;
  const label = (id) => INTERESTS.find((i) => i.id === id)?.label;
  const showC = only ? comps.filter((c) => c.match) : comps;
  const showP = only ? perks.filter((c) => c.match) : perks;
  return (
    <Page title="Contests and perks" intro="Hackathons, game jams, tournaments and free tools picked from your interests. Winning or just entering gives you proof of skill for any job or scholarship.">
      <label className="chip cursor-pointer"><input type="checkbox" className="mr-2 accent-ink" checked={only} onChange={(e) => setOnly(e.target.checked)} />Only my interests</label>
      <h2 className="text-3xl font-extrabold mt-8">Contests and hackathons</h2>
      {showC.length === 0 && <div className="card p-6 mt-4">No match. Turn off “Only my interests” or add interests in <a className="underline" href="#/plan">My plan</a>.</div>}
      <ul className="grid md:grid-cols-2 gap-6 list-none p-0 mt-4">
        {showC.map((c) => (
          <li key={c.id} className="card p-5 flex flex-col">
            <div className="flex flex-wrap gap-2 mb-2"><span className="chip bg-sky">{c.kind}</span>{c.tags.filter((t) => profile.interests.includes(t)).map((t) => <span key={t} className="chip bg-mint">{label(t)}</span>)}</div>
            <h3 className="text-2xl font-extrabold">{c.name}</h3>
            <p className="text-sm font-semibold">{c.by}</p>
            <p className="mt-2">{c.sum}</p>
            <p className="mt-3 font-extrabold">{windowStatus(c.window).label}</p>
            <div className="mt-auto pt-4"><ExtLink href={c.url}>Open</ExtLink></div>
          </li>
        ))}
      </ul>
      <h2 className="text-3xl font-extrabold mt-12">Free tools and offers</h2>
      <ul className="grid md:grid-cols-3 gap-6 list-none p-0 mt-4">
        {showP.map((c) => (
          <li key={c.id} className="card p-5 flex flex-col">
            {c.student && <span className="chip bg-sun/30 self-start mb-2">For students</span>}
            <h3 className="text-xl font-extrabold">{c.name}</h3>
            <p className="mt-2">{c.sum}</p>
            <div className="mt-auto pt-4"><ExtLink href={c.url} className="btn btn-ghost !py-1.5 !px-3 !text-sm">Get it</ExtLink></div>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm max-w-2xl">Student offers need proof that you are a student. Terms change, so read the offer page before you sign up.</p>
    </Page>
  );
}
