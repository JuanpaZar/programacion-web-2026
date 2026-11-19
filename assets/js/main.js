import { iniciarFormulario } from "./formulario.js";
import { iniciarArticulos } from "./articulos.js";
import { iniciarFavoritos } from "./favoritos.js";

const botonMenu = document.getElementById("boton-menu");
const menu = document.querySelector(".menu");

if (botonMenu && menu) {
    botonMenu.addEventListener("click", function () {
        const abierto = menu.classList.toggle("menu--abierto");
        botonMenu.setAttribute("aria-expanded", String(abierto));
    });
}


const botonTema = document.getElementById("boton-tema");

try {
    const temaGuardado = JSON.parse(localStorage.getItem("nodo_tema"));

    if (temaGuardado === "claro") {
        document.body.classList.remove("tema-oscuro");
        document.body.classList.add("tema-claro");
    }
} catch (error) {
    console.error("No se pudo leer el tema", error);
}

if (botonTema) {
    botonTema.setAttribute("aria-pressed", String(document.body.classList.contains("tema-oscuro")));

    botonTema.addEventListener("click", function () {
        const modoOscuro = document.body.classList.toggle("tema-oscuro");

        document.body.classList.toggle("tema-claro", !modoOscuro);
        botonTema.setAttribute("aria-pressed", String(modoOscuro));

        try {
            localStorage.setItem("nodo_tema", JSON.stringify(modoOscuro ? "oscuro" : "claro"));
        } catch (error) {
            console.error("No se pudo guardar el tema", error);
        }
    });
}


const buscador = document.getElementById("buscador-articulos");
const botonVerMas = document.getElementById("boton-ver-mas");

let mostrarTodos = false;

function filtrarArticulos() {
    if (!buscador) {
        return;
    }

    const texto = buscador.value.trim().toLowerCase();
    const tarjetas = document.querySelectorAll(".articulos__tarjeta");
    let encontrados = 0;

    tarjetas.forEach(function (tarjeta, indice) {
        const contenido = tarjeta.textContent.toLowerCase();
        const coincide = contenido.includes(texto);
        const mostrar = coincide && (texto !== "" || mostrarTodos || indice < 4 || !botonVerMas);

        tarjeta.hidden = !mostrar;

        if (mostrar) {
            encontrados++;
        }
    });

    const estado = document.getElementById("estado-articulos");

    if (estado && tarjetas.length > 0) {
        estado.textContent = encontrados === 0 ? "No se encontraron artículos." : "";
    }

    const estadoBusqueda = document.getElementById("estado-busqueda");

    if (estadoBusqueda) {
        estadoBusqueda.textContent = texto !== "" && encontrados === 0 ? "No se encontraron artículos." : "";
    }

    if (botonVerMas) {
        botonVerMas.hidden = texto !== "";
    }
}


if (buscador) {
    buscador.addEventListener("input", filtrarArticulos);
}


if (botonVerMas) {
    botonVerMas.addEventListener("click", function () {
        mostrarTodos = !mostrarTodos;

        botonVerMas.textContent = mostrarTodos ? "Ver menos artículos" : "Ver más artículos";
        botonVerMas.setAttribute("aria-expanded", String(mostrarTodos));

        filtrarArticulos();
    });
}


const formSugerencias = document.getElementById("form-sugerencias");

if (formSugerencias) {
    formSugerencias.addEventListener("submit", function (e) {
        e.preventDefault();

        const sugerencia = document.getElementById("sugerencia-tema");
        const mensaje = document.getElementById("mensaje-sugerencia");

        if (sugerencia.value.trim() === "") {
            mensaje.textContent = "Escribe una sugerencia.";
            return;
        }

        sugerencia.select();

        if (navigator.clipboard) {
            navigator.clipboard.writeText(sugerencia.value).then(function () {
                mensaje.textContent = "Sugerencia copiada.";
            }).catch(function () {
                mensaje.textContent = "Presiona Ctrl+C para copiar.";
            });
        } else {
            mensaje.textContent = "Presiona Ctrl+C para copiar.";
        }
    });
}


iniciarFormulario();
iniciarFavoritos();
iniciarArticulos();