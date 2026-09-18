# Taskflow — Frontend

The Next.js client for [Taskflow](https://taskflow-backend-9bsg.vercel.app) — a Jira/Trello-inspired project management tool. Built with the App Router, TanStack Query, and a custom JWT + refresh-token auth flow (no NextAuth — session handling is implemented from scratch).

---

## Features

- **Custom Auth** — Register/login backed by the Taskflow API's JWT access tokens and HTTP-only cookie refresh tokens. Access tokens live in memory (React Context), refresh tokens never touch client-side JavaScript.
- **Silent Token Refresh** — An Axios interceptor transparently retries any request that fails with `401`, fetching a new access token via the refresh cookie before the user notices.
- **Protected Routes** — A layout-level guard re-validates the session on every load (covers hard refreshes, since in-memory state doesn't survive them) before rendering anything under `/dashboard`.
- **Boards, Lists & Cards** — Full CRUD for the core Kanban hierarchy, each scoped to the logged-in user's access via the backend's ownership rules.
- **Card Detail View** — A dialog per card surfacing assignees and threaded comments, built on the same reusable form/drawer primitives as the rest of the app.
- **Card Assignees** — Assign any board member to a card via an inline, instant-select dropdown (no modal — this is a quick action, not a form).
- **Comments** — Per-card discussion thread; users can delete their own comments.
- **Responsive Forms** — One `DataDrawer` component renders as a `Dialog` on desktop and a `Drawer` on mobile, driven by a shared media-query hook.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router, TypeScript) |
| Styling / UI | Tailwind CSS + shadcn/ui (`Field` + `Controller` form pattern) |
| Forms & Validation | React Hook Form + Zod |
| Data Fetching | TanStack Query |
| HTTP Client | Axios (custom interceptors for auth) |
| Auth State | React Context (no NextAuth) |

---

## Architecture Notes

- **Why not NextAuth:** This project is deliberately building the token lifecycle by hand — access token in memory, refresh token in an HTTP-only cookie set by the backend, interceptor-driven silent refresh — to actually understand the mechanics rather than delegate them to a library.
- **The `enabled` flag matters more than it looks.** Every query that depends on auth state (e.g. fetching boards) is gated with `enabled: !!token && !isLoading`. Without it, a query fires before the auth-check request resolves, gets a `401`, and triggers a redundant refresh — which sounds harmless until two refresh calls race each other.
- **Instant-action dropdowns aren't forms.** Assigning a card to a board member doesn't open a `DataDrawer` — it's a single `Select` that fires on change and resets immediately (not on mutation success), so the UI never flashes a raw ID while the request is in flight.
- **Prop drilling over Context for `boardId`.** It's threaded through `BoardDetailPage → List → Cards → CardDetail → CardAssignees` rather than lifted into a Context, since it's a single value needed by one branch of the tree — not global state.

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/            # login, register — public routes
│   ├── dashboard/         # protected layout + boards list
│   │   └── boards/[boardId]/   # board detail (lists + cards)
│   ├── components/
│   │   ├── boards/
│   │   ├── lists/
│   │   ├── cards/
│   │   └── card-assignees/
│   └── shared/            # DataDrawer, ConfirmDialog, SelectFormField
├── context/
│   └── auth-context.tsx   # user, token, login/register/logout
├── hooks/                 # useBoard, useLists, useCards, useComments, useCardAssignees
├── lib/
│   └── api.ts             # Axios instance + interceptors
├── types/
└── validations/           # Zod schemas
```

---

## Running Locally

```bash
git clone https://github.com/fahad4046566/taskflow-frontend.git
cd taskflow-frontend
npm install
```

Create `.env.local`:

```
NEXT_PUBLIC_API_URL=https://taskflow-backend-9bsg.vercel.app
```

(Or point it at a local instance of the [backend](https://github.com/fahad4046566/taskflow-backend) if running both together.)

```bash
npm run dev
```

Visit `http://localhost:3000` (or `3001` if the backend's dev server is already on 3000).

---

## Roadmap

- [ ] Board member management UI (invite/remove members — currently backend-only)
- [ ] Logout control in the dashboard shell
- [ ] Drag-and-drop card reordering across lists
- [ ] Loading skeletons and refined empty/error states

---

## Author

**Fahad Bashir** — self-taught full-stack developer, building toward a freelancing career.