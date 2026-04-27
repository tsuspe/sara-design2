# Despliegue

El despliegue recomendado para Sara Design es Vercel conectado al repositorio de GitHub.

## Flujo recomendado

1. Trabajar localmente.
2. Commit de cambios.
3. Push a GitHub.
4. Vercel detecta el push.
5. Vercel ejecuta el build y publica la nueva version.

## Configuracion en Vercel

Al importar el repositorio desde GitHub:

- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`
- Production Branch: `main`

## Rutas SPA

La app usa React Router con rutas como:

- `/`
- `/editor/:id`

Para que estas rutas funcionen al recargar la pagina o abrir enlaces directos, el proyecto incluye `vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## Deploy automatico

Una vez conectado GitHub con Vercel:

- Cada push a `main` crea un despliegue de produccion.
- Cada pull request o rama secundaria puede crear un preview deployment.

## Comandos habituales

Crear un commit:

```bash
git add .
git commit -m "describe el cambio"
```

Subir a GitHub:

```bash
git push
```

Verificar antes de subir:

```bash
npm run lint
npm run build
```

## Variables de entorno

Actualmente la aplicacion no requiere variables de entorno para funcionar.

## Datos en produccion

La aplicacion guarda datos en IndexedDB del navegador del usuario. Esto significa que el despliegue en Vercel solo publica la aplicacion; no centraliza ni sincroniza los datos.

Si se necesita sincronizacion entre dispositivos o usuarios, habria que aniadir un backend o servicio externo de almacenamiento.
