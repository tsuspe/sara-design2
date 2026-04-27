# Arquitectura

Sara Design es una SPA de React. No tiene backend propio: todo el estado persistente se guarda localmente en IndexedDB.

## Vision general

```text
src/
  components/
    canvas/        Renderizado y wrappers de elementos del lienzo
    editor/        Layout del editor, toolbar, tabs y panel de propiedades
    pages/         Overlays fijos de las paginas A4
    ui/            Componentes base de interfaz
  db/              Configuracion y helpers de IndexedDB
  hooks/           Hooks de ficha, lienzo y exportacion
  pages/           Rutas principales: Dashboard y Editor
  store/           Estado global con Zustand
  types/           Tipos principales de dominio
  utils/           Utilidades para defaults, imagenes y PDF
```

## Rutas

La aplicacion usa React Router:

- `/`: dashboard de fichas.
- `/editor/:id`: editor de una ficha.
- `*`: redireccion a `/`.

En despliegue, `vercel.json` redirige todas las rutas a `index.html` para que React Router resuelva la navegacion en cliente.

## Modelo de datos

El tipo principal es `Ficha`.

Una ficha contiene:

- Metadatos generales del producto.
- Tres paginas A4.
- Fechas de creacion y actualizacion.
- Miniatura opcional para el dashboard.

Las paginas son:

- `Page1Visual`
- `Page2Graphic`
- `Page3Technical`

Cada pagina contiene una lista de `CanvasElement`.

Tipos de elementos disponibles:

- `image`
- `text`
- `label`
- `arrow`
- `shape`

La pagina tecnica tambien contiene:

- `measurements`
- `patternPieces`

## Estado global

El estado del editor vive en `src/store/fichaStore.ts` usando Zustand.

Responsabilidades principales:

- Ficha actual.
- Pagina seleccionada.
- Elemento seleccionado.
- Estado `isDirty`.
- Actualizacion de metadatos.
- Actualizacion de pagina.
- Alta, edicion, borrado y reordenado de elementos.

## Persistencia

La base local esta en `src/db/indexedDB.ts` y usa Dexie.

Base de datos:

- Nombre: `sara-design2`
- Tabla: `fichas`
- Indices: `id`, `updatedAt`, `title`

Helpers disponibles:

- `getAllFichas`
- `getFichaById`
- `saveFicha`
- `deleteFicha`
- `updateFicha`

## Editor visual

El editor se organiza en tres zonas:

- Panel izquierdo: herramientas para aniadir elementos y gestionar capas.
- Centro: tabs de pagina y lienzo A4.
- Panel derecho: propiedades de ficha o del elemento seleccionado.

El lienzo usa elementos posicionables con:

- Coordenadas
- Tamano
- Rotacion
- Z-index
- Visibilidad

Los overlays de cada pagina se definen por separado en `src/components/pages/` para mantener la estructura fija de cabeceras, pies y tablas.

## Exportacion

La vista previa y el PDF usan:

- `html2canvas` para capturar cada pagina A4 como imagen.
- `jsPDF` para componer el PDF multipagina.

La exportacion recorre las tres paginas y las inserta como imagenes PNG en un documento A4.

## Testing

El proyecto incluye configuracion de Vitest con entorno `jsdom`.

Archivos de prueba actuales:

- `src/utils/createDefaults.test.ts`
- `src/store/fichaStore.test.ts`
- `src/db/indexedDB.test.ts`

## Consideraciones tecnicas

- Las imagenes se almacenan como data URLs dentro de cada ficha.
- Las fichas grandes pueden aumentar el tamano usado por IndexedDB.
- La app funciona sin backend, pero la sincronizacion multiusuario requeriria un servicio externo.
- El build de produccion se genera con Vite en `dist/`.
