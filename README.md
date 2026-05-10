# Mini Wordle

A standalone single-page Wordle clone. Originally built as a component inside my [portfolio](https://github.com/AnnieSzeto/portfolio); extracted here as its own Vite + React app.

## Stack

- Vite + React 19 (with the React Compiler enabled)
- TypeScript
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- [nanostores](https://github.com/nanostores/nanostores) with `persistentMap` — game state survives reloads via `localStorage`

## How it works

- A random 5-letter word is picked from `src/stores/words_alpha.txt` on first load (and on each reset).
- 6 guesses; each guess is graded letter-by-letter (correct / close / incorrect) with the same logic as Wordle, accounting for repeated letters.
- The on-screen keyboard mirrors the per-letter state.
- Game state (current row, previous guesses, keyboard colours) is persisted, so a refresh keeps your progress.

## Running

```sh
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc -b && vite build
npm run preview  # serve the production build
npm run lint
```

## Layout

```
src/
  components/      Wordle, WordleLine, WordleBox, WordleKeyboard, GameOverModal
                   types.ts, errors.ts, wordle.css
  stores/          nanostores wordle store + words_alpha.txt
  index.css        Tailwind theme tokens + base styles
  main.tsx
```

Path aliases `@stores/*` and `@components/*` are configured in `vite.config.ts` and mirrored in `tsconfig.app.json`.
