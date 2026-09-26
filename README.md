# MIDA · ALUNA IA — Front

Front en Next.js (App Router) para MIDA, siguiendo el sistema de diseño "Territorial Care & Intelligence" (Stitch) para el seguimiento antropométrico biocultural de la niñez Kággaba en la Sierra Nevada de Santa Marta.

## Desarrollo

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) — redirige a `/anthropometry`.

## Páginas

- `/anthropometry`: formulario de nuevo reporte antropométrico (8 secciones), es la pantalla principal conectada al backend.
- `/dashboard`: resumen territorial (placeholder visual, pendiente de datos reales).
- `/medical-access`: acceso para personal clínico/cabildo (placeholder visual, pendiente de autenticación real).

## Backend

El formulario envía un `POST` a `${NEXT_PUBLIC_API_BASE_URL}/anthropometry` con el payload tipado en `src/types/anthropometry.ts`. Configura la variable en `.env.local` (ver `.env.example`). Si no está configurada, el formulario solo registra el payload en consola para poder probar la UI sin backend.

## Deploy en Vercel

Conecta el repo en Vercel y define `NEXT_PUBLIC_API_BASE_URL` como variable de entorno del proyecto (Production/Preview).
