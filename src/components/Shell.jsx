const LINKS = [
  ['/', 'Home'], ['/plan', 'My plan'], ['/jobs', 'Jobs'], ['/study', 'Study & scholarships'], ['/contests', 'Contests & perks'], ['/upcoming', 'Upcoming'],
];
export function Nav({ route }) {
  return (
    <header className="bg-white border-b-2 border-ink sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
        <a href="#/" className="font-display text-2xl font-extrabold no-underline text-ink shrink-0">Raasta<span className="text-sun">.</span></a>
        <nav aria-label="Main" className="flex gap-1 overflow-x-auto">
          {LINKS.map(([to, label]) => (
            <a key={to} href={'#' + to} aria-current={route === to ? 'page' : undefined}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-semibold no-underline ${route === to ? 'bg-ink text-white' : 'text-ink hover:bg-sky'}`}>{label}</a>
          ))}
        </nav>
      </div>
    </header>
  );
}
export function Footer() {
  return (
    <footer className="mt-16 bg-ink text-white">
      <div className="max-w-6xl mx-auto px-4 py-8 text-sm leading-relaxed">
        <p className="font-display text-xl font-extrabold">Raasta<span className="text-sun">.</span></p>
        <p className="mt-2 max-w-2xl">Raasta links you to real programmes and search pages. It does not run them. Always confirm requirements and dates on the official site. Never pay money to get a job or a scholarship.</p>
        <p className="mt-2 opacity-80">Your answers stay in this browser. Nothing is sent to a server.</p>
      </div>
    </footer>
  );
}
export function Page({ title, intro, children }) {
  return (
    <main className="max-w-6xl mx-auto px-4 pt-8">
      <h1 tabIndex={-1} className="text-4xl sm:text-6xl font-extrabold leading-[0.95]">{title}</h1>
      {intro && <p className="mt-3 text-lg max-w-2xl">{intro}</p>}
      <div className="mt-8">{children}</div>
    </main>
  );
}
export function NeedProfile() {
  return (
    <div className="card p-6 max-w-xl">
      <h2 className="text-2xl font-extrabold">Tell us about you first</h2>
      <p className="mt-2">Five short steps. Then this page shows only what fits you.</p>
      <a href="#/plan" className="btn btn-sun mt-4">Start my plan</a>
    </div>
  );
}
export function ExtLink({ href, children, className = 'btn btn-ink' }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" className={className}>{children}</a>;
}
