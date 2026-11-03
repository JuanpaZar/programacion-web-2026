
import { iniciarFormulario } from "./formulario.js";

const botonMenu = document.getElementById("boton-menu");
const menu = document.querySelector(".menu");

if (botonMenu && menu) {
    botonMenu.addEventListener("click", function () {
        const abierto = menu.classList.toggle("menu--abierto");
        botonMenu.setAttribute("aria-expanded", String(abierto));
    });
}


const botonTema = document.getElementById("boton-tema");

if (botonTema) {
    botonTema.addEventListener("click", function () {
        const modoOscuro = document.body.classList.toggle("tema-oscuro");

        document.body.classList.toggle("tema-claro", !modoOscuro);
        botonTema.setAttribute("aria-pressed", String(modoOscuro));
    });
}


const buscador = document.getElementById("buscador-articulos");
const tarjetas = document.querySelectorAll(".articulos__tarjeta");

if (buscador) {
    buscador.addEventListener("input", function () {
        const texto = buscador.value.trim().toLowerCase();

        tarjetas.forEach(function (tarjeta) {
            const contenido = tarjeta.textContent.toLowerCase();
            tarjeta.classList.toggle("oculto", !contenido.includes(texto));
        });
    });
}


iniciarFormulario();
