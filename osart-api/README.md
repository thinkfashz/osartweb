# OSART API — NestJS 11 + GraphQL + Vercel

Backend API para la tienda OSART. Usa NestJS 11, Express 5, Apollo Server 4 y Supabase.

---

## Variables de entorno

Copia `.env.example` → `.env` y rellena los valores:

```bash
cp .env.example .env
```

| Variable | Descripción |
|---|---|
| `PORT` | Puerto local (default `3001`) |
| `CORS_ORIGIN` | URL del frontend (ej. `http://localhost:3000`) |
| `SUPABASE_URL` | URL de tu proyecto Supabase |
| `SUPABASE_ANON_KEY` | Clave pública Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave de servicio Supabase (admin) |

---

## Correr localmente

```bash
npm install
npm run start:dev
```

- API: `http://localhost:3001`
- GraphQL Sandbox: `http://localhost:3001/graphql`
- Health: `http://localhost:3001/health`

---

## Build

```bash
npm run build
# Output en /dist
```

---

## Deploy en Vercel

### Estructura de archivos

```
osart-api/
├── api/index.ts        ← Serverless handler (Vercel entry)
├── src/main.ts         ← createApp() factory
├── vercel.json
└── package.json
```

### Pasos

1. Conecta el repo en [vercel.com/new](https://vercel.com/new)
2. **Root Directory** → `osart-api`
3. **Framework Preset** → Other
4. **Build Command** → `npm run build`
5. Agrega las variables de entorno en *Settings → Environment Variables*
6. Deploy

### Variables en Vercel

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CORS_ORIGIN` → URL del frontend en Vercel

---

## Endpoints

```bash
GET /health      → { ok: true, timestamp, version }
GET /graphql     → Apollo Sandbox
POST /graphql    → GraphQL endpoint
```

---

## Stack

- **NestJS** 11 + Express 5
- **Apollo Server** 4 via `@nestjs/apollo` 13
- **GraphQL** 16 (code-first)
- **Supabase** (Postgres + Auth)
- **Vercel** serverless
