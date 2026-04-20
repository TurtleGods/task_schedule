# Repository Guidelines

## Project Structure & Module Organization
`src/TaskSchedule.Api` contains the ASP.NET Core API targeting `.NET 9`. Keep HTTP endpoints in `Features/*`, request/response models in `Contracts/*`, domain entities in `Domain/Entities`, and EF Core persistence code in `Infrastructure/Persistence`. Database migrations live in `src/TaskSchedule.Api/Migrations`.

`src/task-schedule-web` is the Vite + React + TypeScript frontend. Put route pages in `src/pages`, shared UI in `src/components`, cross-cutting feature state in `src/features`, router setup in `src/app`, and API helpers in `src/services`. Static assets belong in `public` or `src/assets`. Tests currently live in `tests/TaskSchedule.Api.Tests`.

## Build, Test, and Development Commands
From the repository root:

- `dotnet restore TaskSchedule.sln` installs backend dependencies.
- `dotnet run --project src/TaskSchedule.Api/TaskSchedule.Api.csproj` starts the API locally.
- `dotnet test tests/TaskSchedule.Api.Tests/TaskSchedule.Api.Tests.csproj` runs the xUnit test suite.
- `npm install` then `npm run dev` in `src/task-schedule-web` starts the frontend on Vite.
- `npm run build` in `src/task-schedule-web` performs the TypeScript compile and production build.
- `npm run lint` in `src/task-schedule-web` runs ESLint.
- `scripts/seed-demo-sqlite.sh` reseeds the SQLite demo database after migrations are applied.

## Coding Style & Naming Conventions
Follow existing conventions instead of introducing a second style. C# uses 4-space indentation, file-scoped namespaces where applicable, PascalCase for types and public members, and singular entity names such as `Booking` or `Notification`. React/TypeScript code uses 2-space indentation, semicolons, PascalCase component filenames such as `DashboardPage.tsx`, and camelCase for hooks, helpers, and variables. Use ESLint as the frontend quality gate; keep imports explicit and grouped logically.

## Testing Guidelines
Backend tests use xUnit with files named `*Tests.cs`. Add focused tests beside related coverage in `tests/TaskSchedule.Api.Tests`, and prefer descriptive method names that state the behavior under test. Run `dotnet test` before opening a PR. Frontend test infrastructure is not present yet, so at minimum run `npm run lint` and verify changed flows manually.

## Commit & Pull Request Guidelines
Recent history favors Conventional Commit prefixes such as `feat:`, `fix:`, `style:`, and `docs:`. Keep subjects short and imperative, for example `feat: add provider booking filters`. PRs should include a concise summary, linked issue or task when available, test notes, and screenshots or short recordings for visible frontend changes.

## Configuration & Data Notes
Local API settings live in `appsettings.json` and `appsettings.Development.json`. Do not commit real secrets; use development-only values for JWT and Google auth settings. Treat `task-schedule.db` as disposable local state and regenerate or reseed it rather than editing committed data by hand.
