# Sara Design

Aplicacion web para crear y editar fichas tecnicas de diseno, con lienzos A4, piezas de patron, medidas, imagenes y exportacion.

## Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- IndexedDB con Dexie

## Desarrollo local

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

El resultado de produccion se genera en `dist/`.

## Despliegue

El proyecto es una SPA de Vite y puede desplegarse en Vercel. El archivo `vercel.json` redirige todas las rutas a `index.html` para que funcionen URLs directas como `/editor/:id`.
