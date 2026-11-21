import { tieneSesion, solicitarRegistro } from "./favoritos.js";

const claveReacciones = "nodo_reacciones";


export function leerReacciones() {
    try {
        const datos = JSON.parse(localStorage.getItem(claveReacciones));

        if (datos && typeof datos === "object" && !Array.isArray(datos)) {
            return datos;
        }

        return {};
    } catch (error) {
        console.error("No se pudieron leer las reacciones", error);
        return {};
    }
}


function guardarReacciones(reacciones) {
    try {
        localStorage.setItem(claveReacciones, JSON.stringify(reacciones));
    } catch (error) {
        console.error("No se pudieron guardar las reacciones", error);
    }
}


export function iniciarReacciones() {
    const articulo = document.querySelector(".lectura");

    if (!articulo) {
        return;
    }

    const favorito = articulo.querySelector(".boton-favorito");

    if (!favorito) {
        return;
    }

    const idArticulo = favorito.dataset.favorito;

    const seccion = document.createElement("section");
    seccion.classList.add("lectura__reacciones");

    const titulo = document.createElement("h3");
    titulo.textContent = "¿Qué te pareció este artículo?";

    const contenedor = document.createElement("div");
    contenedor.style.display = "flex";
    contenedor.style.flexWrap = "wrap";
    contenedor.style.gap = "10px";

    const opciones = [
        { valor: "encanta", texto: "❤️ Me encanta", color: "#D85C75" },
        { valor: "gusta", texto: "👍 Me gusta", color: "#5B9EAF" },
        { valor: "no-gusta", texto: "👎 No me gusta", color: "#A67C65" }
    ];


    function actualizarBotones() {
        const reacciones = leerReacciones();
        const seleccionada = reacciones[idArticulo];

        contenedor.querySelectorAll("button").forEach(function (boton) {
            const activo = boton.dataset.reaccion === seleccionada;
            const color = boton.dataset.color;

            boton.setAttribute("aria-pressed", String(activo));

            boton.style.backgroundColor = activo ? color : "transparent";
            boton.style.color = activo ? "#FFFFFF" : "var(--color-texto)";
            boton.style.border = activo
                ? "1px solid " + color
                : "1px solid var(--color-acento)";

            boton.style.fontWeight = activo ? "bold" : "normal";
            boton.style.transform = "none";
        });
    }


    opciones.forEach(function (opcion) {
        const boton = document.createElement("button");

        boton.type = "button";
        boton.classList.add("boton");
        boton.dataset.reaccion = opcion.valor;
        boton.dataset.color = opcion.color;
        boton.textContent = opcion.texto;

        boton.addEventListener("click", function () {
            if (!tieneSesion()) {
                solicitarRegistro();
                return;
            }

            const reacciones = leerReacciones();

            if (reacciones[idArticulo] === opcion.valor) {
                delete reacciones[idArticulo];
            } else {
                reacciones[idArticulo] = opcion.valor;
            }

            guardarReacciones(reacciones);
            actualizarBotones();

            document.dispatchEvent(new Event("reacciones-actualizadas"));
        });

        contenedor.append(boton);
    });

    seccion.append(titulo, contenedor);

    const navegacion = articulo.querySelector(".lectura__navegacion");

    if (navegacion) {
        articulo.insertBefore(seccion, navegacion);
    } else {
        articulo.append(seccion);
    }

    actualizarBotones();
}