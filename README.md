# 🌋 Mi Colección de Terremotos

Aplicación web para coleccionar terremotos, con datos en vivo de la **API del USGS** (Servicio Geológico de Estados Unidos).

## Archivos

- `index.html` — estructura: navbar, header, carrusel, sección de API, colección y footer.
- `style.css` — diseño con variables CSS en `:root`, efectos `:hover`, bordes redondeados y espaciado.
- `script.js` — carrusel, conexión a la API con `fetch` + `async/await` + `try/catch`, y la colección con `localStorage` + `JSON.stringify()` / `JSON.parse()`.
- `img/` — imágenes del carrusel (`terremoto1.png`, `terremoto2.png`, `terremoto3.png`).

## Cómo usar

1. Abre `index.html` en tu navegador.
2. La sección "Terremotos recientes" carga sola los últimos sismos del mundo.
3. Escribe un nombre y presiona **Agregar** (o Enter) para guardarlo en tu colección.
4. Usa ☆ para marcar favorito ⭐ y 🗑️ para eliminar.
5. Los datos sobreviven a F5 gracias a `localStorage`.

## APIs usadas

- `https://earthquake.usgs.gov/earthquakequery/count?format=geojson` (vista en clase)
- `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson` (feed oficial del USGS, sin key)
