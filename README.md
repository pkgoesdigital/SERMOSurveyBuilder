# sermo-survey-builder

A physician survey builder prototype built for the Sermo take-home assignment. React + Vite, TypeScript, Tailwind CSS. Runs locally with one command. No backend required for the prototype — storage is stubbed and ready to wire to Firebase Firestore.

## Stack

| Layer | Choice |
|---|---|
| Frontend | React 18 + Vite |
| Language | TypeScript |
| Styling | Tailwind CSS + CSS custom properties (dark/light mode) |
| State | React context (`SurveyContext`, `ThemeContext`, `SessionContext`) |
| Storage | Stubbed (`src/lib/storage.ts`) — swap in Firebase Firestore |
| Session | `sessionStorage` + mock auth token (`src/lib/session.ts`) |
| Routing | React Router v6 (`/builder`, `/preview/:id`, `/respond/:id`) |

## Getting Started

```bash
git clone <repo-url>
cd sermo-survey-builder
npm install
npm run dev
# → http://localhost:5173
```

```bash
npm run build   # production build + type check
npm run lint    # ESLint
npm run test    # Vitest test suite
```

No environment variables required to run locally. Storage is stubbed — surveys persist in memory for the session.

## Routes

| Route | Purpose |
|---|---|
| `/` | Redirect to `/builder` |
| `/builder` | Survey builder (three-panel layout) |
| `/builder/:surveyId` | Edit an existing survey |
| `/preview/:surveyId` | Builder-side preview mode |
| `/respond/:surveyId` | Mobile-optimized respondent view (shareable link) |
