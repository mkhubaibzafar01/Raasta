import { useEffect, useMemo, useState } from 'react';
import { Page, ExtLink } from '../components/Shell.jsx';
import { SCHOLARSHIPS, COMPETITIONS } from '../data/opportunities.js';
import { windowStatus, matchScholarships } from '../lib/opps.js';

const KEY = 'raasta.reminders.v1';
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
export const daysLeft = (iso, now = new Date()) => Math.ceil((new Date(iso + 'T23:59:59') - now) / 86400000);

export default function Upcoming({ profile }) {
  const [rem, setRem] = useState(load);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(rem)); } catch { /* ignore */ } }, [rem]);

  const items = useMemo(() => {
    const sch = profile ? matchScholarships(SCHOLARSHIPS, profile) : SCHOLARSHIPS;
    const comps = profile ? COMPETITIONS.filter((c) => c.tags.some((t) => profile.interests.includes(t))) : COMPETITIONS;
    return [...sch, ...comps].map((x) => ({ ...x, st: windowStatus(x.window) }));
  }, [profile]);
  const open = items.filter((i) => i.st.state === 'open');
  const soon = items.filter((i) => i.st.state === 'soon').sort((a, b) => a.st.monthsAway - b.st.monthsAway);
  const rolling = items.filter((i) => i.st.state === 'rolling');
  const unknown = items.filter((i) => i.st.state === 'unknown');

  const add = (e) => {
    e.preventDefault();
    if (!title.trim() || !date) return;
    setRem([...rem, { id: Date.now(), title: title.trim(), date }].sort((a, b) => a.date.localeCompare(b.date)));
    setTitle(''); setDate('');
  };
  const Group = ({ heading, list, note }) => list.length === 0 ? null : (
    <section className="mt-10">
      <h2 className="text-3xl font-extrabold">{heading}</h2>
      {note && <p className="mt-1">{note}</p>}
      <ul className="mt-4 grid md:grid-cols-2 gap-4 list-none p-0">
        {list.map((i) => (
          <li key={i.id} className="card p-4 flex items-center justify-between gap-3">
            <div><h3 className="text-lg font-extrabold">{i.name}</h3><p className="text-sm">{i.st.label}</p></div>
            <ExtLink href={i.url} className="btn btn-ghost !py-1.5 !px-3 !text-sm shrink-0">Open</ExtLink>
          </li>
        ))}
      </ul>
    </section>
  );

  return (
    <Page title="Upcoming" intro="What is open, what opens next, and your own deadlines in one place.">
      <section className="card p-5 bg-sky">
        <h2 className="text-2xl font-extrabold">My deadlines</h2>
        <form onSubmit={add} className="mt-3 flex flex-wrap gap-3 items-end">
          <div><label htmlFor="rt" className="block font-extrabold text-sm">What</label><input id="rt" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={60} placeholder="Chevening application" className="border-2 border-ink rounded-xl px-3 py-2 bg-white w-64 max-w-full" /></div>
          <div><label htmlFor="rd" className="block font-extrabold text-sm">Date</label><input id="rd" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border-2 border-ink rounded-xl px-3 py-2 bg-white" /></div>
          <button className="btn btn-sun" type="submit">Add deadline</button>
        </form>
        {rem.length === 0 ? <p className="mt-4">No deadlines yet. Add one from the official site’s page.</p> : (
          <ul className="mt-4 grid gap-2 list-none p-0">
            {rem.map((r) => { const d = daysLeft(r.date); return (
              <li key={r.id} className="bg-white border-2 border-ink rounded-xl px-4 py-2 flex items-center justify-between gap-3">
                <span className="font-semibold">{r.title}</span>
                <span className={`font-extrabold ${d < 0 ? 'text-berry' : d <= 14 ? 'text-sun' : ''}`}>{d < 0 ? 'Passed' : d === 0 ? 'Today' : `${d} day${d === 1 ? '' : 's'} left`}</span>
                <button className="underline text-sm" onClick={() => setRem(rem.filter((x) => x.id !== r.id))} aria-label={`Remove ${r.title}`}>Remove</button>
              </li>); })}
          </ul>
        )}
      </section>
      <Group heading="Usually open now" list={open} note="Based on typical timing from past years. Check the official site before you plan." />
      <Group heading="Opening soon" list={soon} />
      <Group heading="Open all year" list={rolling} />
      <Group heading="Dates vary" list={unknown} note="These programmes announce dates each year. Add the date to My deadlines once you know it." />
    </Page>
  );
}
