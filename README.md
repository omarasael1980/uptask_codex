# UpTask

Monorepo con `frontend` y `backend` gestionados con pnpm.

## Requisitos

- Node.js 20.11 o superior
- pnpm 10.16 o superior

## Instalacion

```bash
pnpm install
```

## Base de datos

El backend usa PostgreSQL con Prisma. Configura `backend/.env` con:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/uptask?schema=public"
```

Para preparar la base y crear datos iniciales:

```bash
pnpm db:push
pnpm db:seed
```

El seed crea el usuario:

```text
Email: asaelmontieldev@gmail.com
Password: 501680
```

## Scripts

```bash
pnpm dev:frontend
pnpm dev:backend
pnpm build
pnpm lint
pnpm typecheck
pnpm prisma:generate
pnpm db:push
pnpm db:seed
pnpm audit
```
