export function iniciarMenu() {
    const encabezado = document.querySelector(".encabezado");

    if (!encabezado) {
        return;
    }

    const menuAnterior = encabezado.querySelector(".menu");

    if (menuAnterior) {
        menuAnterior.remove();
    }

    const script = document.querySelector('script[src$="assets/js/main.js"]');
    const rutaBase = script && script.getAttribute("src").startsWith("../") ? "../" : "";

    let perfil = null;

    try {
        perfil = JSON.parse(localStorage.getItem("nodo_perfil"));
    } catch (error) {
        console.error("No se pudo leer el perfil", error);
    }

    const tienePerfil = perfil && typeof perfil.nombre === "string" && perfil.nombre.trim() !== "";

    const menu = document.createElement("nav");
    menu.classList.add("menu");

    menu.innerHTML = `
        <button type="button" class="menu__boton boton-interactivo" id="boton-menu" aria-expanded="false" aria-controls="lista-menu">
            ☰ Menú
        </button>

        <ul class="menu__lista" id="lista-menu">
            <li class="menu__item">
                <a class="menu__enlace" href="${rutaBase}index.html">Inicio</a>
            </li>
            <li class="menu__item">
                <a class="menu__enlace" href="${rutaBase}pages/articulos.html">Artículos</a>
            </li>
            <li class="menu__item">
                <a class="menu__enlace" href="${rutaBase}pages/favoritos.html">Mis favoritos</a>
            </li>
            <li class="menu__item">
                <a class="menu__enlace" href="${rutaBase}pages/temas.html">Temas</a>
            </li>
            <li class="menu__item">
                <a class="menu__enlace" href="${rutaBase}pages/sobre-mi.html">Sobre mí</a>
            </li>
            <li class="menu__item" id="opcion-registro">
                <a class="menu__enlace" href="${rutaBase}pages/registro.html">Registro</a>
            </li>
            <li class="menu__item" id="opcion-cerrar">
                <button type="button" class="tema__boton boton-interactivo" id="boton-cerrar-sesion">
                    Cerrar sesión
                </button>
            </li>
            <li class="menu__item">
                <button type="button" class="tema__boton boton-interactivo" id="boton-tema" aria-pressed="true">
                    Modo
                </button>
            </li>
        </ul>
    `;

    encabezado.prepend(menu);

    const opcionRegistro = document.getElementById("opcion-registro");
    const opcionCerrar = document.getElementById("opcion-cerrar");

    opcionRegistro.hidden = Boolean(tienePerfil);
    opcionCerrar.hidden = !tienePerfil;

    const botonVolver = encabezado.querySelector(":scope > a.boton");

    if (botonVolver) {
        botonVolver.remove();
    }

    const titulo = encabezado.querySelector("h1");

    if (titulo && !titulo.querySelector("a")) {
        const enlaceInicio = document.createElement("a");
        enlaceInicio.href = rutaBase + "index.html";
        enlaceInicio.textContent = titulo.textContent;
        enlaceInicio.style.color = "inherit";
        enlaceInicio.style.textDecoration = "none";

        titulo.replaceChildren(enlaceInicio);
    }

    const botonMenu = document.getElementById("boton-menu");

    botonMenu.addEventListener("click", function () {
        const abierto = menu.classList.toggle("menu--abierto");
        botonMenu.setAttribute("aria-expanded", String(abierto));
    });

    const botonCerrar = document.getElementById("boton-cerrar-sesion");

    botonCerrar.addEventListener("click", function () {
        localStorage.removeItem("nodo_perfil");
        window.location.href = rutaBase + "index.html";
    });
}