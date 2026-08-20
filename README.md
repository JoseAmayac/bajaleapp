# BajaleApp ⚖️

App PWA mobile-first para control de peso y progreso personal. Construida con React 18 + Vite + TypeScript + Tailwind CSS + Supabase.

## Stack

- React 18 + Vite + TypeScript
- Tailwind CSS v4 (mobile-first, ~390px base)
- vite-plugin-pwa (manifest + service worker)
- @supabase/supabase-js (auth + base de datos)
- React Router v6
- Recharts (gráfica de progreso de peso)

## Instalación local

```bash
cd bajaleapp-web
npm install
cp .env.example .env
```

Edita `.env` con tus credenciales de Supabase:

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

```bash
npm run dev
```

## Configurar Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com)
2. Ve a **SQL Editor → New query**
3. Pega el contenido de `../schema.sql` y ejecuta
4. Despliega la Edge Function `estimate-nutrition`:
   ```bash
   supabase functions deploy estimate-nutrition
   supabase secrets set GEMINI_API_KEY=tu_api_key
   ```
5. Copia la URL y la anon key del proyecto en tu `.env`

## Íconos PWA

Coloca tus íconos en `public/icons/`:
- `icon-192.png` — 192×192 px
- `icon-512.png` — 512×512 px

Puedes generarlos en [favicon.io](https://favicon.io) o [realfavicongenerator.net](https://realfavicongenerator.net).

## Despliegue en Vercel

```bash
npm run build
```

1. Conecta el repo en [vercel.com](https://vercel.com)
2. Framework preset: **Vite**
3. Agrega las variables de entorno `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`
4. Deploy ✅

## Despliegue en Netlify

1. Conecta el repo en [netlify.com](https://netlify.com)
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Agrega las variables de entorno
5. Deploy ✅

## Estructura del proyecto

```
src/
├── lib/
│   └── supabase.ts          # Cliente Supabase singleton
├── types/
│   └── index.ts             # Tipos TypeScript del schema
├── hooks/
│   ├── useAuth.ts           # Autenticación + sesión persistente
│   ├── useMeals.ts          # CRUD comidas + invocación Edge Function
│   ├── useActivities.ts     # CRUD actividades
│   ├── useMeasurements.ts   # CRUD medidas semanales
│   └── useProfile.ts        # Lectura/edición de perfil
├── components/
│   ├── AppLayout.tsx        # Layout con nav inferior
│   └── ui/
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       └── Select.tsx
└── pages/
    ├── LoginPage.tsx
    ├── DashboardPage.tsx
    ├── MealsPage.tsx
    ├── ActivityPage.tsx
    ├── MeasurementsPage.tsx
    └── ProfilePage.tsx
```

## Decisiones de arquitectura

- **Estado global**: no se usa ningún gestor (Redux, Zustand). Cada página tiene su propio hook con estado local — suficiente para un proyecto personal.
- **Formularios**: estado local con `useState`, sin react-hook-form para mantener las dependencias mínimas.
- **Edge Function**: se invoca en background después de insertar la comida. La fila muestra "⏳ Calculando..." hasta que `ai_processed` sea `true`, luego se refresca automáticamente.
- **PWA offline**: network-first para llamadas a Supabase (datos frescos), cache-first para assets estáticos. La app muestra datos cacheados si no hay conexión.
- **iOS**: meta tags `apple-mobile-web-app-capable` y `apple-touch-icon` en `index.html` para instalación desde Safari.
