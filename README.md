# Raasta

Jobs, scholarships, contests and free perks matched to one person's age, education, interests and city.
React + Vite + Tailwind. No server, no API keys. Answers stay in the browser (localStorage).

## Run
    npm install
    npm run dev        # open the address it prints
    npm test           # 15 tests
    npm run build      # output in dist/

## Where things are
- src/pages: Home, Plan (the form), Jobs, Study, Contests, Upcoming
- src/data/jobs.js: 28 role guides. src/data/opportunities.js: scholarships, contests, perks
- src/lib/match.js: job scoring and live-search links. src/lib/opps.js: scholarship matching and application windows

## Honest limits (say these in the pitch)
- Jobs are role guides plus live search links. Raasta does not store vacancies.
- Application windows are typical past timings. Always verify on the official site.
- Stats on the home page: ILO, Global Employment Trends for Youth 2024.
- Next steps: live vacancy API, Urdu interface, test with real job seekers.
