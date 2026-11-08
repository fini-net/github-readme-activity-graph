# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

An Express 5 + TypeScript service that renders a GitHub user's contribution history as an SVG line graph for embedding in READMEs. This is the `fini-net` fork of [Ashutosh00710/github-readme-activity-graph](https://github.com/Ashutosh00710/github-readme-activity-graph), kept alive because the upstream Vercel deployment is billing-locked (HTTP 402). Upstream links in `package.json` and `CONTRIBUTING.md` still point at the original repo.

## Commands

```sh
npm ci                      # install (lockfile is kept in sync; Dockerfile relies on npm ci)
npm run dev:start           # nodemon + ts-node on src/main.ts, port 5100 (or $PORT)
npm run build               # tsc -> dist/
npm start                   # node dist/main.js
npm run lint                # eslint 9 flat config (eslint.config.mjs), src/**/*.ts only
npm test                    # jest via ts-jest
npx jest __test__/utils.test.ts          # single test file
npx jest -t 'Theme testing'              # single test by name
npx jest -u                              # update snapshots after intentional SVG changes
markdownlint-cli2 "**/*.md"              # docs lint; config in .markdownlint-cli2.jsonc
```

A GitHub PAT must be in `.env` as `TOKEN=...` (see `.env.example`) for real fetches. CI (`.github/workflows/node.js.yml`) runs `npm ci`, `npm run lint`, `npm test` on Node 22.

## Architecture

Request flow for `GET /graph?username=...`:

1. `src/handlers.ts` — route handlers; any thrown error becomes an error SVG, never a 500.
2. `src/utils.ts` (`Utilities`) — parses and clamps query params (`days` 1–90, `ghosts` 0–6, `height` 200–600, `radius` 0–16, `from`/`to` custom ranges), resolves colors from the theme plus per-color overrides, then builds the final SVG and sets cache/CSP headers.
3. `src/fetcher.ts` (`Fetcher`) — one GitHub GraphQL request. The current window and every ghost window are aliased (`c0`, `c1`, …) into a single query. Returns `UserDetails` on success or a **string error message** on failure; callers branch on `typeof === 'object'`. Ghost windows are trimmed/zero-padded to align index-for-index with the current series.
4. `src/GraphCards.ts` (`Card`) — builds Chartist options and series. Ghost series are pushed *before* the current series so they paint behind it. `majorGridPlugin` adds `ct-grid-major` to gridlines at multiples of 20.
5. `src/createChart.ts` — wraps `node-chartist` internals (required by relative path into `node_modules/node-chartist/lib/`) to render the chart server-side.
6. `src/svgs.ts` + `src/styles/` — wrap the chart in the card SVG with inline CSS (`graphStyle.ts`), animations, and theme colors (`themes.ts`, a big `switch` on theme name).

`/data` returns the raw `UserDetails` JSON. `/` returns a trivial HTML heading (also the health check).

### Security invariants

User input is interpolated raw into SVG attributes, a `<style>` block, and XHTML inside `<foreignObject>`. Keep these intact when touching `utils.ts`:

- Colors must pass `sanitizeColor` (hex of length 3/4/6/8 only), else fall back to the theme.
- Titles must go through `escapeHtml`.
- `setHttpHeader` sets `Content-Security-Policy: script-src 'none'; sandbox` as defense in depth.

### Adding a theme

Add a case to `src/styles/themes.ts`, a matching entry in `__test__/fakeInputs.ts` plus an assertion (and bump `expect.assertions`) in `__test__/themes.test.ts`, list it in `README.md`/`THEMES.md`, and add a preview image under `asset/`. The root `index.html`/`script.js`/`styles.css` demo page keeps its own copy of theme colors in `script.js`; it is not served by Express.

### Tests

Tests live in `__test__/` (note: not `__tests__`). SVG output is covered by Jest snapshots in `__test__/__snapshots__/`, so any change to markup, CSS, or Chartist options will require `npx jest -u` and a review of the snapshot diff. GraphQL calls are mocked in `__test__/mockFunctions.ts`.

## Deployment

- Branches: `deploy` is this fork's working branch. Branch from it and open PRs against it, never `main`, which is left mirroring upstream to avoid merge conflicts. `deploy` is also what DigitalOcean App Platform builds (`deploy_on_push: true`), so merging a PR ships it.
- `Dockerfile` is a two-stage Node 20 build producing `dist/` and running as the `node` user on port 5100.
- `.do/app.yaml` is the App Platform spec, validated by `.github/workflows/validate-app-spec.yml`. Re-applying it with `doctl apps update --spec` without `--set-env TOKEN=...` blanks the secret and breaks `/graph`.
- `vercel.json` and the Replit files are upstream leftovers for those hosting options.
