# Spin Steam

A full-stack web app that connects to the [Steam Web API](https://steamcommunity.com/dev) to pull any public Steam profile's game library, then lets you explore it: browse and sort the full list, get random-pick suggestions when you can't decide what to play, see aggregate playtime stats, and browse a CS2 inventory.

Built as a personal project to practice a clean, decoupled full-stack architecture: a typed Express API wrapping Steam's quirks (two different auth schemes, undocumented edge cases, no CORS support) and a Vue 3 + Pinia frontend that only ever talks to its own backend.

**Stack:** Node.js / Express / TypeScript (backend) · Vue 3 / Pinia / Vite (frontend)

[![CI](https://github.com/Timdev0/steam-api/actions/workflows/ci.yml/badge.svg)](https://github.com/Timdev0/steam-api/actions/workflows/ci.yml)

**Live demo:** [steam.timdev0.com](https://steam.timdev0.com/)

---

## Features

- **Player lookup** — paste a SteamID64, a full profile URL, or a vanity name (e.g. `steamcommunity.com/id/<name>`); the backend resolves whichever one you give it.
- **Game library** — the player's full owned-games list, sortable by name or playtime, with an option to exclude free-to-play games.
- **Game roulette** — can't decide what to play? Get a random pick, scoped to all games / never-played games / games under 5 hours, with pick history and a reset.
- **Stats** — total playtime, total games, games never played, games under 5h, average and median playtime across the library.
- **CS2 inventory** — fetches a player's Counter-Strike 2 inventory from Steam's public inventory endpoint, merges Steam's split asset/description data into clean items, and groups visually-identical duplicates (e.g. 13 copies of the same case) into a single entry with a count instead of 13 separate cards.

## How it works

The backend is a thin, defensive layer in front of two very different Steam APIs:

- The official **Steam Web API** (`ISteamUser`, `IPlayerService`) — needs an API key, wraps every response in `{ response: {...} }`.
- The public, unauthenticated **Steam Community inventory endpoint** — no key needed, but splits an inventory into separate `assets` and `descriptions` arrays that have to be joined by hand, and signals a private inventory with an HTTP 200 and a literal `null` body instead of an error status.

Both get normalized into clean, typed shapes before anything reaches the frontend — the frontend never has to know Steam's APIs are inconsistent with each other. A few design choices worth calling out:

- **Decoupled types, on purpose.** The backend and frontend each keep their own TypeScript types for the same Steam data. Steam's API can change shape without forcing a frontend change, and vice versa — a deliberate anti-corruption layer rather than a shared-types shortcut.
- **In-memory TTL cache** on player summaries, owned games, and inventories (5 min), so repeated lookups and the two search calls a single search triggers don't double up on Steam calls — important since every visitor shares one Steam API key.
- **Per-IP rate limiting** (30 req/min) on every `/api` route, for the same reason.
- **Centralized error handling** via a custom `SteamApiError` that carries the real upstream status (e.g. distinguishing Steam's own 429 from a generic failure) instead of flattening everything to a 500.
- **Game registry pattern** for inventories (`constants/inventoryGames.ts`): adding support for another game is a one-line entry (appId + inventory context id), no new route or controller needed.

## Project structure

```
steam-api/
├── backend/                 # Express + TypeScript API
│   └── src/
│       ├── config/          # env loading & validation
│       ├── constants/       # game registry (appId/contextId per slug)
│       ├── controllers/     # request handling
│       ├── errors/          # SteamApiError
│       ├── middleware/      # rate limiter, centralized error handler
│       ├── routes/
│       ├── services/        # Steam API calls, caching, data normalization
│       ├── types/           # backend-only Steam API shapes
│       └── utils/
└── frontend/                 # Vue 3 + Pinia + Vite
    └── src/
        ├── components/      # presentational components
        ├── composables/     # e.g. useSteamSearch
        ├── services/        # fetch calls to the backend
        ├── stores/          # Pinia: player, games, inventory
        ├── types/           # frontend-only Steam API shapes
        └── utils/           # playtime formatting, inventory grouping...
```

## Getting started

### Prerequisites

- Node.js 22+
- A free [Steam Web API key](https://steamcommunity.com/dev/apikey)

### Backend

```bash
cd backend
npm install
cp .env.example .env   # fill in STEAM_API_KEY
npm run dev            # http://localhost:3000
```

### Frontend

```bash
cd frontend
npm install
npm run dev             # http://localhost:5173
```

No `.env` needed for local frontend dev — Vite's dev server proxies `/api` straight to `http://localhost:3000`. See `frontend/.env.example` for the `VITE_API_URL` override used in production builds.

### Scripts (run inside `backend/` or `frontend/`)

| Command | Backend | Frontend |
|---|---|---|
| `npm run dev` | watch mode (tsx) | Vite dev server |
| `npm run build` | compile to `dist/` | type-check + build |
| `npm test` | Vitest | Vitest |
| `npm run lint` | ESLint | oxlint + ESLint |

## Testing & CI

Both packages are covered with [Vitest](https://vitest.dev) unit tests — service-layer logic (merging Steam's split inventory data, caching, resolving a profile input), Pinia store behavior (cache invalidation on a new player search), and data-processing utilities (inventory grouping, playtime formatting).

Every push and PR to `main` runs through GitHub Actions ([`ci.yml`](.github/workflows/ci.yml)): lint, type-check, build, and test, for both packages independently.

## Deployment

- **Backend** — deployed on [Render](https://render.com). Required env vars: `STEAM_API_KEY`, `STEAM_API_URL`, `FRONTEND_URL` (comma-separated list of allowed CORS origins — supports multiple, e.g. a Vercel preview URL and a custom domain at once).
- **Frontend** — deployed on [Vercel](https://vercel.com), with `VITE_API_URL` pointed at the Render backend and a `vercel.json` rewrite rule for Vue Router's history mode.

## API overview

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/resolve?input=` | Resolves a SteamID64, profile URL, or vanity name to a SteamID64 |
| `GET` | `/api/player/:steamId` | Player summary (name, avatar, profile URL) |
| `GET` | `/api/player/:steamId/games` | Owned games (`?includeFreeGames=false` to exclude free games) |
| `GET` | `/api/player/:steamId/inventory/:game` | Inventory for a registered game slug (currently: `cs2`) |

## Possible next steps

- Estimated item pricing in the inventory view (sourced from an aggregated price list to avoid Steam Market's harsh unauthenticated rate limit).
- Support for more games in the inventory registry.
- Persisted inventory cache per game slug on the frontend, so switching tabs doesn't refetch.

## License

Personal project — not currently licensed for reuse.
