# Voyager — Frontend

A modern travel planning app: create trips, build day-by-day itineraries,
track budgets, manage packing lists, discover destinations, and check live
weather and currency data — all in a clean, dark/light-mode React
interface.

## Tech Stack

- React 18 + Vite
- React Router (with protected routes)
- Context API (auth session + dark/light theme)
- Recoil (trips & wishlist global state)
- Custom hooks: `useFetch`, `useDebounce`, `useTrips`, `useWeather`,
  `useCurrency`, `useDestinationSearch`
- Plain CSS with a token-based design system (no framework)

## Project Structure

```
voyager-frontend/
├── src/
│   ├── api/
│   │   ├── axios.js           # backend axios instance + auth interceptor
│   │   ├── tripsApi.js        # backend endpoint wrappers
│   │   └── externalApi.js     # weather / currency / geocoding (public APIs)
│   ├── context/
│   │   ├── AuthContext.jsx    # session state via Context API
│   │   └── ThemeContext.jsx   # dark/light mode via Context API (Bonus 1)
│   ├── recoil/
│   │   └── atoms.js           # trips, wishlist, derived selectors
│   ├── hooks/
│   │   ├── useFetch.js
│   │   ├── useDebounce.js
│   │   ├── useTrips.js         # Bonus 2
│   │   ├── useWeather.js       # Bonus 2
│   │   ├── useCurrency.js      # Bonus 2
│   │   └── useDestinationSearch.js
│   ├── components/
│   │   ├── common/             # Loader, ErrorMessage, EmptyState, ErrorBoundary...
│   │   ├── layout/              # Navbar, AppLayout, ProtectedRoute
│   │   └── trips/                # TripCard, TripForm, ItineraryList,
│   │                              # BudgetPlanner, PackingChecklist,
│   │                              # WeatherWidget, CurrencyConverter,
│   │                              # DestinationSearchBox, WishlistCard, StatCard
│   ├── pages/
│   │   ├── Login.jsx / Register.jsx
│   │   ├── Dashboard.jsx        # travel stats (Bonus 3) + upcoming trips
│   │   ├── Trips.jsx / TripDetail.jsx
│   │   ├── Discover.jsx         # debounced search + weather + currency
│   │   ├── Wishlist.jsx
│   │   └── NotFound.jsx
│   ├── styles/index.css         # design tokens, dark & light themes
│   ├── App.jsx                  # routes & providers
│   └── main.jsx
├── .env.example
├── .eslintrc.cjs
├── .gitignore
├── index.html
├── package.json
└── vite.config.js
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

| Variable        | Description                              |
| --------------- | ----------------------------------------- |
| `VITE_API_URL`  | Base URL of the Voyager backend API        |

Make sure the [backend](../voyager-backend) is running first (default
`http://localhost:5000/api`).

### 3. Run the dev server

```bash
npm run dev
```

The app runs at `http://localhost:5173`.

### 4. Build for production

```bash
npm run build
npm run preview   # preview the production build locally
```

## Architecture notes

- **State management split**: Context API handles cross-cutting *app*
  concerns (who's logged in, which theme is active) that rarely change
  shape. Recoil handles *domain* data (trips, wishlist) that's fetched,
  mutated, and read from many different components — atoms hold the raw
  lists, selectors derive things like "upcoming trips" or "total budget"
  without recomputing logic in every component.
- **Custom hooks over inline effects**: `useFetch` centralizes loading /
  error / cancellation handling so pages don't duplicate `try/catch` +
  `AbortController` boilerplate. `useDebounce` + `useDestinationSearch`
  keep the search box from firing a network request on every keystroke.
  `useTrips`, `useWeather`, and `useCurrency` each pair one external data
  source with the state that depends on it.
- **External APIs, no key required**: destination search uses the
  [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api),
  weather uses [Open-Meteo Forecast](https://open-meteo.com/en/docs), and
  currency conversion uses [Frankfurter](https://frankfurter.dev/). All
  three are free, CORS-enabled, and called directly from the browser — no
  backend proxy or API key management needed.
- **Protected routes**: `ProtectedRoute` reads `useAuth()` and redirects
  unauthenticated users to `/login`, preserving the page they were trying
  to reach so they land back there after logging in.
- **Error handling**: a top-level `ErrorBoundary` catches render errors;
  `useFetch` and every page-level data call surface a friendly
  `ErrorMessage` with a retry action instead of a blank screen.
- **Dark / light mode**: `ThemeContext` reads the user's OS preference on
  first load, persists the choice to `localStorage`, and flips a
  `data-theme` attribute on `<html>` that the CSS custom properties key
  off of.

## Design

The visual language leans on a "departures board" idea — a deep ink-navy
surface (light theme: sun-bleached parchment) with an amber accent, a
serif display face (Fraunces) for headings, and a monospace face (Space
Mono) for data-heavy bits like dates, currency, and stats — evoking flight
boards and boarding passes without leaning on stock travel-blog clichés.
