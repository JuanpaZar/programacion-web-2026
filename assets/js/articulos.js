import { actualizarFavoritos, leerFavoritos } from "./favoritos.js";

export async function iniciarArticulos() {
    const lista = document.getElementById("lista-articulos");

    if (!lista) {
        return;
    }

    const estado = document.getElementById("estado-articulos");
    const soloFavoritos = lista.dataset.soloFavoritos === "true";

    estado.textContent = soloFavoritos ? "Cargando favoritos..." : "Cargando artículos...";

    try {
        const respuesta = await fetch("../assets/data/articulos.json");

        if (!respuesta.ok) {
            throw new Error("Error al cargar los artículos");
        }

        const articulos = await respuesta.json();

        if (!Array.isArray(articulos)) {
            throw new Error("Los datos no son validos");
        }

        function mostrarArticulos() {
            lista.replaceChildren();

            const favoritos = leerFavoritos();

            const articulosVisibles = soloFavoritos
                ? articulos.filter(function (articulo) {
                    return favoritos.includes(String(articulo.id));
                })
                : articulos;

            articulosVisibles.forEach(function (articulo) {
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

                const favorito = document.createElement("button");
                favorito.type = "button";
                favorito.classList.add("boton-favorito");
                favorito.dataset.favorito = String(articulo.id);
                favorito.setAttribute("aria-pressed", "false");
                favorito.setAttribute("aria-label", "Guardar " + articulo.titulo);

                const enlace = document.createElement("a");
                enlace.classList.add("boton");
                enlace.href = articulo.enlace;
                enlace.textContent = "Leer artículo";

                tarjeta.append(titulo, descripcion, autor, favorito, enlace);
                lista.append(tarjeta);
            });

            actualizarFavoritos();

            if (soloFavoritos) {
                estado.textContent = articulosVisibles.length === 0
                    ? "Todavía no tienes artículos favoritos. Guarda alguno desde Inicio o Artículos."
                    : "";
            } else {
                estado.textContent = articulosVisibles.length === 0
                    ? "No hay artículos disponibles."
                    : "";
            }

            const buscador = document.getElementById("buscador-articulos");

            if (buscador) {
                buscador.dispatchEvent(new Event("input"));
            }
        }

        mostrarArticulos();

        if (soloFavoritos) {
            document.addEventListener("favoritos-actualizados", mostrarArticulos);
        }

    } catch (error) {
        console.error(error);

        estado.textContent = soloFavoritos
            ? "No se pudieron cargar tus favoritos."
            : "No se pudieron cargar los artículos.";
    }
}