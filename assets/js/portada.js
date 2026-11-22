export async function iniciarPortada() {
    const portada = document.querySelector(".portada__contenido");

    if (!portada) {
        return;
    }

    try {
        const respuesta = await fetch("assets/data/articulos.json");

        if (!respuesta.ok) {
            throw new Error("No se pudieron cargar los artículos");
        }

        const articulos = await respuesta.json();

        if (!Array.isArray(articulos) || articulos.length === 0) {
            return;
        }

        let disponibles = articulos;

        const anterior = sessionStorage.getItem("nodo_ultima_portada");

        if (articulos.length > 1) {
            disponibles = articulos.filter(function (articulo) {
                return String(articulo.id) !== anterior;
            });
        }

        const indice = Math.floor(Math.random() * disponibles.length);
        const elegido = disponibles[indice];

        sessionStorage.setItem("nodo_ultima_portada", String(elegido.id));

        const imagen = portada.querySelector(".portada__imagen");
        const categoria = portada.querySelector(".portada__informacion .destacado");
        const titulo = portada.querySelector(".portada__informacion h3");
        const parrafos = portada.querySelectorAll(".portada__informacion > p:not(.destacado)");
        const enlace = portada.querySelector(".portada__informacion a.boton");

        if (imagen) {
            imagen.src = elegido.imagen.replace(/^\.\.\//, "");
            imagen.alt = elegido.alt;
        }

        if (categoria) {
            categoria.textContent = elegido.categoria;
        }

        if (titulo) {
            titulo.textContent = elegido.titulo;
        }

        if (parrafos.length > 0) {
            parrafos[0].textContent = elegido.descripcion;
        }

        if (parrafos.length > 1) {
            parrafos[1].remove();
        }

        if (enlace) {
            enlace.href = elegido.enlace.replace(/^\.\.\//, "");
        }

    } catch (error) {
        console.error("No se pudo actualizar la lectura recomendada", error);
    }
}