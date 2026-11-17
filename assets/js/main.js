import { iniciarFormulario } from "./formulario.js";
import { iniciarArticulos } from "./articulos.js";

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

if (buscador) {
    buscador.addEventListener("input", function () {
        const texto = buscador.value.trim().toLowerCase();
        const tarjetas = document.querySelectorAll(".articulos__tarjeta");
        let encontrados = 0;

        tarjetas.forEach(function (tarjeta) {
            const contenido = tarjeta.textContent.toLowerCase();
            const coincide = contenido.includes(texto);

            tarjeta.classList.toggle("oculto", !coincide);

            if (coincide) {
                encontrados++;
            }
        });

        const estado = document.getElementById("estado-articulos");

        if (estado && tarjetas.length > 0) {
            estado.textContent = encontrados === 0 ? "No se encontraron artículos." : "";
        }
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
iniciarArticulos();