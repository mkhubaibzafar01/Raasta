const STEPS = [
  { to: '/plan', label: 'Tell us about you', short: 'Plan', h: 6, bg: 'bg-sky' },
  { to: '/jobs', label: 'Find work you can start', short: 'Jobs', h: 9, bg: 'bg-mint' },
  { to: '/study', label: 'Fund your studies', short: 'Study', h: 12, bg: 'bg-sun' },
  { to: '/contests', label: 'Win contests, get perks', short: 'Contests', h: 15, bg: 'bg-white' },
  { to: '/upcoming', label: 'Never miss a deadline', short: 'Upcoming', h: 18, bg: 'bg-ink text-white' },
];
export default function Home() {
  return (
    <main>
      <section className="max-w-6xl mx-auto px-4 pt-10 pb-6 grid lg:grid-cols-2 gap-10 items-end">
        <div>
          <h1 tabIndex={-1} className="text-[clamp(2.8rem,9vw,6.5rem)] font-extrabold leading-[0.9]">Every way to work starts with one step.</h1>
          <p className="mt-5 text-xl max-w-lg">Answer a few questions. Raasta shows jobs you can start now, scholarships you can apply for, and contests that match what you love.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#/plan" className="btn btn-sun text-lg">Build my plan, 3 minutes</a>
            <a href="#/upcoming" className="btn btn-ghost text-lg">See what is coming up</a>
          </div>
        </div>
        <nav aria-label="Your path" className="grid grid-cols-5 items-end gap-2 h-[22rem]">
          {STEPS.map((s, i) => (
            <a key={s.to} href={'#' + s.to} style={{ height: `${s.h * 0.95}rem`, animationDelay: `${i * 120}ms` }}
              className={`step-block ${s.bg} card no-underline text-inherit p-2 flex flex-col justify-between hover:-translate-y-1 transition-transform`}>
              <span className="font-display text-2xl font-extrabold">{i + 1}</span>
              <span className="text-xs sm:text-sm font-extrabold leading-tight">{s.short}</span>
            </a>
          ))}
        </nav>
      </section>

      <section className="max-w-6xl mx-auto px-4 mt-10 grid sm:grid-cols-2 gap-5">
        <div className="card p-6 bg-sky">
          <p className="font-display text-6xl font-extrabold">13%</p>
          <p className="mt-2 font-semibold">of young people aged 15 to 24 worldwide were unemployed in 2023. That is 64.9 million people.</p>
        </div>
        <div className="card p-6 bg-white">
          <p className="font-display text-6xl font-extrabold">20.4%</p>
          <p className="mt-2 font-semibold">of 15 to 24 year olds were not in employment, education or training. Two in three of them were young women.</p>
        </div>
        <p className="sm:col-span-2 text-sm">Source: <a className="underline" href="https://www.ilo.org/resource/news/number-youth-not-employment-education-or-training-neet-cause-concern" target="_blank" rel="noopener noreferrer">ILO, Global Employment Trends for Youth 2024</a>, released 12 August 2024.</p>
      </section>

      <section className="max-w-6xl mx-auto px-4 mt-14">
        <h2 className="text-3xl sm:text-5xl font-extrabold">Why people get stuck</h2>
        <div className="mt-6 grid md:grid-cols-3 gap-5">
          {[
            ['Information is scattered', 'Jobs are on one site, scholarships on ten others, contests on a few more. Nobody has time to check them all.'],
            ['Advice ignores your situation', 'A student in Okara and a graduate in Lahore need different next steps. Most lists treat them the same.'],
            ['Deadlines pass quietly', 'Many programmes open once a year. If you miss the window you wait twelve months.'],
          ].map(([t, d]) => (
            <div key={t} className="card p-5"><h3 className="text-xl font-extrabold">{t}</h3><p className="mt-2">{d}</p></div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 mt-14">
        <div className="card p-8 bg-mint">
          <h2 className="text-3xl sm:text-5xl font-extrabold max-w-2xl">Your age, your school level, your city, your interests. One plan.</h2>
          <a href="#/plan" className="btn btn-ink mt-6 text-lg">Start now. It is free.</a>
        </div>
      </section>
    </main>
  );
}
