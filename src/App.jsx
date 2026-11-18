import { useEffect, useState } from 'react';
import { useRoute } from './lib/router.js';
import { loadProfile } from './lib/profile.js';
import { Nav, Footer } from './components/Shell.jsx';
import Home from './pages/Home.jsx';
import Plan from './pages/Plan.jsx';
import Jobs from './pages/Jobs.jsx';
import Study from './pages/Study.jsx';
import Contests from './pages/Contests.jsx';
import Upcoming from './pages/Upcoming.jsx';

export default function App() {
  const route = useRoute();
  const [profile, setProfile] = useState(loadProfile());
  useEffect(() => { document.querySelector('main h1')?.focus({ preventScroll: true }); }, [route]);
  const page = { '/': Home, '/plan': Plan, '/jobs': Jobs, '/study': Study, '/contests': Contests, '/upcoming': Upcoming }[route];
  const Page = page;
  return (
    <>
      <Nav route={route} />
      <Page profile={profile} setProfile={setProfile} />
      <Footer />
    </>
  );
}
