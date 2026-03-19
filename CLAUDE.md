# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CashMan Backend - A personal finance (가계부) iOS app backend built with Express 5 + TypeScript, using Prisma ORM with MariaDB and Redis for caching.

## Commands

```bash
npm run dev          # Start dev server with nodemon + tsx (port 3000)
npm run build        # Compile TypeScript and resolve path aliases
npm start            # Run compiled output (dist/src/server.js)
npm test             # Run Vitest in watch mode
npm run test:run     # Run Vitest once (CI-friendly)
npx vitest run src/features/auth/auth.test.ts  # Run a single test file
```

Prisma commands:
```bash
npx prisma generate          # Regenerate Prisma client after schema changes
npx prisma migrate dev       # Apply migrations in development
```

## Architecture

**Layer stack per feature:** Router → Controller → Service → Repository → Prisma

Each feature module in `src/features/` follows a consistent file convention:
- `*.router.ts` - Route definitions, applies `authJwt` middleware to protected routes
- `*.controller.ts` - Request handling, calls DTO validators, delegates to service
- `*.service.ts` - Business logic, throws `customError` on failures
- `*.repository.ts` - Prisma queries, isolated DB access
- `*.dto.ts` - AJV JSON Schema definitions + compiled validators for request/response validation
- `*.swagger.ts` - OpenAPI spec fragments (auto-merged by `src/libs/swagger.ts`)
- `*.converter.ts` - Response transformations (e.g., Date → ISO string)
- `*.test.ts` - Vitest tests

## Key Patterns

**Validation:** AJV with `JSONSchemaType<T>` for compile-time + runtime validation. Validators are compiled once and exported from DTO files. Controllers throw `validateFn.errors` on failure.

**Error handling:** `src/common/CustomResponse.ts` defines `customError` with factory functions (`customError.NOT_FOUND("message")`). Global error handler in `app.ts` catches these and AJV validation errors.

**Auth:** JWT via Passport.js (`src/common/auth/`). Access tokens (1h) + refresh tokens (7d, device-scoped, SHA-256 hashed). Naver OAuth 2.0 for social login.

**IDs:** ULID for primary keys (not auto-increment).

**Path aliases:** `@config/*`, `@features/*`, `@common/*`, `@libs/*`, `@generated/*` — defined in both `tsconfig.json` and `vitest.config.ts`.

**BigInt:** `BigInt.prototype.toJSON` is patched globally in `src/common/types/global.ts` for JSON serialization. Amounts stored as BigInt.

## Database

- MariaDB via Prisma with `@prisma/adapter-mysql2` and connection pooling
- Schema in `prisma/schema.prisma`
- Generated client output: `prisma/generated/prisma`
- Models: `user`, `user_auth`, `refresh_token`, `account`, `transaction`, `category`
- Soft deletes on `user` (deletedAt field)

## Testing

Tests use Vitest with `vi.mock()` for repository/external dependency mocking. Test patterns include DTO schema validation tests, JWT utility tests, and service-layer tests with mocked repositories.