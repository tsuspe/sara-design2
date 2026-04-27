# Sara Design

Sara Design es una aplicacion web para crear, editar y exportar fichas tecnicas de diseno de moda. Permite organizar fichas por modelo, montar paginas A4 con imagenes y anotaciones, documentar datos tecnicos, preparar tablas de medidas y piezas de patron, y exportar el resultado final a PDF.

El proyecto esta construido como una SPA con React, TypeScript y Vite. Los datos se guardan localmente en el navegador mediante IndexedDB, por lo que no necesita backend para funcionar.

## Funcionalidades principales

- Dashboard con listado de fichas guardadas.
- Creacion de nuevas fichas con titulo, modelo y numero de ficha.
- Editor visual de 3 paginas en formato A4.
- Insercion de imagenes y primera pagina de PDFs como imagen.
- Elementos editables: texto, etiquetas, flechas, formas e imagenes.
- Movimiento, redimensionado, rotacion, visibilidad y orden de capas.
- Panel de propiedades para metadatos de la ficha y elementos seleccionados.
- Pagina visual con opcion de mostrar u ocultar anotaciones.
- Pagina grafica con paleta de color editable.
- Pagina tecnica con tabla de medidas y piezas de patron.
- Vista previa multipagina.
- Exportacion a PDF.
- Persistencia local con IndexedDB.
- Preparado para despliegue en Vercel desde GitHub.

## Estructura de la ficha

Cada ficha contiene tres paginas:

1. **Pagina visual**: composicion principal con imagenes, textos, etiquetas, flechas y anotaciones.
2. **Pagina grafica**: vista enfocada en composicion grafica y paleta de colores.
3. **Pagina tecnica**: informacion tecnica, medidas, despiece de patron y resumen de cortes.

Ademas, cada ficha guarda datos generales como marca, modelo, temporada, tela, talla base, articulo, linea, fechas, diseniadora, taller, estado de prototipo y modificaciones.

## Stack tecnico

- React 19
- TypeScript
- Vite
- React Router
- Zustand
- Dexie / IndexedDB
- Tailwind CSS
- Base UI
- Lucide React
- html2canvas
- jsPDF
- Vitest
- ESLint

## Requisitos

- Node.js 22 o compatible
- npm

## Instalacion

```bash
npm install
```

## Desarrollo local

```bash
npm run dev
```

Vite levantara la aplicacion en una URL local, normalmente `http://localhost:5173`.

## Scripts disponibles

```bash
npm run dev
```

Inicia el servidor de desarrollo.

```bash
npm run build
```

Compila TypeScript y genera la version de produccion en `dist/`.

```bash
npm run preview
```

Sirve localmente el build de produccion.

```bash
npm run lint
```

Ejecuta ESLint sobre el proyecto.

## Despliegue

El proyecto esta preparado para Vercel. El archivo `vercel.json` incluye una regla de rewrite para que las rutas de React Router funcionen al recargar o abrir enlaces directos.

Configuracion recomendada en Vercel:

- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`
- Production Branch: `main`

Una vez conectado el repositorio de GitHub a Vercel, cada push a `main` generara un nuevo despliegue de produccion.

Mas detalles en [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Documentacion

- [Guia de uso](docs/USAGE.md)
- [Arquitectura](docs/ARCHITECTURE.md)
- [Despliegue](docs/DEPLOYMENT.md)

## Persistencia de datos

La aplicacion guarda las fichas en IndexedDB, dentro del navegador del usuario. Esto significa que:

- No requiere servidor ni base de datos externa.
- Los datos quedan en el dispositivo/navegador donde se crean.
- Borrar datos del navegador puede eliminar las fichas guardadas.
- Abrir la app desde otro navegador o dispositivo no sincroniza automaticamente las fichas.

## Estado del proyecto

El proyecto esta orientado a uso interno o como herramienta ligera de documentacion tecnica. La base actual funciona sin backend y esta preparada para evolucionar hacia sincronizacion en la nube, autenticacion o almacenamiento compartido si se necesita mas adelante.
