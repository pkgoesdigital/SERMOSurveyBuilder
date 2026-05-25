# Session Hand-off — Sermo Survey Builder

> Last session: 2026-05-25
> Branch: `claude/crazy-rosalind-67908c` (open PR: [#2](https://github.com/pkgoesdigital/SERMOSurveyBuilder/pull/2))

---

## What shipped this session

| # | Commit | What it does |
|---|---|---|
| 1 | `feat: inline question editing, save button, and theme toggle label` | Canvas heading became an auto-growing textarea wired to `updateQuestion`. Toolbar got a Save button with `idle → saving → saved` state machine. ThemeToggle now shows emoji + "Light/Dark Mode" label. |
| 2 | `feat: add per-question delete button in sidebar` | Trash icon fades in on row hover. Deleting the active question selects the adjacent question so PropertiesPanel never shows a ghost. |
| 3 | `feat: wire storage layer to Firebase Firestore` | `storage.ts` internals swapped from in-memory Map to Firestore (`setDoc` / `getDoc` / `getDocs` / `deleteDoc`). Adds `firebase.ts`, `vite-env.d.ts`, `.env.local.example`, `firestore.rules`, README updates. **Interface unchanged** — no consumer code touched. |
| 4 | `feat: add base64url-encoded share links as Firestore workaround` | Self-contained share URLs that carry the survey JSON in `?survey=`. Recipients respond on any device with zero backend. Toolbar `Share` button copies to clipboard with `Copied ✓` feedback. |

All checks green: `npm run build` ✓, `npm run test` ✓ (28/28).

---

## Open gaps — what to pick up first

### 🟥 1. Firestore credentials & security rules
**Owner action required.** Two things to do before Firebase actually works:

1. **Fill in `.env.local`** with your real Firebase project credentials. The file is gitignored; a template is at `.env.local.example`.
   ```
   VITE_FIREBASE_API_KEY=…
   VITE_FIREBASE_AUTH_DOMAIN=sermosurveybuilder.firebaseapp.com   (already set)
   VITE_FIREBASE_PROJECT_ID=sermosurveybuilder                     (already set)
   ```
2. **Deploy the open rules for now** so the PoC works end-to-end:
   ```bash
   firebase deploy --only firestore:rules
   ```
3. **Tighten rules before any real launch.** `firestore.rules` currently has `allow read, write: if true` scoped to `surveys/`. README has a prominent callout with the four-step remediation plan (add auth → scope reads to owner → scope writes to authenticated → add rate limiting).

### 🟧 2. `/respond/:surveyId` route is still a stub
The path-param respondent route ([`src/pages/RespondPage.tsx`](src/pages/RespondPage.tsx)) only handles the `?survey=` query-param share workaround today. When Firestore credentials land, add a `surveyId`-loading branch:

```tsx
// Inside RespondPage — pseudocode for the next session
const { surveyId } = useParams<{ surveyId: string }>()
if (surveyId && !encoded) {
  const [survey, setSurvey] = useState<Survey | null>(null)
  useEffect(() => {
    storage.loadSurvey(surveyId).then(setSurvey)
  }, [surveyId])
  …
}
```

This is the cleanest swap-in because the share workaround route stays as-is — old share links keep working forever.

### 🟧 3. Builder doesn't hydrate from storage
[`src/pages/BuilderPage.tsx`](src/pages/BuilderPage.tsx) always starts with an empty `SurveyProvider`. The `/builder/:surveyId` route exists in `App.tsx` but isn't wired to `storage.loadSurvey()`. When Firestore is live, add the hydrate-on-mount logic.

### 🟨 4. `/preview/:surveyId` is a stub
[`src/pages/PreviewPage.tsx`](src/pages/PreviewPage.tsx) just shows "Preview — coming soon". Low priority — the Share link already serves as a preview.

### 🟨 5. Bundle size warning
Firebase ships ~530 kB minified. Future optimization: lazy-load `firebase/firestore` only when storage is actually called. Not urgent.

---

## Architecture cheat-sheet for next session

| Want to add… | Touch only… |
|---|---|
| A 5th question type (e.g. Ranking) | `src/question-types/ranking.tsx` + add to `registry.ts` array. **Nothing else.** |
| A different storage backend | `src/lib/storage.ts` internals — the four function signatures must not change |
| A new respondent UI for an existing question type | The `RespondentInput` field of that type's definition file |
| A theme color tweak | `src/styles/globals.css` only — never hardcode colors in components |

The registry pattern (`src/question-types/registry.ts`) is the single source of truth — builder sidebar, canvas, properties panel, respondent view, and JSON export all derive behavior from it.

---

## Running the project

```bash
npm install
npm run dev          # → localhost:5173 (or next available port)
npm run build        # tsc + vite build — primary correctness check
npm run test         # vitest run
npm run lint         # eslint
```

### End-to-end smoke test
1. Open `/builder`
2. Set a title, add a few questions, edit text in the Canvas heading
3. Click **Share** → URL copied to clipboard
4. Open the copied URL in an incognito window → respondent flow works
5. (Once Firestore is live) Click **Save** → check the `surveys` collection in the Firebase console

---

## Notes & decisions for the inheriting engineer

- **Storage interface is sacred.** `saveSurvey`, `loadSurvey`, `listSurveys`, `deleteSurvey` signatures must never change. That's the contract that lets backend swaps stay local.
- **Two share modes coexist by design.** `/respond?survey=<base64url>` (works today, no backend) and `/respond/:surveyId` (Firestore-loaded, future). Old share links never break.
- **The sample JSON** at `src/data/surveys/sample_biosimilar_survey.json` is a faithful reference for the data shape — use it when seeding Firestore or testing the respondent view.
- **Tests are required on every new file.** See `CLAUDE.md` non-negotiable #1.
- **No hardcoded colors.** Always `var(--color-*)`. See `CLAUDE.md` non-negotiable #2.

---

## Quick links

- PR: https://github.com/pkgoesdigital/SERMOSurveyBuilder/pull/2
- Project guide: [`CLAUDE.md`](CLAUDE.md)
- README (with security gap callout): [`README.md`](README.md)
- Sample survey data: [`src/data/surveys/sample_biosimilar_survey.json`](src/data/surveys/sample_biosimilar_survey.json)
- Firestore rules (PoC): [`firestore.rules`](firestore.rules)
