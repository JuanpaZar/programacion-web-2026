import Swal from "../vendor/sweetalert2.esm.all.js";

const claveFavoritos = "nodo_favoritos";
const clavePerfil = "nodo_perfil";


export function tieneSesion() {
    try {
        const perfil = JSON.parse(localStorage.getItem(clavePerfil));

        return Boolean(
            perfil &&
            typeof perfil.nombre === "string" &&
            perfil.nombre.trim() !== ""
        );
    } catch (error) {
        console.error("No se pudo leer el perfil", error);
        return false;
    }
}


export function solicitarRegistro() {
    const script = document.querySelector('script[src$="assets/js/main.js"]');
    const rutaBase = script && script.getAttribute("src").startsWith("../") ? "../" : "";

    const ingles = localStorage.getItem("nodo_idioma") === "en";

    Swal.fire({
        icon: "info",
        title: ingles ? "Sign Up to Continue" : "Necesitas registrarte",
        text: ingles ? "Create a profile to save articles and react to posts." : "Crea un perfil para guardar artículos y reaccionar a las publicaciones.",
        showCancelButton: true,
        confirmButtonText: ingles ? "Sign Up" : "Registrarme",
        cancelButtonText: ingles ? "Cancel" : "Cancelar"
    }).then(function (resultado) {
        if (resultado.isConfirmed) {
            window.location.href = rutaBase + "pages/registro.html";
        }
    });
}


export function leerFavoritos() {
    try {
        const favoritos = JSON.parse(localStorage.getItem(claveFavoritos));

        return Array.isArray(favoritos) ? favoritos : [];
    } catch (error) {
        console.error("No se pudieron leer los favoritos", error);
        return [];
    }
}


function guardarFavoritos(favoritos) {
    try {
        localStorage.setItem(claveFavoritos, JSON.stringify(favoritos));
    } catch (error) {
        console.error("No se pudieron guardar los favoritos", error);
    }
}


export function actualizarFavoritos() {
    const favoritos = leerFavoritos();
    const botones = document.querySelectorAll(".boton-favorito");

    botones.forEach(function (boton) {
        const id = boton.dataset.favorito;
        const guardado = favoritos.includes(id);

        boton.textContent = guardado ? "♥ Guardado" : "♡ Guardar";
        boton.classList.toggle("activo", guardado);
        boton.setAttribute("aria-pressed", String(guardado));
    });
}


export function iniciarFavoritos() {
    actualizarFavoritos();

    document.addEventListener("click", function (e) {
        const boton = e.target.closest(".boton-favorito");

        if (!boton) {
            return;
        }

        if (!tieneSesion()) {
            solicitarRegistro();
            return;
        }

        const id = boton.dataset.favorito;
        let favoritos = leerFavoritos();

        if (favoritos.includes(id)) {
            favoritos = favoritos.filter(function (favorito) {
                return favorito !== id;
            });
        } else {
            favoritos.push(id);
        }

        guardarFavoritos(favoritos);
        actualizarFavoritos();

        document.dispatchEvent(new Event("favoritos-actualizados"));
    });
}