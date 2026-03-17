# Todo App

A reactive, real-time todo application built with Electric SQL + TanStack DB. All changes sync instantly across clients via Electric SQL.

## Features

- Add new todos with Enter key or button
- Toggle todos complete/incomplete
- Delete individual todos
- Filter by All / Active / Completed
- Live item count
- Real-time sync across browser tabs and clients

## Tech Stack

- [Electric SQL](https://electric-sql.com) — Postgres-to-client sync
- [TanStack DB](https://tanstack.com/db) — Reactive collections & optimistic mutations
- [Drizzle ORM](https://orm.drizzle.team) — Schema & migrations
- [TanStack Start](https://tanstack.com/start) — React meta-framework with SSR
- [Radix UI Themes](https://www.radix-ui.com/themes) — UI components

## Running Locally

```bash
pnpm install
pnpm dev:start
```

Open [http://localhost:8080](http://localhost:8080).

## Database Migrations

```bash
pnpm drizzle-kit generate && pnpm drizzle-kit migrate
```

## License

MIT
