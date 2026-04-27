# Guia de uso

Esta guia describe el flujo principal de Sara Design desde la creacion de una ficha hasta la exportacion final.

## 1. Crear una ficha

Desde el dashboard, pulsa **Nueva ficha** y completa:

- Titulo
- Modelo
- Numero de ficha

Al crearla, la aplicacion abre directamente el editor.

## 2. Editar datos generales

En el panel derecho se editan los datos de la ficha:

- Diseniadora
- Marca
- Numero de ficha
- Titulo
- Modelo
- Tecnica de impresion
- Gramaje
- Fecha de emision
- Fecha de recepcion
- Taller
- Estado del prototipo
- Temporada
- Tela o material
- Talla base
- Articulo o codigo
- Linea o coleccion
- Descripcion
- Modificaciones

Estos datos se reutilizan en las cabeceras y bloques de informacion de las paginas A4.

## 3. Trabajar con paginas

El editor esta dividido en tres paginas:

### Pagina 1: visual

Pensada para la presentacion visual del modelo. Permite incluir imagenes, textos, etiquetas, flechas, formas y anotaciones.

Incluye un interruptor para mostrar u ocultar anotaciones. Al ocultarlas, se esconden flechas y etiquetas de esta pagina.

### Pagina 2: grafica

Pensada para una vista grafica o compositiva. Incluye una paleta de colores editable en la parte inferior.

Desde la propia pagina se pueden aniadir, modificar y eliminar colores.

### Pagina 3: tecnica

Pensada para documentacion tecnica. Incluye:

- Tabla de medidas
- Piezas de patron
- Tela de cada pieza
- Cantidad de cortes
- Notas por pieza
- Resumen total de piezas

## 4. Aniadir elementos al lienzo

El panel izquierdo permite aniadir:

- Imagen
- PDF como imagen, usando la primera pagina del PDF
- Texto
- Etiqueta
- Flecha
- Forma

Las imagenes se convierten a base64 y se guardan dentro de la ficha local.

## 5. Editar elementos

Al seleccionar un elemento aparece su panel de propiedades.

Propiedades comunes:

- Posicion X/Y
- Ancho y alto
- Rotacion
- Visibilidad
- Z-index

Propiedades especificas:

- Imagen: opacidad
- Texto: tamano, negrita, cursiva, color y alineacion
- Etiqueta: contenido, tamano, color de texto y fondo
- Flecha: color y grosor
- Forma: tipo, relleno, trazo, grosor y opacidad

## 6. Orden de capas

Cuando hay un elemento seleccionado, el panel izquierdo muestra controles para:

- Subir capa
- Bajar capa
- Eliminar elemento

Esto permite controlar que elementos quedan por encima o por debajo dentro de cada pagina.

## 7. Guardar

El boton **Guardar** persiste la ficha en IndexedDB y genera una miniatura de la primera pagina para el dashboard.

El indicador del encabezado muestra si hay cambios pendientes o si la ficha esta guardada.

## 8. Vista previa y PDF

El boton **Vista previa** abre las tres paginas en formato de lectura.

Desde la vista previa se puede:

- Imprimir
- Exportar PDF

La exportacion genera un PDF A4 de tres paginas usando `html2canvas` y `jsPDF`.

## 9. Limitaciones actuales

- Los datos se guardan localmente en el navegador.
- No hay sincronizacion entre dispositivos.
- No hay sistema de usuarios.
- Si se borra IndexedDB o los datos del navegador, se pueden perder las fichas.
- La exportacion depende de la representacion visual del navegador.
