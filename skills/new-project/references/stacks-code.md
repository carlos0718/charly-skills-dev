# Stacks de código — mapa stack → comando

Este archivo lo usa `/new-project` en el paso P2/P3 para sugerir y confirmar el stack.

## Frontend

### Vite templates (preguntar JS o TS antes)

| Template | JS | TS |
|---|---|---|
| Vanilla | `vanilla` | `vanilla-ts` |
| React | `react` | `react-ts` |
| Vue | `vue` | `vue-ts` |
| Svelte | `svelte` | `svelte-ts` |
| Solid | `solid` | `solid-ts` |
| Preact | `preact` | `preact-ts` |
| Lit | `lit` | `lit-ts` |

Comando base: `npm create vite@latest <name> -- --template <template>`

### Otros frameworks frontend

| Stack | Comando | Notas |
|---|---|---|
| Next.js | `npx create-next-app@latest <name>` | App Router por default, pregunta interactiva |
| Astro | `npm create astro@latest <name>` | Content-heavy / blogs |
| SvelteKit | `npm create svelte@latest <name>` | Full SvelteKit (no solo Svelte) |
| Nuxt | `npx nuxi@latest init <name>` | Full Vue framework |
| Angular | `npx @angular/cli new <name>` | Empresarial, opinionado |
| Remix | `npx create-remix@latest <name>` | Loaders/actions pattern |

### Vanilla (HTML/CSS/JS sin framework)

Crear estructura manual:
```
<name>/
  index.html
  styles/style.css
  scripts/main.js
  assets/
```

Si el usuario quiere TS sin Vite/framework: `npm i -D typescript @types/node && npx tsc --init`.

## Backend

| Stack | Comando | Notas |
|---|---|---|
| Express | `npm init -y && npm i express` | Minimal, hay que armar estructura |
| NestJS | `npx @nestjs/cli new <name>` | Opinionado, TypeScript first |
| Fastify | `npm init fastify` | Performance, schema-driven |
| Hono | `npm create hono@latest <name>` | Edge/runtime agnóstico |
| Koa | `npm init -y && npm i koa` | Minimal con async/await nativo |
| FastAPI | `pip install fastapi uvicorn[standard]` | Python, async, OpenAPI auto |
| Django | `pip install django && django-admin startproject <name>` | Full framework Python |
| Flask | `pip install flask` | Minimal Python |
| Spring Boot | usar https://start.spring.io | Java/Kotlin, descargar zip |
| Rails | `gem install rails && rails new <name>` | Full Ruby framework |
| Laravel | `composer create-project laravel/laravel <name>` | Full PHP framework |
| Go (net/http) | `go mod init <name>` | Standard library |
| Gin | `go mod init <name> && go get github.com/gin-gonic/gin` | Go framework popular |

## Estilos / UI

| Stack | Comando |
|---|---|
| Tailwind CSS | `npm i -D tailwindcss postcss autoprefixer && npx tailwindcss init -p` |
| Tailwind v4 (más nuevo) | `npm i tailwindcss @tailwindcss/vite` (config via Vite plugin) |
| shadcn/ui | `npx shadcn@latest init` (después `npx shadcn@latest add <component>`) |
| MUI (Material UI) | `npm i @mui/material @emotion/react @emotion/styled` |
| MUI Icons | `npm i @mui/icons-material` |
| Bootstrap (CSS) | `npm i bootstrap` |
| React-Bootstrap | `npm i react-bootstrap bootstrap` |
| Chakra UI | `npm i @chakra-ui/react @emotion/react` |
| Mantine | `npm i @mantine/core @mantine/hooks` |
| Ant Design | `npm i antd` |
| styled-components | `npm i styled-components` (TS: `npm i -D @types/styled-components`) |
| Emotion | `npm i @emotion/react @emotion/styled` |
| Sass / SCSS | `npm i -D sass` |
| CSS Modules | nativo en Vite/Next, sin install |
| Radix UI | `npm i @radix-ui/react-<component>` |
| Headless UI | `npm i @headlessui/react` |

## Animación (ver también stacks-web-animation.md)

Para animación liviana de UI dentro de proyectos de código:

| Stack | Comando |
|---|---|
| Framer Motion | `npm i framer-motion` |
| GSAP | `npm i gsap` |
| Anime.js | `npm i animejs` |
| Auto-Animate | `npm i @formkit/auto-animate` |

## Testing

| Stack | Comando | Cuándo |
|---|---|---|
| Vitest | `npm i -D vitest @testing-library/react @testing-library/jest-dom jsdom` | Proyectos con Vite |
| Jest | `npm i -D jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom` | CRA / setups clásicos |
| Playwright | `npm init playwright@latest` | E2E |
| Cypress | `npm i -D cypress` | E2E con UI gráfica |
| Mocha + Chai | `npm i -D mocha chai` | Node legacy |
| pytest | `pip install pytest` | Python |
| RSpec | `gem install rspec` | Ruby |
| JUnit | gestionado por Maven/Gradle | Java |

## State management (frontend)

| Stack | Comando |
|---|---|
| Zustand | `npm i zustand` |
| Redux Toolkit | `npm i @reduxjs/toolkit react-redux` |
| Jotai | `npm i jotai` |
| Valtio | `npm i valtio` |
| TanStack Query | `npm i @tanstack/react-query` |
| SWR | `npm i swr` |
| MobX | `npm i mobx mobx-react-lite` |

## Forms

| Stack | Comando |
|---|---|
| React Hook Form | `npm i react-hook-form` |
| Formik | `npm i formik` |
| Zod (validación) | `npm i zod` |
| Yup | `npm i yup` |
| TanStack Form | `npm i @tanstack/react-form` |

## ORM / DB clients

| Stack | Comando |
|---|---|
| Prisma | `npm i -D prisma && npm i @prisma/client && npx prisma init` |
| Drizzle | `npm i drizzle-orm && npm i -D drizzle-kit` |
| TypeORM | `npm i typeorm reflect-metadata` |
| Mongoose | `npm i mongoose` |
| Knex | `npm i knex` |
| pg (node-postgres) | `npm i pg` |
| SQLAlchemy | `pip install sqlalchemy` |

## Lenguaje standalone

| Lenguaje | Comando |
|---|---|
| TypeScript (sin Vite) | `npm i -D typescript @types/node && npx tsc --init` |
| TypeScript + tsx (runner) | `npm i -D typescript tsx @types/node` |

## Auth

| Stack | Comando |
|---|---|
| Better Auth | `npm i better-auth` |
| Auth.js (NextAuth) | `npm i next-auth` |
| Clerk | `npm i @clerk/nextjs` o `@clerk/clerk-react` |
| Lucia | `npm i lucia` |

## Libre / custom

Si el usuario quiere instalar algo que no está en esta lista, la skill pregunta:

> "¿Qué comando ejecuto? Pegámelo tal cual y lo agrego al script."

Y lo agrega al setup sin validar (responsabilidad del usuario).
