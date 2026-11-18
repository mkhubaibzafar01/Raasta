import { useEffect, useState } from 'react';
export const ROUTES = ['/', '/plan', '/jobs', '/study', '/contests', '/upcoming'];
const read = () => {
  const p = window.location.hash.replace(/^#/, '') || '/';
  return ROUTES.includes(p) ? p : '/';
};
export function useRoute() {
  const [route, setRoute] = useState(read());
  useEffect(() => {
    const on = () => { setRoute(read()); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return route;
}
export const go = (p) => { window.location.hash = p; };
