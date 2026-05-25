# sermo-survey-builder

A physician survey builder prototype built for the Sermo take-home assignment. React + Vite, TypeScript, Tailwind CSS. Runs locally with one command.

## Stack

| Layer | Choice |
|---|---|
| Frontend | React 18 + Vite |
| Language | TypeScript |
| Styling | Tailwind CSS + CSS custom properties (dark/light mode) |
| State | React context (`SurveyContext`, `ThemeContext`, `SessionContext`) |
| Storage | Firebase Firestore (`src/lib/storage.ts`) |
| Session | `sessionStorage` + mock auth token (`src/lib/session.ts`) |
| Routing | React Router v6 (`/builder`, `/preview/:id`, `/respond/:id`) |

## Getting Started

```bash
git clone <repo-url>
cd sermo-survey-builder
npm install
```

Copy the environment file and fill in your Firebase project credentials:

```bash
cp .env.local.example .env.local   # then edit with your values
npm run dev
# → http://localhost:5173
```

### Firebase environment variables

| Variable | Where to find it |
|---|---|
| `VITE_FIREBASE_API_KEY` | Firebase console → Project settings → General → Web API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | `<project-id>.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Firebase console → Project settings → General → Project ID |

```bash
npm run build   # production build + type check
npm run lint    # ESLint
npm run test    # Vitest test suite
```

## Routes

| Route | Purpose |
|---|---|
| `/` | Redirect to `/builder` |
| `/builder` | Survey builder (three-panel layout) |
| `/builder/:surveyId` | Edit an existing survey |
| `/preview/:surveyId` | Builder-side preview mode |
| `/respond/:surveyId` | Mobile-optimized respondent view (shareable link) |

## Firestore setup

Deploy the security rules before going live:

```bash
firebase deploy --only firestore:rules
```

The rules file is at [`firestore.rules`](./firestore.rules).

---

> ⚠️ **Security gap — must fix before production**
>
> `firestore.rules` currently allows **open read/write** on the `surveys` collection (`allow read, write: if true`). This is intentional for the proof-of-concept phase — no auth layer exists yet.
>
> Before any real deployment or user-facing launch, the Firestore rules **must** be tightened. Recommended next steps:
> 1. Add Firebase Authentication (Google or email/link sign-in)
> 2. Scope reads to the survey owner: `allow read: if request.auth.uid == resource.data.ownerId`
> 3. Scope writes to authenticated users only: `allow write: if request.auth != null`
> 4. Add rate-limiting and size validation rules
>
> See the [Firestore security rules docs](https://firebase.google.com/docs/firestore/security/get-started) for reference.
