/* =========================================================
   Mi Colección de Terremotos — script.js
   ========================================================= */

/* ---------- 1. CARRUSEL DE IMÁGENES ---------- */
const imagenes = [
    "img/terremoto1.png",
    "img/terremoto2.png",
    "img/terremoto3.png"
];

let indiceActual = 0;
const imagenCarrusel = document.getElementById("imagen-carrusel");
const contenedorPuntos = document.getElementById("puntos");

// Crear los puntitos del carrusel
imagenes.forEach((_, i) => {
    const punto = document.createElement("button");
    punto.classList.add("punto");
    punto.setAttribute("aria-label", "Ir a la imagen " + (i + 1));
    punto.addEventListener("click", () => mostrarImagen(i));
    contenedorPuntos.appendChild(punto);
});

function mostrarImagen(indice) {
    indiceActual = (indice + imagenes.length) % imagenes.length; // vuelve al inicio/fin
    imagenCarrusel.src = imagenes[indiceActual];
    // Marcar el puntito activo
    document.querySelectorAll(".punto").forEach((p, i) => {
        p.classList.toggle("activo", i === indiceActual);
    });
}

document.getElementById("btn-prev").addEventListener("click", () => mostrarImagen(indiceActual - 1));
document.getElementById("btn-next").addEventListener("click", () => mostrarImagen(indiceActual + 1));

// Rotación automática cada 5 segundos
setInterval(() => mostrarImagen(indiceActual + 1), 5000);

mostrarImagen(0);


/* ---------- 2. CONEXIÓN A LA API (USGS) con fetch + async/await + try/catch ---------- */
// API vista en clase (la que pide el examen) y una alternativa del mismo USGS
const URL_API = "https://earthquake.usgs.gov/earthquakequery/count?format=geojson";
const URL_API_ALTERNATIVA = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";

const estadoApi = document.getElementById("estado-api");
const listaApi = document.getElementById("lista-api");

async function cargarTerremotos() {
    try {
        let respuesta = await fetch(URL_API);
        let datos = await respuesta.json();

        // Si la URL del examen no trae la lista de sismos, usamos el feed oficial del USGS
        if (!datos.features || datos.features.length === 0) {
            respuesta = await fetch(URL_API_ALTERNATIVA);
            if (!respuesta.ok) {
                throw new Error("La API respondió con error: " + respuesta.status);
            }
            datos = await respuesta.json();
        }

        estadoApi.textContent = "✅ Últimos terremotos de magnitud 4.5+ en el mundo:";
        mostrarTerremotos(datos.features.slice(0, 8)); // mostramos los 8 más recientes
    } catch (error) {
        // Manejo del error si la API no responde
        console.error("Error al conectar con la API:", error);
        estadoApi.textContent = "⚠️ No se pudo conectar con la API del USGS. Revisa tu conexión e intenta recargar la página.";
        estadoApi.classList.add("error");
    }
}

function mostrarTerremotos(terremotos) {
    listaApi.innerHTML = "";
    terremotos.forEach(t => {
        const li = document.createElement("li");

        const magnitud = document.createElement("span");
        magnitud.classList.add("magnitud");
        magnitud.textContent = "M" + t.properties.mag.toFixed(1);

        const info = document.createElement("span");
        const fecha = new Date(t.properties.time).toLocaleString("es-MX");
        info.innerHTML = "<strong>" + t.properties.place + "</strong><br><small>📅 " + fecha + "</small>";

        li.appendChild(magnitud);
        li.appendChild(info);
        listaApi.appendChild(li);
    });
}

cargarTerremotos();


/* ---------- 3. COLECCIÓN CON localStorage ---------- */
const CLAVE_STORAGE = "miColeccionTerremotos";

const inputNombre = document.getElementById("input-nombre");
const btnAgregar = document.getElementById("btn-agregar");
const listaColeccion = document.getElementById("lista-coleccion");
const mensajeVacio = document.getElementById("mensaje-vacio");

// Al cargar la página: leer la colección guardada (localStorage.getItem + JSON.parse)
let coleccion = JSON.parse(localStorage.getItem(CLAVE_STORAGE)) || [];

// Guardar la colección completa (JSON.stringify + localStorage.setItem)
function guardarColeccion() {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(coleccion));
}

// Agregar un elemento
function agregarElemento() {
    const nombre = inputNombre.value.trim();
    if (nombre === "") {
        alert("Escribe el nombre del terremoto primero ✍️");
        return;
    }
    coleccion.push({ nombre: nombre, favorito: false });
    inputNombre.value = "";
    guardarColeccion(); // se guarda cada vez que agregamos
    renderizarColeccion();
}

// Eliminar un elemento
function eliminarElemento(indice) {
    coleccion.splice(indice, 1);
    guardarColeccion(); // se guarda cada vez que eliminamos
    renderizarColeccion();
}

// Marcar / desmarcar favorito ⭐
function toggleFavorito(indice) {
    coleccion[indice].favorito = !coleccion[indice].favorito;
    guardarColeccion(); // se guarda cada vez que marcamos favorito
    renderizarColeccion();
}

// Dibujar la lista en pantalla
function renderizarColeccion() {
    listaColeccion.innerHTML = "";
    mensajeVacio.style.display = coleccion.length === 0 ? "block" : "none";

    coleccion.forEach((item, i) => {
        const li = document.createElement("li");
        if (item.favorito) li.classList.add("favorito");

        const nombre = document.createElement("span");
        nombre.classList.add("item-nombre");
        nombre.textContent = (item.favorito ? "⭐ " : "") + item.nombre;

        const acciones = document.createElement("div");
        acciones.classList.add("item-acciones");

        const btnFav = document.createElement("button");
        btnFav.classList.add("btn-fav");
        btnFav.textContent = item.favorito ? "★" : "☆";
        btnFav.title = "Marcar como favorito";
        btnFav.addEventListener("click", () => toggleFavorito(i));

        const btnEliminar = document.createElement("button");
        btnEliminar.classList.add("btn-eliminar");
        btnEliminar.textContent = "🗑️";
        btnEliminar.title = "Eliminar";
        btnEliminar.addEventListener("click", () => eliminarElemento(i));

        acciones.appendChild(btnFav);
        acciones.appendChild(btnEliminar);
        li.appendChild(nombre);
        li.appendChild(acciones);
        listaColeccion.appendChild(li);
    });
}

btnAgregar.addEventListener("click", agregarElemento);

// También permite agregar con la tecla Enter
inputNombre.addEventListener("keydown", (e) => {
    if (e.key === "Enter") agregarElemento();
});

// Mostrar la colección guardada al abrir la página
renderizarColeccion();
