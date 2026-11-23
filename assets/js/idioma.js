const claveIdioma = "nodo_idioma";
const base = new URL("../../", import.meta.url);

const originales = new WeakMap();
const originalesArticulo = new WeakMap();
let interfaz = {};
let articulos = {};
let idioma = "es";
let observador = null;
let programado = false;

function normalizar(texto) {
    return texto.replace(/\s+/g, " ").trim();
}

function escribir(elemento, texto, originalHtml) {
    const soloNegrita = /^\s*<strong(?:\s|>)/i.test(originalHtml) &&
        /<\/strong>\s*$/i.test(originalHtml);

    if (soloNegrita) {
        const negrita = document.createElement("strong");
        negrita.textContent = texto;
        elemento.replaceChildren(negrita);
    } else {
        elemento.textContent = texto;
    }
}

function obtenerTraduccionArticulo() {
    const nombre = decodeURIComponent(
        location.pathname.split("/").pop().replace(/\.html$/, "")
    );
    return articulos[nombre] || null;
}

function traducirArticulo() {
    const lectura = document.querySelector(".lectura");
    const traduccion = obtenerTraduccionArticulo();
    if (!lectura || !traduccion || !Array.isArray(traduccion.content)) return;

    const nodos = Array.from(lectura.children).filter(function (elemento) {
        return elemento.matches("h3, p:not(.destacado):not(.lectura__autor)");
    });

    nodos.forEach(function (elemento, indice) {
        if (!originalesArticulo.has(elemento)) {
            originalesArticulo.set(elemento, elemento.innerHTML);
        }
        const original = originalesArticulo.get(elemento);
        const textoIngles = traduccion.content[indice];

        if (idioma === "en" && textoIngles !== undefined) {
            if (normalizar(elemento.textContent) !== normalizar(textoIngles)) {
                escribir(elemento, textoIngles, original);
            }
        } else if (idioma === "es" && elemento.innerHTML !== original) {
            elemento.innerHTML = original;
        }
    });
}

function traducirInterfaz() {

    const articuloReal = Boolean(obtenerTraduccionArticulo());
    const elementos = document.querySelectorAll(
        "title, h1, h2, h3, h4, p, a, button, label, legend, option, small, span"
    );

    elementos.forEach(function (elemento) {
        if (elemento.closest("#menu-idioma")) return;
        const lectura = elemento.closest(".lectura");
        if (articuloReal && lectura && elemento.parentElement === lectura &&
            elemento.matches("h3, p:not(.destacado):not(.lectura__autor)")) return;

        if (Array.from(elemento.children).some(function (hijo) {
            return hijo.matches("a, button, p, h1, h2, h3, label, span");
        })) return;

        const texto = normalizar(elemento.textContent);
        if (!texto) return;
        const estado = originales.get(elemento);

        if (idioma === "en") {
            if (estado && texto === normalizar(estado.en)) return;
            const traduccion = interfaz[texto];
            if (traduccion && texto !== traduccion) {
                originales.set(elemento, {
                    es: texto,
                    en: traduccion,
                    html: elemento.innerHTML
                });
                escribir(elemento, traduccion, elemento.innerHTML);
            }
        } else if (estado && texto === normalizar(estado.en)) {
            elemento.innerHTML = estado.html;
        }
    });

    const placeholders = {
        "Buscar artículos...": "Search articles...",
        "Escribe tu idea...": "Write your idea...",
        "Escribe tu nombre": "Enter your name",
        "ejemplo@correo.com": "example@email.com",
        "Crea una contraseña": "Create a password",
        "Escribe aqui algun tema que te interese": "Write a topic that interests you"
    };

    document.querySelectorAll("[placeholder]").forEach(function (elemento) {
        if (!elemento.hasAttribute("data-placeholder-original")) {
            elemento.setAttribute("data-placeholder-original", elemento.placeholder);
        }
        const original = elemento.getAttribute("data-placeholder-original");
        const nuevo = idioma === "en" ? (placeholders[original] || original) : original;
        if (elemento.placeholder !== nuevo) elemento.placeholder = nuevo;
    });

    document.documentElement.lang = idioma;

    const boton = document.getElementById("boton-idioma");
    if (boton) {
        const texto = idioma === "es" ? "🌐 ES / EN" : "🌐 EN / ES";
        if (boton.textContent !== texto) boton.textContent = texto;
        boton.setAttribute("aria-label", idioma === "es"
            ? "Switch to English" : "Cambiar a español");
    }
}

function aplicar() {

    if (observador) observador.disconnect();
    try {
        traducirArticulo();
        traducirInterfaz();
    } finally {
        if (observador) {
            observador.observe(document.body, {
                childList: true,
                subtree: true,
                characterData: true
            });
        }
    }
}

function programar() {
    if (programado) return;
    programado = true;
    queueMicrotask(function () {
        programado = false;
        aplicar();
    });
}

export async function iniciarIdioma() {
    try {
        const [respuestaInterfaz, respuestaArticulos] = await Promise.all([
            fetch(new URL("assets/data/interfaz-en.json", base)),
            fetch(new URL("assets/data/traducciones-en.json", base))
        ]);
        if (!respuestaInterfaz.ok || !respuestaArticulos.ok) {
            throw new Error("No se pudieron cargar las traducciones");
        }
        interfaz = await respuestaInterfaz.json();
        articulos = await respuestaArticulos.json();
    } catch (error) {
        console.error("No se pudieron cargar las traducciones", error);
        return;
    }

    try {
        idioma = localStorage.getItem(claveIdioma) === "en" ? "en" : "es";
    } catch (error) {
        idioma = "es";
    }

    const lista = document.getElementById("lista-menu");
    if (lista && !document.getElementById("menu-idioma")) {
        const item = document.createElement("li");
        item.className = "menu__item";
        item.id = "menu-idioma";

        const boton = document.createElement("button");
        boton.type = "button";
        boton.className = "tema__boton boton-interactivo";
        boton.id = "boton-idioma";
        boton.addEventListener("click", function () {
            idioma = idioma === "es" ? "en" : "es";
            try {
                localStorage.setItem(claveIdioma, idioma);
            } catch (error) {
                console.error("No se pudo guardar el idioma", error);
            }
            aplicar();
        });
        item.append(boton);
        lista.append(item);
    }

    aplicar();
    observador = new MutationObserver(programar);
    observador.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
    });
}