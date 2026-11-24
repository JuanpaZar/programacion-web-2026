import { iniciarIdioma } from "./idioma.js";
import { iniciarPropuestas } from "./propuestas.js";
import { iniciarFormulario } from "./formulario.js";
import { iniciarArticulos } from "./articulos.js";
import { iniciarFavoritos } from "./favoritos.js";
import { iniciarMenu } from "./menu.js";
import { iniciarPerfil } from "./perfil.js";
import { iniciarReacciones } from "./reacciones.js";
import { iniciarPortada } from "./portada.js";

iniciarMenu();

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
    botonTema.setAttribute(
        "aria-pressed",
        String(document.body.classList.contains("tema-oscuro"))
    );

    botonTema.addEventListener("click", function () {
        const modoOscuro = document.body.classList.toggle("tema-oscuro");

        document.body.classList.toggle("tema-claro", !modoOscuro);
        botonTema.setAttribute("aria-pressed", String(modoOscuro));

        try {
            localStorage.setItem(
                "nodo_tema",
                JSON.stringify(modoOscuro ? "oscuro" : "claro")
            );
        } catch (error) {
            console.error("No se pudo guardar el tema", error);
        }
    });
}

const buscador = document.getElementById("buscador-articulos");
const botonVerMas = document.getElementById("boton-ver-mas");

let mostrarTodos = false;

function filtrarArticulos() {
    if (!buscador) return;

    const texto = buscador.value.trim().toLowerCase();
    const tarjetas = document.querySelectorAll(".articulos__tarjeta");
    let encontrados = 0;

    tarjetas.forEach(function (tarjeta, indice) {
        const contenido = tarjeta.textContent.toLowerCase();
        const coincide = contenido.includes(texto);

        const mostrar = coincide &&
            (texto !== "" || mostrarTodos || indice < 4 || !botonVerMas);

        tarjeta.hidden = !mostrar;

        if (mostrar) {
            encontrados++;
        }
    });

    const estado = document.getElementById("estado-articulos");

    if (estado && tarjetas.length > 0) {
        estado.textContent = encontrados === 0
            ? "No se encontraron artículos."
            : "";
    }

    const estadoBusqueda = document.getElementById("estado-busqueda");

    if (estadoBusqueda) {
        estadoBusqueda.textContent = texto !== "" && encontrados === 0
            ? "No se encontraron artículos."
            : "";
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

        botonVerMas.textContent = mostrarTodos
            ? "Ver menos artículos"
            : "Ver más artículos";

        botonVerMas.setAttribute("aria-expanded", String(mostrarTodos));

        filtrarArticulos();
    });
}

iniciarFormulario();
iniciarFavoritos();
iniciarArticulos();
iniciarPerfil();
iniciarReacciones();
iniciarPortada();
iniciarPropuestas();
iniciarIdioma();