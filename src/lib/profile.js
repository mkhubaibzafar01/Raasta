// Everything the form collects. Saved only in this browser (localStorage).
export const GOALS = [
  { id: 'parttime', label: 'Part-time job while I study' },
  { id: 'fulltime', label: 'Full-time job' },
  { id: 'labour', label: 'Skilled or manual work (labour)' },
  { id: 'freelance', label: 'Freelance / work from home' },
  { id: 'internship', label: 'Internship or first experience' },
];
export const EDU = [
  { id: 'none', label: 'No formal schooling', rank: 0 },
  { id: 'middle', label: 'Up to class 8', rank: 1 },
  { id: 'matric', label: 'Matric (class 10)', rank: 2 },
  { id: 'inter', label: 'Intermediate / A-levels', rank: 3 },
  { id: 'diploma', label: 'Technical diploma (DAE / vocational)', rank: 3 },
  { id: 'bachelor', label: "Bachelor's", rank: 4 },
  { id: 'master', label: "Master's", rank: 5 },
  { id: 'phd', label: 'PhD', rank: 6 },
];
export const EXPERIENCE = [
  { id: 0, label: 'None yet' },
  { id: 1, label: 'Less than 1 year' },
  { id: 2, label: '1 to 3 years' },
  { id: 3, label: 'More than 3 years' },
];
export const HOURS = [
  { id: 'lt10', label: 'Under 10 hours a week' },
  { id: '10-20', label: '10 to 20 hours' },
  { id: '20-40', label: '20 to 40 hours' },
  { id: '40+', label: 'Full time (40+)' },
];
export const ENGLISH = [
  { id: 0, label: 'None' },
  { id: 1, label: 'Basic' },
  { id: 2, label: 'Good' },
  { id: 3, label: 'Fluent' },
];
export const INTERESTS = [
  ['coding', 'Coding & computers'], ['design', 'Design & art'], ['writing', 'Writing & languages'],
  ['business', 'Business & selling'], ['teaching', 'Teaching'], ['gaming', 'Gaming & esports'],
  ['media', 'Video, photo & social media'], ['science', 'Science & maths'], ['health', 'Health & care'],
  ['agri', 'Farming & food'], ['building', 'Building & repair'], ['electric', 'Electric, solar & machines'],
  ['driving', 'Driving & delivery'], ['crafts', 'Tailoring & crafts'], ['sports', 'Sports & fitness'],
].map(([id, label]) => ({ id, label }));
export const TOOLS = [
  { id: 'phone', label: 'Smartphone' },
  { id: 'laptop', label: 'Laptop or computer' },
  { id: 'internet', label: 'Internet at home' },
  { id: 'bike', label: 'Motorbike or vehicle' },
];
export const MOBILITY = [
  { id: 'local', label: 'Only in my city' },
  { id: 'move', label: 'I can move to another city' },
  { id: 'remote', label: 'Remote / online work only' },
];
export const COUNTRIES = ['Pakistan', 'India', 'Bangladesh', 'United Kingdom', 'United States', 'Other'];
export const PK_CITIES = ['Okara', 'Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala', 'Hyderabad', 'Sargodha', 'Bahawalpur', 'Sahiwal', 'Pakpattan', 'Depalpur'];

export const EMPTY = {
  name: '', age: '', goal: 'parttime', hours: '10-20', edu: 'inter', studying: true,
  experience: 0, english: 1, interests: [], tools: ['phone'], mobility: 'local',
  country: 'Pakistan', city: '',
};

const KEY = 'raasta.profile.v1';
export function loadProfile() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : null;
  } catch { return null; }
}
export function saveProfile(p) {
  try { localStorage.setItem(KEY, JSON.stringify(p)); } catch { /* private mode */ }
}
export function clearProfile() {
  try { localStorage.removeItem(KEY); } catch { /* ignore */ }
}
export const eduRank = (id) => EDU.find((e) => e.id === id)?.rank ?? 0;

export function validate(p) {
  const errors = {};
  const age = Number(p.age);
  if (!Number.isInteger(age) || age < 14 || age > 70) errors.age = 'Enter your age, from 14 to 70.';
  if (!p.city.trim()) errors.city = 'Enter your city or town. Local results depend on it.';
  if (!p.interests.length) errors.interests = 'Pick at least one interest.';
  return errors;
}
