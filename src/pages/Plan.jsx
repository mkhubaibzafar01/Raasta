import { useState } from 'react';
import { Page } from '../components/Shell.jsx';
import { GOALS, EDU, EXPERIENCE, HOURS, ENGLISH, INTERESTS, TOOLS, MOBILITY, COUNTRIES, PK_CITIES, EMPTY, saveProfile, clearProfile, validate } from '../lib/profile.js';
import { go } from '../lib/router.js';

const STEPS = ['About you', 'What you want', 'Education', 'Interests and tools', 'Where you live'];
const STEP_FIELDS = [['age'], [], [], ['interests'], ['city']];

function Radios({ legend, name, options, value, onChange }) {
  return (
    <fieldset className="mt-5">
      <legend className="font-extrabold mb-2">{legend}</legend>
      <div className="grid sm:grid-cols-2 gap-2">
        {options.map((o) => (
          <label key={o.id} className={`flex items-center gap-3 border-2 border-ink rounded-xl px-3 py-2.5 cursor-pointer ${String(value) === String(o.id) ? 'bg-sun text-white font-extrabold' : 'bg-white'}`}>
            <input type="radio" name={name} value={o.id} checked={String(value) === String(o.id)} onChange={() => onChange(o.id)} className="accent-ink w-4 h-4" />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
function Checks({ legend, options, values, onToggle, error }) {
  return (
    <fieldset className="mt-5">
      <legend className="font-extrabold mb-2">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const on = values.includes(o.id);
          return (
            <label key={o.id} className={`border-2 border-ink rounded-full px-4 py-2 cursor-pointer font-semibold ${on ? 'bg-mint font-extrabold' : 'bg-white'}`}>
              <input type="checkbox" className="sr-only" checked={on} onChange={() => onToggle(o.id)} />
              {on ? '✓ ' : ''}{o.label}
            </label>
          );
        })}
      </div>
      {error && <p role="alert" className="mt-2 font-extrabold text-berry">{error}</p>}
    </fieldset>
  );
}

export default function Plan({ profile, setProfile }) {
  const [p, setP] = useState(profile || EMPTY);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const set = (k, v) => setP((x) => ({ ...x, [k]: v }));
  const toggle = (k, id) => setP((x) => ({ ...x, [k]: x[k].includes(id) ? x[k].filter((i) => i !== id) : [...x[k], id] }));

  const next = () => {
    const all = validate(p);
    const mine = Object.fromEntries(Object.entries(all).filter(([k]) => STEP_FIELDS[step].includes(k)));
    setErrors(mine);
    if (Object.keys(mine).length) return;
    if (step < STEPS.length - 1) return setStep(step + 1);
    const clean = { ...p, age: Number(p.age), city: p.city.trim(), name: p.name.trim() };
    saveProfile(clean);
    setProfile(clean);
    go('/jobs');
  };
  const reset = () => { clearProfile(); setProfile(null); setP(EMPTY); setStep(0); };

  return (
    <Page title="Your plan starts here" intro="Five short steps. The more honest your answers, the better the matches.">
      <div className="card p-5 sm:p-8 max-w-3xl">
        <p className="font-extrabold" aria-live="polite">Step {step + 1} of {STEPS.length}: {STEPS[step]}</p>
        <div className="h-3 rounded-full border-2 border-ink bg-white mt-2 overflow-hidden" role="progressbar" aria-valuemin={1} aria-valuemax={STEPS.length} aria-valuenow={step + 1}>
          <div className="h-full bg-sun transition-all" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
        </div>

        <form onSubmit={(e) => { e.preventDefault(); next(); }} noValidate>
          {step === 0 && (
            <div>
              <label htmlFor="name" className="block font-extrabold mt-5">First name (optional)</label>
              <input id="name" value={p.name} maxLength={30} onChange={(e) => set('name', e.target.value)} className="mt-1 w-full border-2 border-ink rounded-xl px-4 py-3 bg-white" />
              <label htmlFor="age" className="block font-extrabold mt-5">Your age</label>
              <input id="age" inputMode="numeric" value={p.age} onChange={(e) => set('age', e.target.value.replace(/\D/g, '').slice(0, 2))} aria-invalid={!!errors.age} className="mt-1 w-32 border-2 border-ink rounded-xl px-4 py-3 bg-white" />
              {errors.age && <p role="alert" className="mt-2 font-extrabold text-berry">{errors.age}</p>}
            </div>
          )}
          {step === 1 && (
            <div>
              <Radios legend="What are you looking for?" name="goal" options={GOALS} value={p.goal} onChange={(v) => set('goal', v)} />
              <Radios legend="How many hours can you work?" name="hours" options={HOURS} value={p.hours} onChange={(v) => set('hours', v)} />
              <Radios legend="Where can you work?" name="mobility" options={MOBILITY} value={p.mobility} onChange={(v) => set('mobility', v)} />
            </div>
          )}
          {step === 2 && (
            <div>
              <Radios legend="Highest level you finished or are doing now" name="edu" options={EDU} value={p.edu} onChange={(v) => set('edu', v)} />
              <label className="flex items-center gap-3 mt-4 font-semibold">
                <input type="checkbox" checked={p.studying} onChange={(e) => set('studying', e.target.checked)} className="w-5 h-5 accent-ink" />
                I am still studying
              </label>
              <Radios legend="Work experience" name="exp" options={EXPERIENCE} value={p.experience} onChange={(v) => set('experience', Number(v))} />
              <Radios legend="Your English" name="eng" options={ENGLISH} value={p.english} onChange={(v) => set('english', Number(v))} />
            </div>
          )}
          {step === 3 && (
            <div>
              <Checks legend="What do you enjoy? Pick all that fit." options={INTERESTS} values={p.interests} onToggle={(id) => toggle('interests', id)} error={errors.interests} />
              <Checks legend="What do you have?" options={TOOLS} values={p.tools} onToggle={(id) => toggle('tools', id)} />
            </div>
          )}
          {step === 4 && (
            <div>
              <label htmlFor="country" className="block font-extrabold mt-5">Country</label>
              <select id="country" value={p.country} onChange={(e) => set('country', e.target.value)} className="mt-1 w-full border-2 border-ink rounded-xl px-4 py-3 bg-white">
                {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
              </select>
              <label htmlFor="city" className="block font-extrabold mt-5">City or town</label>
              <input id="city" list="cities" value={p.city} onChange={(e) => set('city', e.target.value)} aria-invalid={!!errors.city} placeholder="Okara" className="mt-1 w-full border-2 border-ink rounded-xl px-4 py-3 bg-white" />
              <datalist id="cities">{p.country === 'Pakistan' && PK_CITIES.map((c) => <option key={c} value={c} />)}</datalist>
              {errors.city && <p role="alert" className="mt-2 font-extrabold text-berry">{errors.city}</p>}
            </div>
          )}

          <div className="mt-8 flex gap-3 flex-wrap">
            {step > 0 && <button type="button" className="btn btn-ghost" onClick={() => setStep(step - 1)}>Back</button>}
            <button type="submit" className="btn btn-sun">{step === STEPS.length - 1 ? 'Show my results' : 'Next'}</button>
            {profile && step === 0 && <button type="button" className="btn btn-ghost" onClick={reset}>Clear my answers</button>}
          </div>
        </form>
      </div>
    </Page>
  );
}
