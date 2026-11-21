const clavePerfil = "nodo_perfil";


export function guardarPerfilLocal(nombre) {
    const perfil = {
        nombre: nombre.trim()
    };

    try {
        localStorage.setItem(clavePerfil, JSON.stringify(perfil));
    } catch (error) {
        console.error("No se pudo guardar el perfil", error);
    }
}


function leerPerfilLocal() {
    try {
        const perfil = JSON.parse(localStorage.getItem(clavePerfil));

        if (perfil && typeof perfil.nombre === "string" && perfil.nombre.trim() !== "") {
            return perfil;
        }

        return null;
    } catch (error) {
        console.error("No se pudo leer el perfil", error);
        return null;
    }
}


export function iniciarPerfil() {
    const bienvenida = document.querySelector(".bienvenida");

    if (!bienvenida) {
        return;
    }

    const perfilAnterior = document.getElementById("perfil-local");

    if (perfilAnterior) {
        perfilAnterior.remove();
    }

    const perfil = leerPerfilLocal();

    if (!perfil) {
        return;
    }

    const contenedor = document.createElement("div");
    contenedor.id = "perfil-local";

    const saludo = document.createElement("p");
    saludo.classList.add("destacado");
    saludo.textContent = "Hola, " + perfil.nombre + " 👋";

    const botonCerrar = document.createElement("button");
    botonCerrar.type = "button";
    botonCerrar.classList.add("boton");
    botonCerrar.textContent = "Cerrar perfil";

    botonCerrar.addEventListener("click", function () {
        localStorage.removeItem(clavePerfil);
        window.location.reload();
    });

    contenedor.append(saludo, botonCerrar);

    const titulo = bienvenida.querySelector("h2");

    if (titulo) {
        bienvenida.insertBefore(contenedor, titulo);
    } else {
        bienvenida.append(contenedor);
    }
}