export async function iniciarArticulos() {
    const lista = document.getElementById("lista-articulos");

    if (!lista) {
        return;
    }

    const estado = document.getElementById("estado-articulos");

    estado.textContent = "Cargando artículos...";

    try {
        const respuesta = await fetch("../assets/data/articulos.json");

        if (!respuesta.ok) {
            throw new Error("Error al cargar los artículos");
        }

        const articulos = await respuesta.json();

        if (!Array.isArray(articulos)) {
            throw new Error("Los datos no son validos");
        }

        lista.replaceChildren();

        articulos.forEach(function (articulo) {
            const tarjeta = document.createElement("article");
            tarjeta.classList.add("articulos__tarjeta");

            const categoria = document.createElement("p");
            categoria.classList.add("articulos__categoria");

            const textoCategoria = document.createElement("strong");
            textoCategoria.textContent = articulo.categoria;
            categoria.append(textoCategoria);

            tarjeta.append(categoria);

            if (articulo.imagen) {
                const imagen = document.createElement("img");
                imagen.classList.add("articulos__imagen");
                imagen.src = articulo.imagen;
                imagen.alt = articulo.alt;
                imagen.loading = "lazy";

                tarjeta.append(imagen);
            } else {
                const portada = document.createElement("div");
                portada.classList.add("articulos__imagen-texto");
                portada.textContent = articulo.portada;

                tarjeta.append(portada);
            }

            const titulo = document.createElement("h3");
            titulo.classList.add("articulos__titulo");
            titulo.textContent = articulo.titulo;

            const descripcion = document.createElement("p");
            descripcion.textContent = articulo.descripcion;

            const autor = document.createElement("small");
            autor.textContent = articulo.autor;

            const enlace = document.createElement("a");
            enlace.classList.add("boton");
            enlace.href = articulo.enlace;
            enlace.textContent = "Leer artículo";

            tarjeta.append(titulo, descripcion, autor, enlace);
            lista.append(tarjeta);
        });

        estado.textContent = articulos.length === 0 ? "No hay artículos disponibles." : "";

        const buscador = document.getElementById("buscador-articulos");
        buscador.dispatchEvent(new Event("input"));

    } catch (error) {
        console.error(error);
        estado.textContent = "No se pudieron cargar los artículos.";
    }
}