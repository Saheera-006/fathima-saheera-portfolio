# Fathima Saheera — Portfolio

A React + TypeScript + Vite portfolio with the existing interactive character, cinematic journey, project archive, experience, skills, dedicated certificates page, and admin route preserved.

## Latest homepage updates

- Removed the certification preview/cards from the homepage. The separate `/certificates` page and the **CERTIFICATES** navigation link remain available.
- Changed the featured projects preview into a horizontal project rail. On desktop, a vertical mouse-wheel gesture over the rail moves it sideways; trackpads can scroll horizontally; mobile users can swipe. Keyboard users can focus the rail and use arrow keys. Normal vertical page scrolling works outside the rail.
- Kept the existing featured project data, project details modal, live-site notice, and full projects archive.
- Kept `esbuild` on `^0.28.2` to align with the Vite version's peer dependency requirements.

## Run locally

**Prerequisite:** Node.js and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (the dev script uses port `3000`).

## Build check

```bash
npm run build
npm run lint
```

Dependency installation could not be completed in the packaging environment, so run the commands above locally to install dependencies and verify the production build.

## Routes

- `/` — Home
- `/projects` — Full project archive
- `/certificates` — Dedicated certificates page
- `/admin` — Existing admin route

## Notes

- Do not commit private environment files. `.env*` files are excluded by `.gitignore`; use `.env.example` as a reference if environment variables are needed.
