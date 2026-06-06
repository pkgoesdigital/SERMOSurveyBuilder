 # CLAUDE.md

This file is the primary guide for any AI coding agent (Claude Code or otherwise) working in this repository. Read it fully before touching any file.

---

## Commands

```bash
npm run dev     # Start dev server → localhost:5173
npm run build   # Production build — also type-checks the project
npm run lint    # ESLint
npm run test    # Vitest (run once)
npm run test:watch  # Vitest in watch mode
```

`npm run build` is the primary correctness check. It must pass before any commit.

---

## Architecture Overview

```
src/
  question-types/       ← THE extension point. One file per question type.
    registry.ts         ← Single source of truth. Add a type here = system knows it exists.
    single-select.tsx
    multi-select.tsx
    numeric.tsx
    grid.tsx
  components/
    layout/
      AppShell.tsx       ← Three-panel shell (sidebar + canvas + properties)
      Sidebar.tsx        ← Question list, ordered, color-coded by type
      Canvas.tsx         ← Active question preview (full viewport, no scroll)
      PropertiesPanel.tsx ← Contextual editor for active question
    builder/
      QuestionRow.tsx    ← Single row in the sidebar list
      BranchingEditor.tsx ← "If answer to Qn is X, skip to Qm" rule builder
    respondent/
      RespondentView.tsx ← Mobile-optimized, auto-advance on answer
      QuestionRenderer.tsx ← Renders any question type by delegating to registry
    shared/
      ThemeToggle.tsx    ← Pill-shaped light/dark toggle (same pattern as web-waffle)
      ProgressBar.tsx
  contexts/
    SurveyContext.tsx    ← Active survey state + CRUD operations
    ThemeContext.tsx     ← light | dark, runtime only (no localStorage)
    SessionContext.tsx   ← Mock auth token + sessionStorage persistence
  lib/
    types.ts            ← ALL canonical types. Import from here, never define inline.
    storage.ts          ← Stubbed storage adapter. Swap internals for Firebase here.
    session.ts          ← Generates/reads mock session token from sessionStorage
    export.ts           ← Survey → JSON export logic
    branching.ts        ← Branching rule evaluation (used by RespondentView)
  styles/
    globals.css         ← CSS custom properties for both themes
    tailwind.css        ← Tailwind base import
  App.tsx
  main.tsx
```

---

## The #1 Rule for AI Agents: The Question Type Registry

**`src/question-types/registry.ts` is the single source of truth for all question types.**

The builder, canvas, properties panel, respondent view, and JSON export all derive behavior from this registry. You never need to edit those files to add a new question type.

### Registry contract

```ts
// src/question-types/registry.ts
export type QuestionTypeDefinition = {
  type: QuestionType                  // unique string key e.g. 'single-select'
  label: string                       // display name e.g. 'Single Select'
  icon: string                        // lucide icon name e.g. 'circle-dot'
  color: string                       // CSS custom property e.g. 'var(--type-color-single)'
  defaultQuestion: () => Question     // factory — returns a valid default question
  BuilderEditor: React.FC<EditorProps>     // renders the answer config in PropertiesPanel
  RespondentInput: React.FC<InputProps>    // renders the answer UI in RespondentView
  validate: (q: Question) => string[]      // returns array of error messages, [] if valid
  toExportShape: (q: Question) => object  // serializes to JSON export format
}

export const questionRegistry: QuestionTypeDefinition[] = [
  singleSelect,
  multiSelect,
  numeric,
  grid,
]
```

### How to add a 5th question type (e.g. Ranking)

1. Create `src/question-types/ranking.tsx`
2. Implement the `QuestionTypeDefinition` contract (all 8 fields)
3. Add `ranking` to the `questionRegistry` array in `registry.ts`
4. Done. The builder sidebar, canvas, properties panel, respondent view, and JSON export all pick it up automatically.

**No other files need to change.**

---

## Types (`src/lib/types.ts`)

All canonical types live here. Never define survey-related types inline in components.

Key types:

```ts
type QuestionType = 'single-select' | 'multi-select' | 'numeric' | 'grid'

type Question = {
  id: string
  type: QuestionType
  text: string
  description?: string
  required: boolean
  options?: Option[]      // single-select, multi-select
  rows?: string[]         // grid
  columns?: string[]      // grid
  min?: number            // numeric
  max?: number            // numeric
}

type BranchingRule = {
  sourceQuestionId: string
  answerId: string        // the selected option id that triggers the rule
  targetQuestionId: string // skip to this question
}

type Survey = {
  id: string
  title: string
  questions: Question[]
  branchingRules: BranchingRule[]
  createdAt: string
  updatedAt: string
}
```

---

## Storage (`src/lib/storage.ts`)

The storage layer is a stub with a clean interface. Swap the internals for Firebase Firestore without touching any component.

```ts
// Current stub — stores in memory (Map)
export const storage = {
  saveSurvey: async (survey: Survey): Promise<void> => { ... },
  loadSurvey: async (id: string): Promise<Survey | null> => { ... },
  listSurveys: async (): Promise<Survey[]> => { ... },
}
// To wire Firebase: replace the Map operations with Firestore calls.
// The interface (function signatures) must not change.
```

---

## Session (`src/lib/session.ts`)

Generates a UUID mock auth token on first load, persists it in `sessionStorage`. On connection loss recovery, `SessionContext` reads this token to restore survey progress.

```ts
export const getSessionToken = (): string => {
  const existing = sessionStorage.getItem('sermo_session_token')
  if (existing) return existing
  const token = crypto.randomUUID()
  sessionStorage.setItem('sermo_session_token', token)
  return token
}
```

---

## Theme System

Runtime-only dark/light toggle. No `localStorage` — resets on reload.

- `ThemeContext` exposes `theme: 'light' | 'dark'` and `toggleTheme()`
- `data-theme="dark"` on `<html>` activates CSS variable overrides in `globals.css`
- All colors via `var(--color-*)` — never hardcode colors in components
- `ThemeToggle` is a pill-shaped switch, present in both the builder toolbar and the respondent view header

Dark mode CSS variables mirror the web-waffle pattern:

```css
:root {
  --color-bg: #F9F8F6;
  --color-surface: #FFFFFF;
  --color-text: #1a1a2e;
  --color-text-muted: #494f59;
  --color-accent: #14857b;
  --color-border: #e2e8f0;
}
[data-theme="dark"] {
  --color-bg: #18181f;
  --color-surface: #1f1f28;
  --color-text: #c8c8d2;
  --color-text-muted: #858595;
  --color-accent: #1eb8ab;
  --color-border: #2d2d3a;
}
```

---

## Builder UI Layout

Three fixed panels — no page scroll in the builder.

```
┌─────────────────────────────────────────────────────────────┐
│  TOOLBAR: [breadcrumb]  [Builder|Preview|Share]  [Export] [Toggle] │
├──────────────┬──────────────────────────┬────────────────────┤
│   SIDEBAR    │        CANVAS            │   PROPERTIES       │
│   ~220px     │     flex-1 (fills)       │     ~260px         │
│              │                          │                    │
│  Q1 ████ … │  ┌──────────────────────┐ │  Question type     │
│  Q2 ████ … │  │                      │ │  [Single Select ▾] │
│  Q3 ████ … │  │  Question text large │ │                    │
│  Q4 ████ … │  │  renders here,       │ │  Required  ●       │
│             │  │  centered, immersive │ │                    │
│  + Add      │  │                      │ │  Options           │
│             │  │  [ A ] [ B ] [ C ]   │ │  [Option 1      ]  │
│  ── Ending─ │  │                      │ │  [Option 2      ]  │
│  [Thank you]│  └──────────────────────┘ │  + Add option      │
│             │                          │                    │
│             │                          │  ── Branching ──   │
│             │                          │  [+ Add rule]      │
└─────────────┴──────────────────────────┴────────────────────┘
```

---

## Respondent View

Route: `/respond/:surveyId`

- Mobile-first, full-screen, one question per screen
- **Auto-advance**: selecting an answer immediately advances to the next question (no "Next" button needed for single-select)
- Multi-select and grid require explicit "Continue" button
- Progress bar at top (not bottom)
- Dark/light toggle in header
- Session state (current question index + answers) written to `sessionStorage` on every answer — connection loss recovery is automatic on reload

---

## Non-Negotiables

1. Every new source file gets a companion `.test.ts` / `.test.tsx` spec file
2. No hardcoded colors — use `var(--color-*)` only
3. No new question types without updating `registry.ts`
4. The `storage.ts` interface (function signatures) must never change — only internals
5. `npm run build` must pass before any commit
6. All interactive elements: minimum 44×44px touch target (mobile-first)
7. ARIA labels on all controls (`aria-label`, `role`, `aria-checked` where applicable)
8. **Rules of Hooks — always enforced, never negotiated:**
   - All `useState`, `useEffect`, `useRef`, `useMemo`, `useCallback`, and any other hook calls must appear at the **top of the function body**, before any `if`, `return`, loop, or nested function.
   - Never place a hook call after a conditional early return. Guard clauses (`if (!x) return ...`) always come **after** all hook declarations.
   - Never call hooks inside event handlers, callbacks, or helper functions defined inside a component.
   - This rule is unconditional — no exceptions for "simple" cases or "obvious" guards. Code that violates it will not be written or accepted.

---

## Git Rules

- All work on `feature/<short-description>` branches
- Never commit directly to `main`
- One logical concern per commit
- Pre-commit: `npm run test` + `npm run build` must both pass
