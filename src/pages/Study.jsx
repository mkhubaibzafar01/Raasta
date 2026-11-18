import { useMemo, useState } from 'react';
import { Page, NeedProfile, ExtLink } from '../components/Shell.jsx';
import { SCHOLARSHIPS } from '../data/opportunities.js';
import { matchScholarships, windowStatus } from '../lib/opps.js';
import { EDU } from '../lib/profile.js';

export default function Study({ profile }) {
  const [kind, setKind] = useState('all');
  const [needOnly, setNeedOnly] = useState(false);
  const list = useMemo(() => (profile ? matchScholarships(SCHOLARSHIPS, profile) : []), [profile]);
  if (!profile) return <Page title="Study and scholarships"><NeedProfile /></Page>;
  const shown = list.filter((s) => (kind === 'all' || s.kind === kind) && (!needOnly || s.need));
  const edu = EDU.find((e) => e.id === profile.edu)?.label;
  return (
    <Page title="Fund your next level" intro={`Scholarships and free training that fit “${edu}” or the step after it. Where you can apply from depends on your country.`}>
      <div className="flex flex-wrap gap-2 items-center mb-6">
        {[['all', 'Everything'], ['scholarship', 'Scholarships'], ['training', 'Free training']].map(([id, label]) => (
          <button key={id} onClick={() => setKind(id)} aria-pressed={kind === id} className={`chip cursor-pointer ${kind === id ? 'bg-ink text-white' : ''}`}>{label}</button>
        ))}
        <label className="chip cursor-pointer"><input type="checkbox" className="mr-2 accent-ink" checked={needOnly} onChange={(e) => setNeedOnly(e.target.checked)} />Need-based only</label>
      </div>
      {shown.length === 0 && <div className="card p-6">Nothing matches these filters. Clear a filter above.</div>}
      <ul className="grid md:grid-cols-2 gap-6 list-none p-0">
        {shown.map((s) => {
          const w = windowStatus(s.window);
          return (
            <li key={s.id} className="card p-5 flex flex-col">
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="chip bg-sky">{s.kind === 'training' ? 'Free training' : 'Scholarship'}</span>
                <span className="chip">Study in: {s.study}</span>
                {s.need && <span className="chip bg-mint">Need-based</span>}
              </div>
              <h2 className="text-2xl font-extrabold">{s.name}</h2>
              <p className="text-sm font-semibold">{s.by}</p>
              <p className="mt-2">{s.sum}</p>
              <p className={`mt-3 font-extrabold ${w.state === 'open' ? 'text-emerald-700' : ''}`}>{w.label}</p>
              <div className="mt-auto pt-4"><ExtLink href={s.url}>Official site</ExtLink></div>
            </li>
          );
        })}
      </ul>
      <p className="mt-6 text-sm max-w-2xl">Application windows are typical timings from past years. Programmes change them. Confirm every date and rule on the official site.</p>
    </Page>
  );
}
